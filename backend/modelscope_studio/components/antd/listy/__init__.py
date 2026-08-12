from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdListy(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/listy

    A high performance list component which renders large data sets with
    virtual scrolling.

    When to use:
    - When rendering a long list where the built-in List component becomes slow.
    - When list items should be grouped with sticky group headers.
    """

    EVENTS = [
        EventListener("scroll",
                      callback=lambda block: block._internal.update(
                          bind_scroll_event=True)),
    ]

    # supported slots
    SLOTS = ['itemRender', 'group.title']

    def __init__(
            self,
            items: list[dict] | None = None,
            additional_props: dict | None = None,
            *,
            row_key: str | None = None,
            item_render: str | None = None,
            group: dict | None = None,
            height: int | float | None = None,
            sticky: bool | None = None,
            virtual: bool | None = None,
            root_class_name: str | None = None,
            class_names: dict | str | None = None,
            styles: dict | str | None = None,
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
        self.items = items
        self.row_key = row_key
        self.item_render = item_render
        self.group = group
        self.height = height
        self.sticky = sticky
        self.virtual = virtual
        self.root_class_name = root_class_name
        self.class_names = class_names
        self.styles = styles

    FRONTEND_DIR = resolve_frontend_dir("listy")

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
