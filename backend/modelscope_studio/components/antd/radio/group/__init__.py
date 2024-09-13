from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdRadioGroupOption


# as inputs, outputs
class AntdRadioGroup(ModelScopeDataLayoutComponent):
    """
    """
    Option = AntdRadioGroupOption

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]
    # supported slots
    SLOTS = ['options']

    def __init__(
            self,
            value: Any | None = None,
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

    FRONTEND_DIR = resolve_frontend_dir("radio", "group")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [
                {
                    "type": "string"
                },
                {
                    "type": "number"
                },
                {
                    "type": "boolean"
                },
            ],
        }

    def preprocess(self, payload: Any | None) -> Any | None:
        return payload

    def postprocess(self, value: Any | None) -> Any | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
