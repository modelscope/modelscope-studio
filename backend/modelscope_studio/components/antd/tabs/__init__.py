from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdTabsItem


class AntdTabs(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tabs
    """
    Item = AntdTabsItem
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("edit",
                      callback=lambda block: block._internal.update(
                          bind_edit_event=True)),
        EventListener("tab_click",
                      callback=lambda block: block._internal.update(
                          bind_tabClick_event=True)),
        EventListener("tab_scroll",
                      callback=lambda block: block._internal.update(
                          bind_tabScroll_event=True)),
    ]

    # supported slots
    SLOTS = [
        'addIcon', 'removeIcon', 'renderTabBar', 'tabBarExtraContent',
        'tabBarExtraContent.left', 'tabBarExtraContent.right', 'more.icon',
        'items'
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            active_key: str | None = None,
            add_icon: str | None = None,
            animated: bool | dict | None = None,
            centered: bool | None = None,
            default_active_key: str | None = None,
            hide_add: bool | None = None,
            indicator: dict | None = None,
            items: list[dict] | None = None,
            more: dict | None = None,
            remove_icon: str | None = None,
            popup_class_name: str | None = None,
            render_tab_bar: str | None = None,
            size: Literal["small", "middle", "large"] | None = None,
            tab_bar_extra_content: str | dict | None = None,
            tab_bar_gutter: int | float | None = None,
            tab_bar_style: dict | None = None,
            tab_position: Literal["left", "right", "top", "bottom"]
        | None = None,
            destroy_inactive_tab_pane: bool | None = None,
            type: Literal["card", "line", "editable-card"] | None = None,
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
        self.add_icon = add_icon
        self.animated = animated
        self.centered = centered
        self.default_active_key = default_active_key
        self.hide_add = hide_add
        self.indicator = indicator
        self.items = items
        self.more = more
        self.remove_icon = remove_icon
        self.popup_class_name = popup_class_name
        self.render_tab_bar = render_tab_bar
        self.size = size
        self.tab_bar_extra_content = tab_bar_extra_content
        self.tab_bar_gutter = tab_bar_gutter
        self.tab_bar_style = tab_bar_style
        self.tab_position = tab_position
        self.destroy_inactive_tab_pane = destroy_inactive_tab_pane
        self.type = type
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("tabs")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
