from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class ModelScopeDiv(ModelScopeLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("dblclick",
                      callback=lambda block: block._internal.update(
                          bind_dblclick_event=True)),
        EventListener("mousedown",
                      callback=lambda block: block._internal.update(
                          bind_mousedown_event=True)),
        EventListener("mouseup",
                      callback=lambda block: block._internal.update(
                          bind_mouseup_event=True)),
        EventListener("mouseover",
                      callback=lambda block: block._internal.update(
                          bind_mouseover_event=True)),
        EventListener("mouseout",
                      callback=lambda block: block._internal.update(
                          bind_mouseout_event=True)),
        EventListener("mousemove",
                      callback=lambda block: block._internal.update(
                          bind_mousemove_event=True)),
        EventListener("scroll",
                      callback=lambda block: block._internal.update(
                          bind_scroll_event=True)),
    ]

    # supported slots
    SLOTS = []

    def __init__(
            self,
            value: str | None = None,
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

    FRONTEND_DIR = resolve_frontend_dir("div", type="base")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
