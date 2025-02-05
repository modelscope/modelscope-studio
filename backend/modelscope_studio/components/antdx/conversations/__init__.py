from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdXConversationsItem


class AntdXConversations(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/conversations
    """

    Item = AntdXConversationsItem

    EVENTS = [
        EventListener("active_change",
                      callback=lambda block: block._internal.update(
                          bind_activeChange_event=True),
                      doc="Callback for selection change."),
        EventListener("menu_click",
                      callback=lambda block: block._internal.update(
                          bind_menu_click_event=True)),
        EventListener("menu_deselect",
                      callback=lambda block: block._internal.update(
                          bind_menu_deselect_event=True)),
        EventListener("menu_open_change",
                      callback=lambda block: block._internal.update(
                          bind_menu_openChange_event=True)),
        EventListener("menu_select",
                      callback=lambda block: block._internal.update(
                          bind_menu_select_event=True)),
    ]

    # supported slots
    SLOTS = [
        'menu.expandIcon', 'menu.overflowedIndicator', 'groupable.title',
        'items'
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            active_key: str | None = None,
            default_active_key: str | None = None,
            items: list[dict] | None = None,
            menu: str | dict | None = None,
            groupable: bool | dict | None = None,
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
        self.active_key = active_key
        self.default_active_key = default_active_key
        self.items = items
        self.menu = menu
        self.groupable = groupable
        self.styles = styles
        self.class_names = class_names
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("conversations", type="antdx")

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
