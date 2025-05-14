from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .selection import AntdTableRowSelectionSelection


class AntdTableRowSelection(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/table
    """
    Selection = AntdTableRowSelectionSelection

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
        EventListener("select_all",
                      callback=lambda block: block._internal.update(
                          bind_selectAll_event=True)),
        EventListener("select_invert",
                      callback=lambda block: block._internal.update(
                          bind_selectInvert_event=True)),
        EventListener("select_none",
                      callback=lambda block: block._internal.update(
                          bind_selectNone_event=True)),
        EventListener("select_multiple",
                      callback=lambda block: block._internal.update(
                          bind_selectMultiple_event=True)),
    ]

    # supported slots
    SLOTS = [
        'columnTitle',
        'renderCell',
        'selections',
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            align: Literal['left', 'right', 'center'] | None = None,
            check_strictly: bool | None = None,
            column_title: str | None = None,
            column_width: int | float | str | None = None,
            fixed: bool | None = None,
            get_checkbox_props: str | None = None,
            hide_select_all: bool | None = None,
            preserve_selected_rows_keys: bool | None = None,
            render_cell: str | None = None,
            selected_row_keys: list[str] | list[int | float] | None = None,
            default_selected_row_keys: list[str] | list[int | float]
        | None = None,
            selections: list[dict] | bool | None = None,
            type: Literal["checkbox", "radio"] | None = None,
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
        self.align = align
        self.check_strictly = check_strictly
        self.column_title = column_title
        self.column_width = column_width
        self.fixed = fixed
        self.get_checkbox_props = get_checkbox_props
        self.hide_select_all = hide_select_all
        self.preserve_selected_rows_keys = preserve_selected_rows_keys
        self.render_cell = render_cell
        self.selected_row_keys = selected_row_keys
        self.default_selected_row_keys = default_selected_row_keys
        self.selections = selections
        self.type = type

    FRONTEND_DIR = resolve_frontend_dir("table", "row-selection")

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
