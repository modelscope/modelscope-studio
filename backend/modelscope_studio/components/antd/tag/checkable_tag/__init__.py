from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdTagCheckableTag(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/tag
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True))
    ]

    def __init__(
            self,
            label: str | None = None,
            value: bool | None = None,
            props: dict | None = None,
            *,
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
        self.label = label
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("tag", 'checkable-tag')

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "type": "boolean",
        }

    def preprocess(self, payload: bool | None) -> bool | None:
        return payload

    def postprocess(self, value: bool | None) -> bool | None:

        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
