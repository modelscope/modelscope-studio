from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdListItem


class AntdList(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/list
    """
    Item = AntdListItem
    EVENTS = [
        EventListener("pagination_change",
                      callback=lambda block: block._internal.update(
                          bind_pagination_change_event=True)),
        EventListener("pagination_show_size_change",
                      callback=lambda block: block._internal.update(
                          bind_pagination_showSizeChange_event=True)),
    ]

    # supported slots
    SLOTS = ['footer', 'header', 'loadMore', 'renderItem']

    def __init__(
            self,
            props: dict | None = None,
            *,
            bordered: bool = False,
            data_source: list[Any] | None = None,
            footer: str | None = None,
            grid: dict | None = None,
            header: str | None = None,
            item_layout: str | None = None,
            loading: bool | dict | None = False,
            load_more: str | None = None,
            locale: dict | None = None,
            pagination: bool | dict | None = False,
            render_item: str | None = None,
            row_key: str | None = None,
            size: Literal['small', 'default', 'large'] | None = None,
            split: bool = True,
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
        self.bordered = bordered
        self.data_source = data_source
        self.footer = footer
        self.grid = grid
        self.header = header
        self.item_layout = item_layout
        self.loading = loading
        self.load_more = load_more
        self.pagination = pagination
        self.render_item = render_item
        self.locale = locale
        self.row_key = row_key
        self.size = size
        self.split = split
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("list")

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
