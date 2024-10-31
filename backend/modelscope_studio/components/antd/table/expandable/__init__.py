from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTableExpandable(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/table
    """
    EVENTS = [
        EventListener("expand",
                      callback=lambda block: block._internal.update(
                          bind_expand_event=True)),
        EventListener("expanded_rows_change",
                      callback=lambda block: block._internal.update(
                          bind_expandedRowsChange_event=True)),
    ]

    # supported slots
    SLOTS = ['columnTitle', 'expandIcon', 'expandedRowRender']

    def __init__(
            self,
            props: dict | None = None,
            *,
            children_column_name: str | None = None,
            column_title: str | None = None,
            column_width: int | float | str | None = None,
            expanded_row_class_name: str | None = None,
            expanded_row_keys: list[str] | None = None,
            expanded_row_render: str | None = None,
            expand_icon: str | None = None,
            default_expand_all_rows: bool | None = None,
            default_expanded_row_keys: list[str] | None = None,
            expand_row_by_click: bool | None = None,
            fixed: bool | Literal['left', 'right'] | None = None,
            indent_size: int | float | None = 15,
            row_expandable: str | None = None,
            show_expand_column: bool | None = None,
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
        self.children_column_name = children_column_name
        self.column_title = column_title
        self.column_width = column_width
        self.expanded_row_class_name = expanded_row_class_name
        self.expanded_row_keys = expanded_row_keys
        self.expanded_row_render = expanded_row_render
        self.expand_icon = expand_icon
        self.default_expand_all_rows = default_expand_all_rows
        self.default_expanded_row_keys = default_expanded_row_keys
        self.expand_row_by_click = expand_row_by_click
        self.fixed = fixed
        self.indent_size = indent_size
        self.row_expandable = row_expandable
        self.show_expand_column = show_expand_column

    FRONTEND_DIR = resolve_frontend_dir("table", "expandable")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: list[str] | None) -> list[str] | None:
        return payload

    def postprocess(self, value: list[str] | None) -> list[str] | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
