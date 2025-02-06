from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdXPromptsItem


class AntdXPrompts(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/prompts
    """

    Item = AntdXPromptsItem

    EVENTS = [
        EventListener("item_click",
                      callback=lambda block: block._internal.update(
                          bind_itemClick_event=True),
                      doc="Callback function when a prompt item is clicked."),
    ]

    # supported slots
    SLOTS = ['title', 'items']

    def __init__(
            self,
            props: dict | None = None,
            *,
            items: list[dict] | None = None,
            prefix_cls: str | None = None,
            title: str | None = None,
            vertical: bool | None = None,
            wrap: bool | None = None,
            styles: dict | None = None,
            class_names: dict | None = None,
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
        self.props = props
        self.items = items
        self.prefix_cls = prefix_cls
        self.title = title
        self.vertical = vertical
        self.wrap = wrap
        self.styles = styles
        self.class_names = class_names
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("prompts", type="antdx")

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
