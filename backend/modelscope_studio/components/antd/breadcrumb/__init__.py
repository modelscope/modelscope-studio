from __future__ import annotations

from typing import Any

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdBreadcrumbItem


class AntdBreadcrumb(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/breadcrumb
    """
    Item = AntdBreadcrumbItem

    EVENTS = []

    # supported slots
    SLOTS = ['separator', 'itemRender', 'items']

    def __init__(
            self,
            props: dict | None = None,
            *,
            item_render: str | None = None,
            params: dict | None = None,
            items: list[dict] | None = None,
            separator: str | None = None,
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
        self.item_render = item_render
        self.params = params
        self.items = items
        self.separator = separator

    FRONTEND_DIR = resolve_frontend_dir("breadcrumb")

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
