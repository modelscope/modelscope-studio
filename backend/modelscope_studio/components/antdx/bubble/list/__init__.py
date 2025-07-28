from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdXBubbleListItem
from .role import AntdXBubbleListRole


class AntdXBubbleList(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/bubble
    """
    Role = AntdXBubbleListRole
    Item = AntdXBubbleListItem

    EVENTS = [
        EventListener("scroll",
                      callback=lambda block: block._internal.update(
                          bind_scroll_event=True),
                      doc="Callback when the bubble list is scrolled.")
    ]

    # supported slots
    SLOTS = [
        'items',
        'roles',
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            items: list[dict] | None = None,
            roles: list[dict] | None = None,
            auto_scroll: bool | None = None,
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
        self.roles = roles
        self.auto_scroll = auto_scroll
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("bubble", "list", type="antdx")

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
