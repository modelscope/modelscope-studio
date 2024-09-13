from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdCheckboxGroupOption


# as inputs, outputs
class AntdCheckboxGroup(ModelScopeDataLayoutComponent):
    """
    """
    Option = AntdCheckboxGroupOption

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    # supported slots
    SLOTS = [
        'options',
    ]

    def __init__(
            self,
            value: list[str | int | float | bool] | None = None,
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

    FRONTEND_DIR = resolve_frontend_dir("checkbox", "group")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "type": "array",
            "items": {
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
        }

    def preprocess(
        self, payload: None | list[str | int | float | bool] | None
    ) -> None | list[str | int | float | bool] | None:
        return payload

    def postprocess(
        self, value: None | list[str | int | float | bool] | None
    ) -> None | list[str | int | float | bool] | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
