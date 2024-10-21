from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdTabsItem


# as inputs, outputs
class AntdTabs(ModelScopeLayoutComponent):
    """
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
