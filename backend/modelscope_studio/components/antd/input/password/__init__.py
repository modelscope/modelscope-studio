from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdInputPassword(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/input
    """
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
        EventListener("visibility_toggle_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_visibilityToggle_visibleChange__event=True)),
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
            icon_render: str | None = None,
            visiable_toggle: bool | dict | None = True,
            addon_after: str | None = None,
            addon_before: str | None = None,
            allow_clear: bool | dict | None = None,
            class_names: dict | None = None,
            count: dict | None = None,
            default_value: str | None = None,
            disabled: bool = False,
            max_length: int | None = None,
            prefix: str | None = None,
            show_count: bool | dict = False,
            size: Literal['large', 'middle', 'small'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            styles: dict | None = None,
            suffix: str | None = None,
            type: str | None = 'text',
            placeholder: str | None = None,
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
        self.icon_render = icon_render
        self.visiable_toggle = visiable_toggle
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

    FRONTEND_DIR = resolve_frontend_dir("input", "password")

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
