from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTypographyLink(ModelScopeLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("copyable_copy",
                      callback=lambda block: block._internal.update(
                          bind_copyable_copy_event=True)),
        EventListener("editable_change",
                      callback=lambda block: block._internal.update(
                          bind_editable_change_event=True)),
        EventListener("editable_cancel",
                      callback=lambda block: block._internal.update(
                          bind_editable_cancel_event=True)),
        EventListener("editable_start",
                      callback=lambda block: block._internal.update(
                          bind_editable_start_event=True)),
        EventListener("editable_end",
                      callback=lambda block: block._internal.update(
                          bind_editable_end_event=True)),
    ]

    # supported slots
    SLOTS = [
        'copyable.icon',
        'copyable.tooltips',
        'editable.icon',
        'editable.tooltip',
        'editable.enterIcon',
    ]

    def __init__(
            self,
            value: str | None = "",
            props: dict | None = None,
            *,
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
        self.value = value
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("typography", "link")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return "Hello"

    def example_value(self) -> Any:
        return "Hello"
