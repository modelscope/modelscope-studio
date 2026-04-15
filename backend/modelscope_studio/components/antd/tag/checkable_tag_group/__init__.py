from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdTagCheckableTagGroupOption


# as inputs, outputs
class AntdTagCheckableTagGroup(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/tag
    """
    Option = AntdTagCheckableTagGroupOption

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    # supported slots
    SLOTS = ["options"]

    def __init__(
            self,
            value: int | float | str | list[str | int | float] | None = None,
            additional_props: dict | None = None,
            *,
            options: list[dict | int | float | str] | None = None,
            disabled: bool | None = None,
            multiple: bool | None = None,
            default_value: int | float | str | list[str | int | float]
        | None = None,
            root_class_name: str | None = None,
            class_names: dict | str | None = None,
            styles: dict | str | None = None,
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
        self.class_names = class_names
        self.styles = styles
        self.additional_props = additional_props
        self.root_class_name = root_class_name
        self.options = options
        self.disabled = disabled
        self.multiple = multiple
        self.default_value = default_value

    FRONTEND_DIR = resolve_frontend_dir("tag", 'checkable-tag-group')

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [{
                "type": "string"
            }, {
                "type": "number"
            }, {
                "type": "array",
                "items": {
                    "anyOf": [{
                        "type": "number"
                    }, {
                        "type": "string"
                    }]
                }
            }]
        }

    def preprocess(self, payload: bool | None) -> bool | None:
        return payload

    def postprocess(self, value: bool | None) -> bool | None:

        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
