from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .preset import AntdDatePickerPreset
from .range_picker import AntdDatePickerRangePicker


# as inputs, outputs
class AntdDatePicker(ModelScopeDataLayoutComponent):
    """
    """
    Preset = AntdDatePickerPreset
    RangePicker = AntdDatePickerRangePicker

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener(
            "ok",
            callback=lambda block: block._internal.update(bind_ok_event=True)),
        EventListener("panel_change",
                      callback=lambda block: block._internal.update(
                          bind_panelChange_event=True)),
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon',
        'prevIcon',
        'nextIcon',
        'suffixIcon',
        'superNextIcon',
        'superPrevIcon',
        'renderExtraFooter',
        'cellRender',
        'panelRender',
    ]

    def __init__(
            self,
            value: str | int | float | list[str | int | float] | None = None,
            props: dict | None = None,
            *,
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

    FRONTEND_DIR = resolve_frontend_dir("date-picker")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [{
                "type": "number"
            }, {
                "type": "string"
            }, {
                "type": "array",
                "items": {
                    "anyOf": [{
                        "type": "number"
                    }, {
                        "type": "string"
                    }]
                }
            }]
        }

    def preprocess(
        self, payload: str | int | float | list[str | int | float]
    ) -> str | int | float | list[str | int | float]:
        return payload

    def postprocess(
        self, value: str | int | float | list[str | int | float]
    ) -> str | int | float | list[str | int | float]:
        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
