from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .checkable_tag import AntdTagCheckableTag
from .checkable_tag_group import AntdTagCheckableTagGroup


class AntdTag(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tag
    """
    CheckableTag = AntdTagCheckableTag
    CheckableTagGroup = AntdTagCheckableTagGroup

    EVENTS = [
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True))
    ]

    # supported slots
    SLOTS = ['icon', 'closeIcon']

    def __init__(
            self,
            value: str | None = None,
            additional_props: dict | None = None,
            *,
            disabled: bool | None = None,
            href: str | None = None,
            bordered: bool | None = None,
            close_icon: str | bool | None = None,
            color: str | None = None,
            icon: str | None = None,
            root_class_name: str | None = None,
            class_names: dict | str | None = None,
            styles: dict | str | None = None,
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
        self.class_names = class_names
        self.styles = styles
        self.value = value
        self.additional_props = additional_props
        self.bordered = bordered
        self.close_icon = close_icon
        self.color = color
        self.icon = icon
        self.root_class_name = root_class_name
        self.disabled = disabled
        self.href = href

    FRONTEND_DIR = resolve_frontend_dir("tag")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return "Tag"

    def example_value(self) -> Any:
        return "Tag"
