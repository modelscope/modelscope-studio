from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdRate(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/rate
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("blur",
                      callback=lambda block: block._internal.update(
                          bind_blur_event=True)),
        EventListener("focus",
                      callback=lambda block: block._internal.update(
                          bind_focus_event=True)),
        EventListener("hover_change",
                      callback=lambda block: block._internal.update(
                          bind_hoverChange_event=True)),
        EventListener("key_down",
                      callback=lambda block: block._internal.update(
                          bind_keyDown_event=True)),
    ]

    # supported slots
    SLOTS = ["character"]

    def __init__(
            self,
            value: int | float | None = None,
            props: dict | None = None,
            *,
            allow_clear: bool | None = None,
            allow_half: bool | None = None,
            auto_focus: bool | None = None,
            character: str | None = None,
            count: int | float | None = 5,
            default_value: int | float | None = None,
            disabled: bool | None = None,
            keyboard: bool | None = None,
            tooltips: list[str] | None = None,
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
        self.allow_clear = allow_clear
        self.allow_half = allow_half
        self.auto_focus = auto_focus
        self.character = character
        self.count = count
        self.default_value = default_value
        self.disabled = disabled
        self.keyboard = keyboard
        self.tooltips = tooltips
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("rate")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "number"}

    def preprocess(self, payload: None | int | float) -> None | int | float:
        return payload

    def postprocess(self, value: None | int | float) -> None | int | float:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
