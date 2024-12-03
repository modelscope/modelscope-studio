from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTableColumn(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/table
    """
    EVENTS = [
        EventListener("filter_dropdown_open_change",
                      callback=lambda block: block._internal.update(
                          bind_filterDropdownOpenChange_event=True)),
    ]

    # supported slots
    SLOTS = [
        'filterDropdown', "filterDropdownProps.dropdownRender",
        "filterDropdownProps.menu.expandIcon",
        'filterDropdownProps.menu.overflowedIndicator',
        "filterDropdownProps.menu.items", 'filterIcon', 'render', 'title',
        'sortIcon', 'showSorterTooltip.title'
    ]

    def __init__(
            self,
            props: dict | None = None,
            built_in_column: Literal['SELECTION_COLUMN', 'EXPAND_COLUMN']
        | None = None,
            *,
            align: str | None = None,
            col_span: int | None = None,
            data_index: str | list[str] | None = None,
            default_filtered_value: list[str] | None = None,
            filter_reset_to_default_filtered_value: bool | None = None,
            default_sort_order: Literal['ascend', 'descend'] | None = None,
            ellipsis: bool | dict | None = None,
            filter_dropdown: str | None = None,
            filter_dropdown_open: bool | None = None,
            filtered: bool | None = None,
            filtered_value: list[str] | None = None,
            filter_icon: str | None = None,
            filter_on_close: bool | None = None,
            filter_multiple: bool | None = None,
            filter_mode: Literal['menu', 'tree'] | None = None,
            filter_search: bool | str | None = None,
            filters: list[dict] | None = None,
            filter_dropdown_props: dict | None = None,
            fixed: str | bool | None = None,
            key: str | None = None,
            column_render: str | None = None,
            responsive: list[str] | None = None,
            row_scope: Literal['row', 'rowgroup'] | None = None,
            should_cell_update: str | None = None,
            show_sorter_tooltip: bool | dict | None = None,
            sort_directions: list[Literal['ascend', 'descend']] | None = None,
            sorter: bool | dict | str | None = None,
            sort_order: Literal['ascend', 'descend'] | None = None,
            sort_icon: str | None = None,
            title: str | None = None,
            width: int | float | str | None = None,
            min_width: int | float | str | None = None,
            hidden: bool | None = None,
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
        self.built_in_column = built_in_column
        self.align = align
        self.col_span = col_span
        self.data_index = data_index
        self.default_filtered_value = default_filtered_value
        self.filter_reset_to_default_filtered_value = filter_reset_to_default_filtered_value
        self.default_sort_order = default_sort_order
        self.ellipsis = ellipsis
        self.filter_dropdown = filter_dropdown
        self.filter_dropdown_open = filter_dropdown_open
        self.filtered = filtered
        self.filtered_value = filtered_value
        self.filter_icon = filter_icon
        self.filter_on_close = filter_on_close
        self.filter_multiple = filter_multiple
        self.filter_mode = filter_mode
        self.filter_search = filter_search
        self.filters = filters
        self.filter_dropdown_props = filter_dropdown_props
        self.fixed = fixed
        self.key = key
        self.column_render = column_render
        self.responsive = responsive
        self.row_scope = row_scope
        self.should_cell_update = should_cell_update
        self.show_sorter_tooltip = show_sorter_tooltip
        self.sorter = sorter
        self.sort_directions = sort_directions
        self.sort_order = sort_order
        self.sort_icon = sort_icon
        self.title = title
        self.width = width
        self.min_width = min_width
        self.hidden = hidden

    FRONTEND_DIR = resolve_frontend_dir("table", "column")

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
