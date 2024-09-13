from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeComponent, resolve_frontend_dir


# as inputs, outputs
class AntdCalendar(ModelScopeComponent):
    """
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("panel_change",
                      callback=lambda block: block._internal.update(
                          bind_panelChange_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True))
    ]

    def __init__(
            self,
            value: int | str | float | None = None,
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
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("calendar")

    def api_info(self) -> dict[str, Any]:
        return {"anyOf": [{"type": "number"}, {"type": "string"}]}

    @property
    def skip_api(self):
        return False

    def preprocess(self, payload: int | float) -> int | float:
        return payload

    def postprocess(self, value: int | float) -> int | str:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
