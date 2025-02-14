from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdNotification(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/notification
    """
    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True))
    ]

    # supported slots
    SLOTS = ['actions', 'closeIcon', "description", "icon", "message"]

    def __init__(
            self,
            message: str | None = "",
            description: str | None = "",
            props: dict | None = None,
            *,
            type: Literal['success', 'info', 'warning', 'error'] | None = None,
            btn: str | None = None,
            close_icon: str | bool | None = None,
            duration: int | float | None = 4.5,
            show_progress: bool | None = None,
            pause_on_hover: bool | None = None,
            icon: str | None = None,
            key: str | None = None,
            placement: Literal["top", "topLeft", "topRight", "bottom",
                               "bottomLeft", "bottomRight"] | None = None,
            role: Literal["alert", "status"] | None = None,
            bottom: int | float | None = 24,
            rtl: bool | None = None,
            get_container: str | None = None,
            stack: bool | dict | None = None,
            top: int | float | None = 24,
            root_class_name: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool | None = None,
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
        self.props = props
        self.message = message
        self.type = type
        self.description = description
        self.btn = btn
        self.close_icon = close_icon
        self.duration = duration
        self.show_progress = show_progress
        self.pause_on_hover = pause_on_hover
        self.icon = icon
        self.key = key
        self.placement = placement
        self.role = role
        self.bottom = bottom
        self.rtl = rtl
        self.get_container = get_container
        self.stack = stack
        self.top = top
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("notification")

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
