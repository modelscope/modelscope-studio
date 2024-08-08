import copy
import warnings
from typing import Callable, List, Union

import gradio
import gradio.utils
import httpx
from gradio.blocks import Block, BlockContext, Blocks
from gradio.context import Context
from gradio.events import EventListenerMethod
from gradio.exceptions import GradioVersionIncompatibleError
from gradio_client import Client
from gradio_client.client import Endpoint
from packaging import version

import modelscope_studio.components

_endpoint = "https://modelscope.cn"
_studio_endpoint = "https://s5k.cn"


def blocks_from_config(config: dict, fns: List[Callable],
                       proxy_url: str) -> Blocks:
    """
        Factory method that creates a Blocks from a config and list of functions. Used
        internally by the gradio.external.load() method.

        Parameters:
        config: a dictionary containing the configuration of the Blocks.
        fns: a list of functions that are used in the Blocks. Must be in the same order as the dependencies in the config.
        proxy_url: an external url to use as a root URL when serving files for components in the Blocks.
        """
    config = copy.deepcopy(config)
    components_config = config["components"]
    theme = config.get("theme", "default")
    original_mapping: dict[int, Block] = {}
    proxy_urls = {proxy_url}

    def get_block_instance(id: int) -> Block:
        for block_config in components_config:
            if block_config["id"] == id:
                break
        else:
            raise ValueError(f"Cannot find block with id {id}")
        cls = gradio.utils.component_or_layout_class(
            block_config["props"]["name"])

        # If a Gradio app B is loaded into a Gradio app A, and B itself loads a
        # Gradio app C, then the proxy_urls of the components in A need to be the
        # URL of C, not B. The else clause below handles this case.
        if block_config["props"].get("proxy_url") is None:
            block_config["props"]["proxy_url"] = f"{proxy_url}/"
        postprocessed_value = block_config["props"].pop("value", None)

        constructor_args = cls.recover_kwargs(block_config["props"])
        block = cls(**constructor_args)
        if postprocessed_value is not None:
            block.value = postprocessed_value  # type: ignore

        block_proxy_url = block_config["props"]["proxy_url"]
        block.proxy_url = block_proxy_url
        proxy_urls.add(block_proxy_url)
        if (_selectable := block_config["props"].pop("_selectable",
                                                     None)) is not None:
            block._selectable = _selectable  # type: ignore

        return block

    def iterate_over_children(children_list):
        for child_config in children_list:
            id = child_config["id"]
            block = get_block_instance(id)

            original_mapping[id] = block

            children = child_config.get("children")
            if children is not None:
                if not isinstance(block, BlockContext):
                    raise ValueError(
                        f"Invalid config, Block with id {id} has children but is not a BlockContext."
                    )
                with block:
                    iterate_over_children(children)

    derived_fields = ["types"]

    with Blocks(theme=theme) as blocks:
        # ID 0 should be the root Blocks component
        original_mapping[0] = Context.root_block or blocks

        iterate_over_children(config["layout"]["children"])

        first_dependency = None

        # add the event triggers
        for dependency, fn in zip(config["dependencies"], fns):
            # We used to add a "fake_event" to the config to cache examples
            # without removing it. This was causing bugs in calling gr.load
            # We fixed the issue by removing "fake_event" from the config in examples.py
            # but we still need to skip these events when loading the config to support
            # older demos
            if "trigger" in dependency and dependency[
                    "trigger"] == "fake_event":
                continue
            for field in derived_fields:
                dependency.pop(field, None)

            # older versions had a separate trigger field, but now it is part of the
            # targets field
            _targets = dependency.pop("targets")
            trigger = dependency.pop("trigger", None)
            is_then_event = False
            is_success_event = False

            # This assumes that you cannot combine multiple .then() events in a single
            # gr.on() event, which is true for now. If this changes, we will need to
            # update this code.
            if not isinstance(_targets[0], int) and _targets[0][1] == "then":
                if len(_targets) != 1:
                    raise ValueError(
                        "This logic assumes that .then() events are not combined with other events in a single gr.on() event"
                    )
                is_then_event = True
            elif (not isinstance(_targets[0], int)
                  and _targets[0][1] == "success"):
                if len(_targets) != 1:
                    raise ValueError(
                        "This logic assumes that .success() events are not combined with other events in a single gr.on() event"
                    )
                is_success_event = True

            dependency.pop("backend_fn")
            dependency.pop("documentation", None)
            dependency["inputs"] = [
                original_mapping[i] for i in dependency["inputs"]
            ]
            dependency["outputs"] = [
                original_mapping[o] for o in dependency["outputs"]
            ]
            dependency.pop("status_tracker", None)
            dependency.pop("zerogpu", None)
            dependency["preprocess"] = False
            dependency["postprocess"] = False
            if is_then_event:
                targets = [EventListenerMethod(None, "then")]
                dependency["trigger_after"] = dependency.pop("trigger_after")
                dependency["trigger_only_on_success"] = dependency.pop(
                    "trigger_only_on_success")
                dependency["no_target"] = True
            elif is_success_event:
                targets = [EventListenerMethod(None, _targets[0][1])]
                dependency["trigger_after"] = dependency.pop("trigger_after")
                dependency["trigger_only_on_success"] = dependency.pop(
                    "trigger_only_on_success")
                dependency["no_target"] = True
            else:
                targets = [
                    getattr(
                        original_mapping[
                            target if isinstance(target, int) else target[0]],
                        trigger if isinstance(target, int) else target[1],
                    ) for target in _targets
                ]
                targets = [
                    EventListenerMethod(
                        t.__self__ if t.has_trigger else None,
                        t.event_name,  # type: ignore
                    ) for t in targets
                ]
            dependency = blocks.set_event_trigger(targets=targets,
                                                  fn=fn,
                                                  **dependency)[0]
            if first_dependency is None:
                first_dependency = dependency

        # Allows some use of Interface-specific methods with loaded Spaces
        if first_dependency and Context.root_block:
            blocks.predict = [fns[0]]
            if version.Version(gradio.__version__) < version.Version("4.28.0"):
                blocks.input_components = [
                    Context.root_block.blocks[i]
                    for i in first_dependency["inputs"]
                ]
                blocks.output_components = [
                    Context.root_block.blocks[o]
                    for o in first_dependency["outputs"]
                ]
            else:
                blocks.input_components = first_dependency.inputs
                blocks.output_components = first_dependency.outputs
            blocks.__name__ = "Interface"
            blocks.api_mode = True
    blocks.proxy_urls = proxy_urls
    return blocks


