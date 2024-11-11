from __future__ import annotations

from typing import Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTimelineItem(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/timeline
    """
    EVENTS = []

    # supported slots
    SLOTS = ['dot', "label", "children"]

    def __init__(
            self,
            props: dict | None = None,
            *,
            color: str | None = None,
            dot: str | None = None,
            label: str | None = None,
            position: Literal["left", "right"] | None = None,
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
        self.color = color
        self.dot = dot
        self.label = label
        self.position = position

    FRONTEND_DIR = resolve_frontend_dir("timeline", "item")

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
