from __future__ import annotations

from typing import Any

from gradio.events import EventListener
from typing_extensions import Literal

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .otp import AntdInputOTP
from .password import AntdInputPassword
from .search import AntdInputSearch
from .textarea import AntdInputTextarea


# as inputs, outputs
class AntdInput(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/input
    """
    Textarea = AntdInputTextarea
    Password = AntdInputPassword
    OTP = AntdInputOTP
    Search = AntdInputSearch

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("press_enter",
                      callback=lambda block: block._internal.update(
                          bind_pressEnter_event=True)),
        EventListener("clear",
                      callback=lambda block: block._internal.update(
                          bind_clear_event=True)),
    ]

    # supported slots
    SLOTS = [
        'addonAfter', 'addonBefore', 'allowClear.clearIcon', 'prefix',
        'suffix', 'showCount.formatter'
    ]

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            addon_after: str | None = None,
            addon_before: str | None = None,
            allow_clear: bool | dict | None = None,
            class_names: dict | None = None,
            count: dict | None = None,
            default_value: str | None = None,
            disabled: bool | None = None,
            max_length: int | None = None,
            prefix: str | None = None,
            show_count: bool | dict = None,
            size: Literal['large', 'middle', 'small'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            styles: dict | None = None,
            suffix: str | None = None,
            type: str | None = None,
            placeholder: str | None = None,
            variant: Literal['outlined', 'borderless', 'filled', 'underlined']
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
        self.allow_clear = allow_clear
        self.class_names = class_names
        self.count = count
        self.default_value = default_value
        self.disabled = disabled
        self.max_length = max_length
        self.prefix = prefix
        self.show_count = show_count
        self.size = size
        self.status = status
        self.styles = styles
        self.suffix = suffix
        self.type = type
        self.placeholder = placeholder
        self.variant = variant
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("input")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "string"}

    def preprocess(self, payload: None | str) -> None | str:
        return payload

    def postprocess(self, value: None | str) -> None | str:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
