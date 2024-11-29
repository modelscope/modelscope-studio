from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .ribbon import AntdBadgeRibbon


class AntdBadge(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/badge
    """
    Ribbon = AntdBadgeRibbon

    EVENTS = []

    # supported slots
    SLOTS = ['count', 'text']

    def __init__(
            self,
            count: int | float | str | None = None,
            props: dict | None = None,
            *,
            color: str | None = None,
            class_names: dict | None = None,
            dot: bool | None = None,
            offset: tuple[int | float, int | float] | None = None,
            overflow_count: int = 99,
            show_zero: bool | None = None,
            size: Literal['small', 'default'] | None = None,
            status: Literal['success', 'processing', 'default', 'error',
                            'warning'] | None = None,
            text: str | None = None,
            title: str | None = None,
            styles: dict | None = None,
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
        self.count = count
        self.color = color
        self.class_names = class_names
        self.dot = dot
        self.offset = offset
        self.overflow_count = overflow_count
        self.show_zero = show_zero
        self.size = size
        self.status = status
        self.text = text
        self.title = title
        self.styles = styles
        self.root_class_name = root_class_name
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("badge")

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
