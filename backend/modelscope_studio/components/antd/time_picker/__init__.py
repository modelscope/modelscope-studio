from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .range_picker import AntdTimePickerRangePicker


# as inputs, outputs
class AntdTimePicker(ModelScopeDataLayoutComponent):
    """
    """
    RangePicker = AntdTimePickerRangePicker

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
        EventListener("calendar_change",
                      callback=lambda block: block._internal.update(
                          bind_calendarChange_event=True)),
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
            value: str | int | float | None = None,
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

    FRONTEND_DIR = resolve_frontend_dir("time-picker")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"anyOf": [{"type": "number"}, {"type": "string"}]}

    def preprocess(self, payload: int | float) -> int | float:
        return payload

    def postprocess(self, value: int | float | str) -> int | str:
        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
