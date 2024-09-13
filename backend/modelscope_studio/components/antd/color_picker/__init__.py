from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .preset import AntdColorPickerPreset


# as inputs, outputs
class AntdColorPicker(ModelScopeDataLayoutComponent):
    """
    """
    Preset = AntdColorPickerPreset

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("change_complete",
                      callback=lambda block: block._internal.update(
                          bind_changeComplete_event=True)),
        EventListener("clear",
                      callback=lambda block: block._internal.update(
                          bind_clear_event=True)),
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
        EventListener("format_change",
                      callback=lambda block: block._internal.update(
                          bind_formatChange_event=True)),
    ]

    # supported slots
    SLOTS = ["presets"]

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            value_format: Literal['hex', 'rgb', 'hsb'] = 'hex',
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
        self.value_format = value_format

    FRONTEND_DIR = resolve_frontend_dir("color-picker")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "string"}

    def preprocess(self, payload: str) -> str:

        return payload

    def postprocess(self, value: str) -> str:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
