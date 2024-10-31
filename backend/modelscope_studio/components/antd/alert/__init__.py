from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .error_boundary import AntdAlertErrorBoundary


class AntdAlert(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/alert
    """
    ErrorBoundary = AntdAlertErrorBoundary
    EVENTS = [
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True))
    ]

    # supported slots
    SLOTS = ['action', 'closable.closeIcon', 'description', 'icon', 'message']

    def __init__(
            self,
            props: dict | None = None,
            *,
            action: str | None = None,
            after_close: str | None = None,
            banner: bool | None = None,
            closable: bool | dict | None = None,
            description: str | None = None,
            icon: str | None = None,
            message: str | None = None,
            show_icon: bool | None = None,
            type: Literal['success', 'info', 'warning', 'error'] | None = None,
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
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.action = action
        self.after_close = after_close
        self.banner = banner
        self.closable = closable
        self.description = description
        self.icon = icon
        self.message = message
        self.show_icon = show_icon
        self.type = type
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("alert")

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
