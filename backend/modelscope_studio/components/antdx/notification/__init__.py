from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXNotification(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/notification
    """
    EVENTS = [
        EventListener("permission",
                      callback=lambda block: block._internal.update(
                          bind_permission_event=True)),
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True)),
        EventListener("error",
                      callback=lambda block: block._internal.update(
                          bind_error_event=True)),
        EventListener("show",
                      callback=lambda block: block._internal.update(
                          bind_show_event=True))
    ]

    # supported slots
    SLOTS = []

    def __init__(
            self,
            *,
            title: str | None = None,
            duration: int | float | None = None,
            badge: str | None = None,
            body: str | None = None,
            data: Any | None = None,
            dir: Literal['auto', 'ltr', 'rtl'] | None = None,
            icon: str | None = None,
            lang: str | None = None,
            require_interaction: bool | None = None,
            silent: bool | None = None,
            tag: str | None = None,
            additional_props: dict | None = None,
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
        self.additional_props = additional_props
        self.title = title
        self.duration = duration
        self.badge = badge
        self.body = body
        self.data = data
        self.dir = dir
        self.icon = icon
        self.lang = lang
        self.require_interaction = require_interaction
        self.silent = silent
        self.tag = tag

    FRONTEND_DIR = resolve_frontend_dir("notification", type="antdx")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
