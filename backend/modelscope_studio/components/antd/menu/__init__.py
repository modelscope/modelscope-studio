from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdMenuItem


class AntdMenu(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/menu
    """
    Item = AntdMenuItem

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("deselect",
                      callback=lambda block: block._internal.update(
                          bind_deselect_event=True)),
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
    ]

    # supported slots
    SLOTS = ["expandIcon", 'overflowedIndicator', "items"]

    def __init__(
            self,
            props: dict | None = None,
            *,
            open_keys: list[str] | None = None,
            selected_keys: list[str] | None = None,
            selectable: bool = True,
            default_open_keys: list[str] | None = None,
            default_selected_keys: list[str] | None = None,
            expand_icon: str | None = None,
            force_sub_menu_render: bool | None = None,
            inline_collapsed: bool | None = None,
            inline_indent: int = 24,
            items: list[dict] | None = None,
            mode: Literal['vertical', 'horizontal', 'inline']
        | None = 'vertical',
            multiple: bool | None = None,
            overflowed_indicator: str | None = None,
            sub_menu_close_delay: int | float = 0.1,
            sub_menu_open_delay: int | float = 0,
            theme: Literal['light', 'dark'] | None = None,
            trigger_sub_menu_action: Literal['click', 'hover'] = 'hover',
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
        self.open_keys = open_keys
        self.selected_keys = selected_keys
        self.selectable = selectable
        self.default_open_keys = default_open_keys
        self.default_selected_keys = default_selected_keys
        self.expand_icon = expand_icon
        self.force_sub_menu_render = force_sub_menu_render
        self.inline_collapsed = inline_collapsed
        self.inline_indent = inline_indent
        self.items = items
        self.mode = mode
        self.multiple = multiple
        self.overflowed_indicator = overflowed_indicator
        self.sub_menu_close_delay = sub_menu_close_delay
        self.sub_menu_open_delay = sub_menu_open_delay
        self.theme = theme
        self.trigger_sub_menu_action = trigger_sub_menu_action
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("menu")

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
