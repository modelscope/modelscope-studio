from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdDropdownButton(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/dropdown
    """

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
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
        "icon", 'dropdownRender', 'popupRender', 'buttonsRender',
        "menu.expandIcon", 'menu.overflowedIndicator', "menu.items"
    ]

    def __init__(
            self,
            value: str | None = "Run",
            props: dict | None = None,
            *,
            arrow: dict | bool | None = None,
            auto_adjust_overflow: bool = True,
            auto_focus: bool | None = None,
            disabled: bool | None = None,
            destroy_popup_on_hide: bool | None = None,
            destroy_on_hidden: bool | None = None,
            dropdown_render: str | None = None,
            popup_render: str | None = None,
            get_popup_container: str | None = None,
            menu: dict | None = None,
            overlay_class_name: str | None = None,
            overlay_style: dict | None = None,
            placement: Literal['topLeft', 'top', 'topRight', 'bottomLeft',
                               'bottom', 'bottomRight'] = "bottomLeft",
            trigger: list[Literal['click', 'hover',
                                  'contextMenu']] = ['hover'],
            open: bool | None = None,
            buttons_render: str | None = None,
            loading: bool | dict = False,
            danger: bool | None = None,
            icon: str | None = None,
            size: Literal["large", "middle", "small"] | None = None,
            type: Literal["primary", "dashed", "link", "text", "default"]
        | None = None,
            class_names: dict | None = None,
            styles: dict | None = None,
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
        self.value = value
        self.arrow = arrow
        self.auto_adjust_overflow = auto_adjust_overflow
        self.auto_focus = auto_focus
        self.disabled = disabled
        self.destroy_popup_on_hide = destroy_popup_on_hide
        self.destroy_on_hidden = destroy_on_hidden
        self.dropdown_render = dropdown_render
        self.popup_render = popup_render
        self.get_popup_container = get_popup_container
        self.menu = menu
        self.overlay_class_name = overlay_class_name
        self.overlay_style = overlay_style
        self.placement = placement
        self.trigger = trigger
        self.open = open
        self.buttons_render = buttons_render
        self.loading = loading
        self.danger = danger
        self.icon = icon
        self.size = size
        self.type = type
        self.class_names = class_names
        self.styles = styles
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("dropdown", "button")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return "Run"

    def example_value(self) -> Any:
        return "Run"
