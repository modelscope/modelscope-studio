from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdBreadcrumbItem(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/breadcrumb
    """

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
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
        EventListener("dropdown_open_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_openChange_event=True)),
        EventListener("dropdown_menu_click",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_click_event=True)),
        EventListener("dropdown_menu_deselect",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_deselect_event=True)),
        EventListener("dropdown_menu_open_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_openChange_event=True)),
        EventListener("dropdown_menu_select",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_select_event=True)),
    ]

    # supported slots
    SLOTS = [
        'title',
        "menu.expandIcon",
        'menu.overflowedIndicator',
        "menu.items",
        "dropdownProps.dropdownRender",
        "dropdownProps.popupRender",
        "dropdownProps.menu.expandIcon",
        'dropdownProps.menu.overflowedIndicator',
        "dropdownProps.menu.items",
    ]

    def __init__(
            self,
            title: str | None = None,
            props: dict | None = None,
            *,
            dropdown_props: dict | None = None,
            href: str | None = None,
            path: str | None = None,
            menu: dict | None = None,
            type: Literal['separator'] | None = None,
            separator: str | None = None,
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
        self.title = title
        self.dropdown_props = dropdown_props
        self.href = href
        self.path = path
        self.menu = menu
        self.type = type
        self.separator = separator

    FRONTEND_DIR = resolve_frontend_dir("breadcrumb", "item")

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
