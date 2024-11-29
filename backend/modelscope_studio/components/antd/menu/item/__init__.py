from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdMenuItem(ModelScopeLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("title_click",
                      callback=lambda block: block._internal.update(
                          bind_titleClick_event=True)),
    ]

    # supported slots
    SLOTS = ["title", 'icon', "label", "extra"]

    def __init__(
            self,
            label: str | None = None,
            props: dict | None = None,
            *,
            title: str | None = None,
            danger: bool | None = None,
            disabled: bool | None = None,
            extra: str | None = None,
            icon: str | None = None,
            key: str | None = None,
            theme: Literal['dark', 'light'] = None,
            type: Literal['group'] | None = None,
            popup_class_name: str | None = None,
            popup_offset: tuple[int | float, int | float] | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.label = label
        self.props = props
        self.title = title
        self.danger = danger
        self.disabled = disabled
        self.extra = extra
        self.icon = icon
        self.key = key
        self.theme = theme
        self.type = type
        self.popup_class_name = popup_class_name
        self.popup_offset = popup_offset

    FRONTEND_DIR = resolve_frontend_dir("menu", "item")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
