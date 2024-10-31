from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdDescriptionsItem


class AntdDescriptions(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/descriptions
    """
    Item = AntdDescriptionsItem

    EVENTS = []

    # supported slots
    SLOTS = ['extra', 'title', "items"]

    def __init__(
            self,
            props: dict | None = None,
            *,
            bordered: bool = False,
            colon: bool = True,
            column: int | dict | None = 3,
            content_style: dict | None = None,
            extra: str | None = None,
            layout: Literal['horizontal', 'vertical'] = 'horizontal',
            size: Literal['default', 'middle', 'small'] | None = None,
            title: str | None = None,
            items: list[dict] | None = None,
            label_style: dict | None = None,
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
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.title = title
        self.items = items
        self.bordered = bordered
        self.colon = colon
        self.column = column
        self.content_style = content_style
        self.extra = extra
        self.layout = layout
        self.size = size
        self.root_class_name = root_class_name
        self.label_style = label_style

    FRONTEND_DIR = resolve_frontend_dir("descriptions")

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
