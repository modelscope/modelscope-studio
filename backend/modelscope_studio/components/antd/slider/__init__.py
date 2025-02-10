from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .mark import AntdSliderMark


# as inputs, outputs
class AntdSlider(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/slider
    """
    Mark = AntdSliderMark

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("change_complete",
                      callback=lambda block: block._internal.update(
                          bind_changeComplete_event=True)),
    ]

    # supported slots
    SLOTS = ['marks', 'tooltip.formatter']

    def __init__(
            self,
            value: int | float | tuple[int | float, int | float]
        | list[int | float] | None = None,
            props: dict | None = None,
            *,
            auto_focus: bool | None = None,
            class_names: dict | None = None,
            default_value: int | float | tuple[int | float, int | float]
        | list[int | float] | None = None,
            disabled: bool | None = None,
            dots: bool | None = None,
            included: bool | None = True,
            keyboard: bool | None = True,
            marks: dict | None = None,
            max: int | float | None = 100,
            min: int | float | None = 0,
            range: bool | dict | None = False,
            reverse: bool | None = None,
            step: int | float | None = 1,
            styles: dict | None = None,
            tooltip: dict | None = None,
            vertical: bool | None = None,
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
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.auto_focus = auto_focus
        self.class_names = class_names
        self.default_value = default_value
        self.disabled = disabled
        self.dots = dots
        self.included = included
        self.keyboard = keyboard
        self.marks = marks
        self.max = max
        self.min = min
        self.range = range
        self.reverse = reverse
        self.step = step
        self.styles = styles
        self.tooltip = tooltip
        self.vertical = vertical
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("slider")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [
                {
                    "type": "number",
                },
                {
                    "type": "array",
                    "items": {
                        "type": "number",
                    },
                },
            ]
        }

    def preprocess(
        self, payload: int | float | tuple[int | float, int | float] | None
    ) -> int | float | tuple[int | float, int | float] | None:
        return payload

    def postprocess(
        self, value: int | float | tuple[int | float, int | float] | None
    ) -> int | float | tuple[int | float, int | float] | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
