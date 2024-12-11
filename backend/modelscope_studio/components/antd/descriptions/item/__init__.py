from __future__ import annotations

from typing import Any, Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdDescriptionsItem(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/descriptions
    """

    EVENTS = []

    # supported slots
    SLOTS = ['label', 'children']

    def __init__(
            self,
            label: str | None = None,
            props: dict | None = None,
            *,
            content_style: dict | None = None,
            label_style: dict | None = None,
            span: int | dict | Literal['filled'] | None = None,
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
        self.props = props
        self.label = label
        self.span = span
        self.content_style = content_style
        self.label_style = label_style

    FRONTEND_DIR = resolve_frontend_dir("descriptions", "item")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
