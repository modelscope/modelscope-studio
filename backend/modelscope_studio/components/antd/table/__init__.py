from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .column import AntdTableColumn
from .column_group import AntdTableColumnGroup
from .constants import (EXPAND_COLUMN, SELECTION_ALL, SELECTION_COLUMN,
                        SELECTION_INVERT, SELECTION_NONE)
from .expandable import AntdTableExpandable
from .row_selection import AntdTableRowSelection


class AntdTable(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/table
    """
    Column = AntdTableColumn
    ColumnGroup = AntdTableColumnGroup
    Expandable = AntdTableExpandable
    RowSelection = AntdTableRowSelection

    # constants
    EXPAND_COLUMN = EXPAND_COLUMN
    SELECTION_ALL = SELECTION_ALL
    SELECTION_COLUMN = SELECTION_COLUMN
    SELECTION_INVERT = SELECTION_INVERT
    SELECTION_NONE = SELECTION_NONE

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("scroll",
                      callback=lambda block: block._internal.update(
                          bind_scroll_event=True)),
    ]

    # supported slots
    SLOTS = [
        'footer',
        'title',
        'summary',
        "expandable",
        "rowSelection"
        'loading.tip',
        'loading.indicator',
        'pagination.showQuickJumper.goButton',
        'pagination.itemRender',
        'showSorterTooltip.title',
    ]

    def __init__(
            self,
            data_source: list[dict] | None = None,
            columns: list[dict] | None = None,
            props: dict | None = None,
            *,
            bordered: bool | None = None,
            components: dict | None = None,
            expandable: dict | None = None,
            footer: str | None = None,
            get_popup_container: str | None = None,
            loading: bool | dict = False,
            locale: dict | None = None,
            pagination: bool | dict | None = None,
            row_class_name: str | None = None,
            row_key: str | None = None,
            row_selection: dict | None = None,
            row_hoverable: bool | None = None,
            scroll: dict | None = None,
            show_header: bool = True,
            show_sorter_tooltip: bool | dict | None = None,
            size: Literal['large', 'middle', 'small'] | None = None,
            sort_directions: list[Literal['ascend', 'descend']] | None = None,
            sticky: bool | dict | None = None,
            summary: str | None = None,
            table_layout: Literal['auto', 'fixed'] | None = None,
            title: str | None = None,
            virtual: bool | None = None,
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
        self.data_source = data_source
        self.columns = columns
        self.bordered = bordered
        self.components = components
        self.expandable = expandable
        self.footer = footer
        self.get_popup_container = get_popup_container
        self.loading = loading
        self.locale = locale
        self.pagination = pagination
        self.row_class_name = row_class_name
        self.row_key = row_key
        self.row_selection = row_selection
        self.row_hoverable = row_hoverable
        self.scroll = scroll
        self.show_header = show_header
        self.show_sorter_tooltip = show_sorter_tooltip
        self.size = size
        self.sort_directions = sort_directions
        self.sticky = sticky
        self.summary = summary
        self.table_layout = table_layout
        self.title = title
        self.virtual = virtual
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("table")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