def load(
    name: str,
    token: Union[str, None] = None,
    **kwargs,
) -> Blocks:
    """
    Constructs a demo from a ModelScope Studio repo. The input
    and output components are automatically loaded from the repo. Note that if a Space is loaded, certain high-level attributes of the Blocks (e.g.
    custom `css`, `js`, and `head` attributes) will not be loaded.
    Parameters:
        name: the name of the ModelScope Studio repo (e.g. "modelscope/modelscope-studio").
        token: optional access token for loading private ModelScope Studio repo. Find your sdk token here: https://modelscope.cn/my/myaccesstoken.
    Returns:
        a Gradio Blocks object for the given model
    Example:
        import modelscope_studio as mgr
        demo = gr.load("modelscope/modelscope-studio")
        demo.launch()
    """
    return load_blocks_from_repo(name=name, token=token, **kwargs)


def load_blocks_from_repo(
    name: str,
    token: Union[str, None],
    **kwargs,
) -> Blocks:
    """Creates and returns a Blocks instance from a ModelScope Studio repo."""
    src = 'spaces'

    factory_methods: dict[str, Callable] = {
        "spaces": from_spaces,
    }
    if src.lower() not in factory_methods:
        raise ValueError(
            f"parameter: src must be one of {factory_methods.keys()}")

    blocks: gradio.Blocks = factory_methods[src](name, token, **kwargs)
    return blocks


