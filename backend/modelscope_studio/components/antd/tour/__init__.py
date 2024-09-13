from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .step import AntdTourStep


# as inputs, outputs
class AntdTour(ModelScopeDataLayoutComponent):
    """
    """
    Step = AntdTourStep
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True)),
        EventListener("finish",
                      callback=lambda block: block._internal.update(
                          bind_finish_event=True)),
    ]

    # supported slots
    SLOTS = ['closeIcon']

    def __init__(
            self,
            value: int | None = None,
            props: dict | None = None,
            *,
            open: bool | None = None,
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
        self.open = open

    FRONTEND_DIR = resolve_frontend_dir("tour")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "number"}

    def preprocess(self, payload: None | int) -> None | int:
        return payload

    def postprocess(self, value: None | int) -> None | int:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
