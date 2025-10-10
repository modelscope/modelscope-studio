import inspect
from timeit import Timer
from typing import Any, Callable, List, Set, Union

import gradio
from gradio.component_meta import ComponentMeta
from gradio.components.base import BlockContext, Component
from packaging import version

from .app_context import AppContext


class ModelScopeLayoutComponent(BlockContext, metaclass=ComponentMeta):
    """
    """

    EVENTS = []

    # supported slots
    SLOTS = []

    @property
    def skip_api(self):
        return True

    def __exit__(self, *args, **kwargs):
        self._internal.update(layout=True)
        super().__exit__(*args, **kwargs)

    def __init__(
            self,
            *,
            as_item: Union[str, None] = None,
            # gradio properties
            visible: bool = True,
            elem_id: Union[str, None] = None,
            elem_classes: Union[List[str], str, None] = None,
            elem_style: Union[dict, None] = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         **kwargs)
        AppContext.assert_app()
        self.as_item = as_item
        if self.parent:
            self._internal = dict(index=len(self.parent.children) - 1)
        else:
            self._internal = dict()

        self.elem_style = elem_style


class ModelScopeComponent(Component):
    """
    """
    EVENTS = []

    @property
    def skip_api(self):
        return False

    def api_info(self):
        if version.Version(gradio.__version__) >= version.Version("5.49.0"):
            return super().api_info()

        if hasattr(self, "_api_info"):
            return self._api_info
        self._api_info = super().api_info()
        return self._api_info

    def __init__(
            self,
            value: Any = None,
            *,
            as_item: Union[str, None] = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: Union[str, None] = None,
            elem_classes: Union[List[str], str, None] = None,
            elem_style: Union[dict, None] = None,
            key: Union[int, str, None] = None,
            every: Union[Timer, float, None] = None,
            inputs: Union[Component, List[Component], Set[Component],
                          None] = None,
            load_fn: Union[Callable, None] = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         value=value,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         key=key,
                         every=every,
                         inputs=inputs,
                         load_fn=load_fn,
                         render=render,
                         **kwargs)
        AppContext.assert_app()

        if self.parent:
            self._internal = dict(index=len(self.parent.children) - 1)
        else:
            self._internal = dict()
        self.as_item = as_item
        self.elem_style = elem_style


# MRO
class ModelScopeDataLayoutComponent(ModelScopeComponent,
                                    BlockContext,
                                    metaclass=ComponentMeta):
    """
    """
    EVENTS = []

    # supported slots
    SLOTS = []

    @property
    def skip_api(self):
        return False

    # fix gradio's bug
    @property
    def component_class_id(self):
        return self.get_component_class_id()

    @component_class_id.setter
    def component_class_id(self, value):
        pass

    def __exit__(self, *args, **kwargs):
        self._internal.update(layout=True)
        super().__exit__(*args, **kwargs)

    def __init__(
            self,
            value: Any = None,
            *,
            as_item: Union[str, None] = None,
            # gradio properties
            visible: bool = True,
            elem_id: Union[str, None] = None,
            elem_classes: Union[List[str], str, None] = None,
            elem_style: Union[dict, None] = None,
            key: Union[int, str, None] = None,
            every: Union[Timer, float, None] = None,
            inputs: Union[Component, List[Component], Set[Component],
                          None] = None,
            load_fn: Union[Callable, None] = None,
            render: bool = True,
            **kwargs):
        super().__init__(
            visible=visible,
            value=value,
            elem_id=elem_id,
            elem_classes=elem_classes,
            elem_style=elem_style,
            key=key,
            every=every,
            inputs=inputs,
            load_fn=load_fn,
            as_item=as_item,
            # disable render twice
            render=False,
            **kwargs)
        sig = inspect.signature(BlockContext.__init__)
        has_preserved_by_key_parameter = "preserved_by_key" in sig.parameters
        if has_preserved_by_key_parameter:
            preserved_by_key = kwargs.get("preserved_by_key", "value")
            BlockContext.__init__(self,
                                  visible=visible,
                                  elem_id=elem_id,
                                  elem_classes=elem_classes,
                                  render=render,
                                  key=key,
                                  preserved_by_key=preserved_by_key)
        else:
            BlockContext.__init__(self,
                                  visible=visible,
                                  elem_id=elem_id,
                                  elem_classes=elem_classes,
                                  render=render)
