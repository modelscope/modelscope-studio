from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdPagination(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/pagination
    """
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("show_size_change",
                      callback=lambda block: block._internal.update(
                          bind_showSizeChange_event=True)),
    ]

    # supported slots
    SLOTS = ['showQuickJumper.goButton', 'itemRender']

    def __init__(
            self,
            props: dict | None = None,
            *,
            align: Literal['start', 'center', 'end'] | None = None,
            current: int | None = None,
            default_current: int | None = 1,
            default_page_size: int | None = 10,
            page_size: int | None = None,
            disabled: bool | None = None,
            hide_on_single_page: bool | None = None,
            item_render: str | None = None,
            page_size_options: list[str] | list[int] = [10, 20, 50, 100],
            responsive: bool | None = None,
            show_less_items: bool | None = None,
            show_quick_jumper: bool | dict | None = None,
            show_size_changer: bool | dict | None = None,
            show_title: bool = True,
            show_total: str | None = None,
            simple: bool | dict | None = None,
            size: Literal['small', 'default'] | None = None,
            total: int = 0,
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
        self.align = align
        self.current = current
        self.page_size = page_size
        self.total = total
        self.default_current = default_current
        self.default_page_size = default_page_size
        self.disabled = disabled
        self.hide_on_single_page = hide_on_single_page
        self.item_render = item_render
        self.page_size_options = page_size_options
        self.responsive = responsive
        self.show_less_items = show_less_items
        self.show_quick_jumper = show_quick_jumper
        self.show_size_changer = show_size_changer
        self.show_title = show_title
        self.show_total = show_total
        self.simple = simple
        self.size = size
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("pagination")

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
