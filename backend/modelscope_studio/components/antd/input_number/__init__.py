from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdInputNumber(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/input-number
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("press_enter",
                      callback=lambda block: block._internal.update(
                          bind_pressEnter_event=True)),
        EventListener("step",
                      callback=lambda block: block._internal.update(
                          bind_step_event=True)),
    ]

    # supported slots
    SLOTS = [
        'addonAfter',
        'addonBefore',
        'controls.upIcon',
        'controls.downIcon',
        'prefix',
        'suffix',
    ]

    def __init__(
            self,
            value: int | float | None = None,
            props: dict | None = None,
            *,
            addon_after: str | None = None,
            addon_before: str | None = None,
            auto_focus: bool = False,
            change_on_blur: bool | None = None,
            change_on_wheel: bool | None = True,
            controls: bool | dict | None = None,
            decimal_separator: str | None = None,
            placeholder: str | None = None,
            default_value: int | None = None,
            disabled: bool = False,
            formatter: str | None = None,
            keyboard: bool = True,
            max: int | float | None = None,
            min: int | float | None = None,
            parser: str | None = None,
            precision: int | float | None = None,
            prefix: str | None = None,
            read_only: bool = False,
            size: Literal['large', 'middle', 'small'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            step: int | float | None = 1,
            string_mode: bool = False,
            suffix: str | None = None,
            variant: Literal['outlined', 'borderless', 'filled'] = 'outlined',
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
        self.addon_after = addon_after
        self.addon_before = addon_before
        self.auto_focus = auto_focus
        self.change_on_blur = change_on_blur
        self.change_on_wheel = change_on_wheel
        self.controls = controls
        self.decimal_separator = decimal_separator
        self.placeholder = placeholder
        self.default_value = default_value
        self.disabled = disabled
        self.formatter = formatter
        self.keyboard = keyboard
        self.max = max
        self.min = min
        self.parser = parser
        self.precision = precision
        self.prefix = prefix
        self.read_only = read_only
        self.size = size
        self.status = status
        self.step = step
        self.string_mode = string_mode
        self.suffix = suffix
        self.variant = variant
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("input-number")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "number"}

    def preprocess(self, payload: None | int | float) -> None | int | float:
        if isinstance(payload, str):
            if '.' in payload:
                return float(payload)
            return int(payload)
        return payload

    def postprocess(self, value: None | int | float) -> None | int | float:
        if isinstance(value, str):
            if '.' in value:
                return float(value)
            return int(value)
        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