def from_spaces(space_name: str, token: Union[str, None], **kwargs) -> Blocks:
    space_url = f"{_endpoint}/studios/{space_name}"

    print(f"Fetching Space from: {space_url}")
    access = False

    response = httpx.get(
        f"{_endpoint}/api/v1/studio/{space_name}/access?sdk_token={token}", )
    if response.status_code == 200:
        access = response.json().get("Data", {}).get('access')

    if not access:
        raise ValueError(
            f"Could not find Space: {space_name}. If it is a private or gated Space, please provide your ModelScope access token (https://modelscope.cn/my/myaccesstoken) as the argument for the `token` parameter."
        )

    if kwargs:
        warnings.warn(
            "You cannot override parameters for this Space by passing in kwargs. "
            "Instead, please load the Space as a function and use it to create a "
            "Blocks or Interface locally. You may find this Guide helpful: "
            "https://gradio.app/using_blocks_like_functions/")
    return from_spaces_blocks(
        space_name=space_name,
        token=token,
    )


def from_spaces_blocks(
    space_name: str,
    token: Union[str, None],
) -> Blocks:
    component_or_layout_class = gradio.utils.component_or_layout_class
    try:
        space = f"{_studio_endpoint}/api/v1/studio/{space_name}/gradio/"
        kwargs = {}
        if version.Version(gradio.__version__) > version.Version('4.35.0'):
            kwargs["download_files"] = False
            kwargs["_skip_components"] = False
        elif version.Version(gradio.__version__) > version.Version('4.19.1'):
            kwargs["download_files"] = False
            kwargs["_skip_components"] = False
            kwargs["upload_files"] = False
        elif version.Version(gradio.__version__) == version.Version('4.19.1'):
            kwargs["download_files"] = False
        client = Client(
            space,
            # convert to modelscope token
            hf_token=token,
            **kwargs)
        # We set deserialize to False to avoid downloading output files from the server.
        # Instead, we serve them as URLs using the /proxy/ endpoint directly from the server.

        if client.app_version < version.Version("4.0.0b14"):
            raise GradioVersionIncompatibleError(
                f"Gradio version 4.x cannot load spaces with versions less than 4.x ({client.app_version})."
                "Please downgrade to version 3 to load this space.")

        if client.app_version != version.Version(gradio.__version__):
            print(
                f"Gradio local version {gradio.__version__} does not match the space version {client.app_version}, it might lead to some compatibility issues."
            )

        # Use end_to_end_fn here to properly upload/download all files
        predict_fns = []

        for fn_index, endpoint in enumerate(client.endpoints) if isinstance(
                client.endpoints, list) else client.endpoints.items():
            if not isinstance(endpoint, Endpoint):
                raise TypeError(
                    f"Expected endpoint to be an Endpoint, but got {type(endpoint)}"
                )
            helper = client.new_helper(fn_index)
            if endpoint.backend_fn:
                predict_fns.append(endpoint.make_end_to_end_fn(helper))
            else:
                predict_fns.append(None)
        client_src = client.src[:-1] if client.src.endswith(
            '/') else client.src
        if version.Version(gradio.__version__) >= version.Version('4.29.0'):
            blocks = Blocks.from_config(client.config, predict_fns, client_src)
        else:
            has_custom_component = False

            components = [
                (name, cls)
                for name, cls in modelscope_studio.components.__dict__.items()
                if isinstance(cls, type)
            ]

            def override_component_or_layout_class(cls_name: str):
                for name, cls in components:
                    if name.lower() == cls_name.replace("_", "") and (
                            issubclass(cls, gradio.components.Component)
                            or issubclass(cls, gradio.blocks.BlockContext)):
                        return cls
                return component_or_layout_class(cls_name)

            for component in client.config.get("components", []):
                for (name, cls) in components:
                    if (name.lower() == component["props"]["name"].replace(
                            "_", "")):
                        has_custom_component = True
                        break
                if has_custom_component:
                    break

            if has_custom_component:
                gradio.utils.component_or_layout_class = override_component_or_layout_class
                blocks = blocks_from_config(client.config, predict_fns,
                                            client_src)
            else:
                blocks = Blocks.from_config(client.config, predict_fns,
                                            client_src)
    finally:
        gradio.utils.component_or_layout_class = component_or_layout_class

    return blocks
