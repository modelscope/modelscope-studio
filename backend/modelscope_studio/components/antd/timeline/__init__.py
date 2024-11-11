from __future__ import annotations

from typing import Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdTimelineItem


class AntdTimeline(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/timeline
    """
    Item = AntdTimelineItem
    EVENTS = []

    # supported slots
    SLOTS = ['pending', 'pendingDot']

    def __init__(
            self,
            props: dict | None = None,
            *,
            mode: Literal["left", "alternate", "right"] | None = None,
            pending: str | bool | None = None,
            pending_dot: str | None = None,
            reverse: bool | None = None,
            items: list[dict] | None = None,
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
        self.mode = mode
        self.pending = pending
        self.pending_dot = pending_dot
        self.reverse = reverse
        self.items = items
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("timeline")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
