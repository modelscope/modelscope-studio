from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdXThoughtChainItem
from .thought_chain_item import AntdXThoughtChainThoughtChainItem


class AntdXThoughtChain(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/thought-chain
    """

    Item = AntdXThoughtChainItem
    ThoughtChainItem = AntdXThoughtChainThoughtChainItem

    EVENTS = [
        EventListener("expand",
                      callback=lambda block: block._internal.update(
                          bind_expand_event=True),
                      doc="Callback function when expanded keys change."),
    ]

    # supported slots
    SLOTS = ['items']

    def __init__(
            self,
            *,
            expanded_keys: list[str] | None = None,
            default_expanded_keys: list[str] | None = None,
            items: list[dict] | None = None,
            line: bool | Literal['solid', 'dashed', "dotted"] | None = None,
            prefix_cls: str | None = None,
            additional_props: dict | None = None,
            styles: dict | str | None = None,
            class_names: dict | str | None = None,
            root_class_name: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.additional_props = additional_props
        self.items = items
        self.expanded_keys = expanded_keys
        self.default_expanded_keys = default_expanded_keys
        self.line = line
        self.prefix_cls = prefix_cls
        self.styles = styles
        self.class_names = class_names
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("thought-chain", type="antdx")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
