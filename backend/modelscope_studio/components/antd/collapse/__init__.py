from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdCollapseItem


class AntdCollapse(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/collapse
    """
    Item = AntdCollapseItem

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    # supported slots
    SLOTS = ["expandIcon", "items"]

    def __init__(
            self,
            props: dict | None = None,
            *,
            accordion: bool | None = None,
            active_key: str | float | list[int | float] | list[str]
        | None = None,
            bordered: bool = True,
            collapsible: Literal['header', 'icon', 'disabled'] | None = None,
            default_active_key: str | float | list[int | float] | list[str]
        | None = None,
            destroy_inactive_panel: bool | None = None,
            expand_icon: str | None = None,
            expand_icon_position: Literal['start', 'end'] | None = None,
            ghost: bool | None = None,
            items: list[dict] | None = None,
            size: Literal['large', 'middle', 'small'] | None = None,
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
        self.accordion = accordion
        self.active_key = active_key
        self.bordered = bordered
        self.collapsible = collapsible
        self.default_active_key = default_active_key
        self.destroy_inactive_panel = destroy_inactive_panel
        self.expand_icon = expand_icon
        self.expand_icon_position = expand_icon_position
        self.ghost = ghost
        self.items = items
        self.size = size
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("collapse")

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
