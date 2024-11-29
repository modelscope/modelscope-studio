from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdSegmentedOption


# as inputs, outputs
class AntdSegmented(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/segmented
    """
    Option = AntdSegmentedOption

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    def __init__(
            self,
            value: str | int | float | None = None,
            props: dict | None = None,
            *,
            block: bool | None = None,
            default_value: str | int | float | None = None,
            disabled: bool | None = None,
            options: list[str] | list[int | float] | list[dict] | None = None,
            size: Literal['large', 'middle', 'small'] | None = None,
            vertical: bool | None = None,
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
        self.block = block
        self.default_value = default_value
        self.disabled = disabled
        self.options = options
        self.size = size
        self.vertical = vertical
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("segmented")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, list[str]]:
        return {
            "anyOf": [
                {
                    "type": "string"
                },
                {
                    "type": "number"
                },
            ]
        }

    def preprocess(self, payload: str | int | float) -> str | int | float:
        return payload

    def postprocess(self, value: str | int | float) -> str | int | float:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
