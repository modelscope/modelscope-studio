from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeComponent, resolve_frontend_dir


class AntdQRCode(ModelScopeComponent):
    """
    Ant Design: https://ant.design/components/qr-code
    """

    EVENTS = [
        EventListener("refresh",
                      callback=lambda block: block._internal.update(
                          bind_refresh_event=True)),
    ]

    # supported slots
    SLOTS = ["statusRender"]

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            type: Literal['canvas', 'svg'] | None = 'canvas',
            bordered: bool = True,
            color: str | None = "#000",
            bg_color: str | None = 'transparent',
            error_level: Literal['L', 'M', 'Q', 'H'] | None = 'M',
            icon: str | None = None,
            icon_size: int | dict | None = 40,
            size: int = 160,
            status: Literal['active', 'expired', 'loading', 'scanned']
        | None = 'active',
            status_render: str | None = None,
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
        self.type = type
        self.bordered = bordered
        self.color = color
        self.bg_color = bg_color
        self.error_level = error_level
        self.icon = icon
        self.icon_size = icon_size
        self.size = size
        self.status = status
        self.status_render = status_render
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("qr-code")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str) -> str:
        return payload

    def postprocess(self, value: str) -> str:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
