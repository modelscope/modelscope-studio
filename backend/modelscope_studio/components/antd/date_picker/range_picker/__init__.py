from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdDatePickerRangePicker(ModelScopeDataLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener(
            "calendar_change",
            callback=lambda block: block._internal.update(bind_ok_event=True)),
        EventListener("focus",
                      callback=lambda block: block._internal.update(
                          bind_calendarChange_event=True)),
        EventListener("blur",
                      callback=lambda block: block._internal.update(
                          bind_blur_event=True)),
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
        'separator',
        'cellRender',
        'panelRender',
    ]

    def __init__(
            self,
            value: tuple[str | int | float, str | int | float] | None = None,
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

    FRONTEND_DIR = resolve_frontend_dir("date-picker", 'range-picker')

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "type": "array",
            "items": {
                "anyOf": [{
                    "type": "number"
                }, {
                    "type": "string"
                }]
            }
        }

    def preprocess(
        self, payload: tuple[str | int | float, str | int | float]
    ) -> tuple[str | int | float, str | int | float]:
        return payload

    def postprocess(
        self, value: tuple[str | int | float, str | int | float]
    ) -> tuple[str | int | float, str | int | float]:
        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
