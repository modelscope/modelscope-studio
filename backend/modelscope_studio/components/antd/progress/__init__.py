from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeComponent, resolve_frontend_dir


class AntdProgress(ModelScopeComponent):
    """
    Ant Design: https://ant.design/components/progress
    """

    EVENTS = []

    def __init__(
            self,
            percent: int = 0,
            props: dict | None = None,
            *,
            format: str | None = None,
            show_info: bool | None = None,
            status: Literal['success', 'exception', 'normal', 'active']
        | None = None,
            stroke_color: str | None = None,
            stroke_linecap: Literal['round', 'butt', 'square']
        | None = None,
            success: dict | None = None,
            trail_color: str | None = None,
            type: Literal['line', 'circle', 'dashboard'] | None = None,
            size: int | float | list[int | float | str] | dict
        | Literal['small', 'default']
        | None = None,
            steps: int | dict | None = None,
            percent_position: dict | None = None,
            stroke_width: int | float | None = None,
            gap_degree: int | float | None = None,
            gap_position: Literal['top', 'bottom', 'left', 'right']
        | None = None,
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
        self.percent = percent
        self.format = format
        self.show_info = show_info
        self.status = status
        self.stroke_color = stroke_color
        self.stroke_linecap = stroke_linecap
        self.success = success
        self.trail_color = trail_color
        self.type = type
        self.size = size
        self.steps = steps
        self.percent_position = percent_position
        self.stroke_width = stroke_width
        self.gap_degree = gap_degree
        self.gap_position = gap_position
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("progress")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:
        return value

    def example_payload(self) -> Any:
        return 0

    def example_value(self) -> Any:
        return 0
