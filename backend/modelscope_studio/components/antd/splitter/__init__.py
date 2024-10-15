from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .panel import AntdSplitterPanel


class AntdSplitter(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/splitter

    Split panels to isolate.

    When to use:
    Can be used to separate areas horizontally or vertically. When you need to freely drag and adjust the size of each area. When you need to specify the maximum and minimum width and height of an area.
    """
    Panel = AntdSplitterPanel

    EVENTS = [
        EventListener("resize_start",
                      doc="Callback before dragging starts.",
                      callback=lambda block: block._internal.update(
                          bind_resizeStart_event=True)),
        EventListener("resize",
                      doc="Panel size change callback.",
                      callback=lambda block: block._internal.update(
                          bind_resize_event=True)),
        EventListener("resize_end",
                      doc="Drag end callback.",
                      callback=lambda block: block._internal.update(
                          bind_resizeEnd_event=True)),
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            layout: Literal['horizontal', 'vertical'] | None = 'horizontal',
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        """
        Parameters:
            layout: Layout direction.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.layout = layout

    FRONTEND_DIR = resolve_frontend_dir("splitter")

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
