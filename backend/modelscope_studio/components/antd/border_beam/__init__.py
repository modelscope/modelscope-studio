from __future__ import annotations

from typing import Any

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdBorderBeam(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/border-beam

    A decorative component that renders a flowing highlight animation along the
    border of its child container.

    When to use:
    - Draw attention to a card, button or panel without changing its layout.
    - Indicate an ongoing or AI-generated process in an ambient way.
    """

    EVENTS = []

    def __init__(
            self,
            additional_props: dict | None = None,
            *,
            color: str | list[dict] | None = None,
            count: int | None = None,
            duration: int | float | None = None,
            line_width: int | float | str | None = None,
            outset: int | float | str | None = None,
            size: int | float | str | None = None,
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
        self.additional_props = additional_props
        self.color = color
        self.count = count
        self.duration = duration
        self.line_width = line_width
        self.outset = outset
        self.size = size

    FRONTEND_DIR = resolve_frontend_dir("border-beam")

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
