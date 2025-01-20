from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeComponent, resolve_frontend_dir


# as inputs, outputs
class AntdCalendar(ModelScopeComponent):
    """
    Ant Design: https://ant.design/components/calendar
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("panel_change",
                      callback=lambda block: block._internal.update(
                          bind_panelChange_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True))
    ]

    # supported slots
    SLOTS = ['cellRender', 'fullCellRender', 'headerRender']

    def __init__(
            self,
            value: int | str | float | None = None,
            props: dict | None = None,
            *,
            cell_render: str | None = None,
            full_cell_render: str | None = None,
            default_value: int | str | float | None = None,
            disabled_date: str | None = None,
            fullscreen: bool | None = None,
            show_week: bool | None = None,
            header_render: str | None = None,
            locale: dict | None = None,
            mode: Literal['month', 'year'] | None = None,
            valid_range: tuple[int | str | float, int | str | float]
        | None = None,
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
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.cell_render = cell_render
        self.full_cell_render = full_cell_render
        self.default_value = default_value
        self.disabled_date = disabled_date
        self.show_week = show_week
        self.fullscreen = fullscreen
        self.header_render = header_render
        self.locale = locale
        self.mode = mode
        self.valid_range = valid_range
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("calendar")

    def api_info(self) -> dict[str, Any]:
        return {"anyOf": [{"type": "number"}, {"type": "string"}]}

    @property
    def skip_api(self):
        return False

    def preprocess(self, payload: int | float) -> int | float:
        return payload

    def postprocess(self, value: int | float) -> int | str:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
