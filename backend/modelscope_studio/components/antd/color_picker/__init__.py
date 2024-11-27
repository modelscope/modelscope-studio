from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .preset import AntdColorPickerPreset


# as inputs, outputs
class AntdColorPicker(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/color-picker
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
    SLOTS = ["presets", 'panelRender', 'showText']

    def __init__(
            self,
            value: str | list[dict] | None = None,
            props: dict | None = None,
            *,
            value_format: Literal['hex', 'rgb', 'hsb'] = 'hex',
            allow_clear: bool = False,
            arrow: bool | dict = True,
            presets: list[dict] | None = None,
            disabled: bool | None = None,
            disabled_alpha: bool | None = None,
            destroy_tooltip_on_hide: bool | None = None,
            format: Literal['hex', 'rgb', 'hsb'] | None = 'hex',
            mode: Literal['single', 'gradient']
        | list[Literal['single', 'gradient']] | None = 'single',
            open: bool | None = None,
            default_value: str | list[dict] | None = None,
            default_format: Literal['hex', 'rgb', 'hsb'] | None = None,
            show_text: bool | str | None = None,
            placement: Literal['bottomLeft', 'bottomRight', 'topLeft',
                               'topRight'] | None = 'bottomLeft',
            trigger: Literal['hover', 'click'] = 'click',
            panel_render: str | None = None,
            size: Literal['small', 'middle', 'large'] | None = None,
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
        self.value_format = value_format
        self.allow_clear = allow_clear
        self.arrow = arrow
        self.presets = presets
        self.disabled = disabled
        self.disabled_alpha = disabled_alpha
        self.destroy_tooltip_on_hide = destroy_tooltip_on_hide
        self.format = format
        self.mode = mode
        self.open = open
        self.default_value = default_value
        self.default_format = default_format
        self.show_text = show_text
        self.placement = placement
        self.trigger = trigger
        self.panel_render = panel_render
        self.size = size
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("color-picker")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [{
                "type": "string"
            }, {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "color": {
                            "type": "string"
                        },
                        "percent": {
                            "type": "number"
                        }
                    },
                }
            }]
        }

    def preprocess(self, payload: str | list[dict]) -> str | list[dict]:

        return payload

    def postprocess(self, value: str | list[dict]) -> str | list[dict]:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
