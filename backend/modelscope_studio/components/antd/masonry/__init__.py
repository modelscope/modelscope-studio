from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdMasonryItem


class AntdMasonry(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/masonry

    A masonry layout component for displaying content with different heights.

    When to use:
    - When displaying images or cards with irregular heights
    - When content needs to be evenly distributed in columns
    - When column count needs to be responsive
    """
    Item = AntdMasonryItem

    EVENTS = [
        EventListener("layout_change",
                      callback=lambda block: block._internal.update(
                          bind_layoutChange_event=True)),
    ]
    SLOTS = ['items', 'itemRender']

    def __init__(
            self,
            additional_props: dict | None = None,
            *,
            columns: int | dict | None = None,
            gutter: int | tuple[int | dict, int | dict] | dict | None = None,
            fresh: bool | None = None,
            items: list[dict] | None = None,
            item_render: str | None = None,
            class_names: dict | None = None,
            styles: dict | None = None,
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
        self.additional_props = additional_props
        self.columns = columns
        self.gutter = gutter
        self.fresh = fresh
        self.items = items
        self.item_render = item_render
        self.class_names = class_names
        self.styles = styles

    FRONTEND_DIR = resolve_frontend_dir("masonry")

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
