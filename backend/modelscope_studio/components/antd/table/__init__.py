from __future__ import annotations

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
            props: dict | None = None,
            *,
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
