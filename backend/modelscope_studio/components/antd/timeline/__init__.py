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
            additional_props: dict | None = None,
            *,
            mode: Literal["start", "alternate", "end"] | None = None,
            pending: str | bool | None = None,
            pending_dot: str | None = None,
            orientation: Literal["horizontal", "vertical"] | None = None,
            title_span: int | float | str | None = None,
            variant: Literal["filled", "outlined"] | None = None,
            reverse: bool | None = None,
            items: list[dict] | None = None,
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
        self.additional_props = additional_props
        self.mode = mode
        self.pending = pending
        self.pending_dot = pending_dot
        self.reverse = reverse
        self.orientation = orientation
        self.title_span = title_span
        self.variant = variant
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
