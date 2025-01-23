from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdTransfer(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/transfer
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("scroll",
                      callback=lambda block: block._internal.update(
                          bind_scroll_event=True)),
        EventListener("search",
                      callback=lambda block: block._internal.update(
                          bind_search_event=True)),
        EventListener("select_change",
                      callback=lambda block: block._internal.update(
                          bind_selectChange_event=True)),
    ]

    # supported slots
    SLOTS = [
        'selectionsIcon', 'titles', 'footer', 'locale.notFoundContent',
        'selectAllLabels', 'render'
    ]

    def __init__(
            self,
            value: list[float | int | str] | None = None,
            props: dict | None = None,
            *,
            data_source: list[dict] | None = None,
            disabled: bool | None = None,
            selections_icon: str | None = None,
            filter_option: str | None = None,
            footer: str | None = None,
            list_style: dict | str | None = None,
            locale: dict | None = None,
            one_way: bool | None = None,
            operations: list[str] | None = None,
            operations_style: dict | None = None,
            pagination: bool | dict | None = False,
            item_render: str | None = None,
            select_all_labels: list[str] | None = None,
            selected_keys: list[str] | list[int | float] | None = None,
            show_search: bool | dict | None = None,
            show_select_all: bool | None = True,
            status: Literal['error', 'warning'] | None = None,
            target_keys: list[str] | list[int | float] | None = None,
            titles: list[str] | None = None,
            root_class_name: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            key: int | str | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         key=key,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.data_source = data_source
        self.disabled = disabled
        self.selections_icon = selections_icon
        self.filter_option = filter_option
        self.footer = footer
        self.list_style = list_style
        self.locale = locale
        self.one_way = one_way
        self.operations = operations
        self.operations_style = operations_style
        self.pagination = pagination
        self.item_render = item_render
        self.select_all_labels = select_all_labels
        self.selected_keys = selected_keys
        self.show_search = show_search
        self.show_select_all = show_select_all
        self.status = status
        self.target_keys = target_keys
        self.titles = titles
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("transfer")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "type": "array",
            "items": {
                "anyOf": [
                    {
                        "type": "string",
                    },
                    {
                        "type": "number",
                    },
                ],
            },
        },

    def preprocess(
        self, payload: list[float | int | str] | None
    ) -> list[float | int | str] | None:
        return payload

    def postprocess(
        self, value: list[float | int | str] | None
    ) -> list[float | int | str] | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
