from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdInputOTP(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/input
    """
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    # supported slots
    SLOTS = []

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            default_value: str | None = None,
            disabled: bool = False,
            formatter: str | None = None,
            mask: str | bool | None = None,
            length: int = 6,
            placeholder: str = '口',
            size: Literal['large', 'middle', 'small'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            variant: Literal['outline', 'borderless', 'filled'] | None = None,
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
        self.default_value = default_value
        self.disabled = disabled
        self.formatter = formatter
        self.mask = mask
        self.length = length
        self.placeholder = placeholder
        self.size = size
        self.status = status
        self.variant = variant
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("input", "otp")

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
