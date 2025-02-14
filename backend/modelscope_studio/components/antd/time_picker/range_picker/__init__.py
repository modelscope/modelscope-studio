from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdTimePickerRangePicker(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/time-picker
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("calendar_change",
                      callback=lambda block: block._internal.update(
                          bind_calendarChange_event=True)),
        EventListener("focus",
                      callback=lambda block: block._internal.update(
                          bind_focus_event=True)),
        EventListener("blur",
                      callback=lambda block: block._internal.update(
                          bind_blur_event=True)),
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon',
        'prevIcon',
        'nextIcon',
        'suffixIcon',
        'superNextIcon',
        'superPrevIcon',
        'renderExtraFooter',
        'separator',
        'cellRender',
        'panelRender',
    ]

    def __init__(
            self,
            value: tuple[str | int | float, str | int | float] | None = None,
            props: dict | None = None,
            *,
            order: bool = True,
            allow_clear: bool | dict | None = None,
            auto_focus: bool | None = None,
            cell_render: str | None = None,
            change_on_scroll: bool | None = None,
            default_value: str | int | float | None = None,
            disabled: bool | None = None,
            disabled_time: str | None = None,
            format: str | None = 'HH:mm:ss',
            get_popup_container: dict | None = None,
            hide_disabled_options: bool | None = None,
            hour_step: int | None = 1,
            input_read_only: bool | None = None,
            minute_step: int | None = 1,
            need_confirm: bool | None = None,
            open: bool | None = None,
            placeholder: str | list[str] | None = None,
            placement: Literal['bottomLeft', 'bottomRight', 'topLeft',
                               'topRight']
        | None = 'bottomLeft',
            popup_class_name: str | None = None,
            popup_style: dict | None = None,
            render_extra_footer: str | None = None,
            second_step: int | None = 1,
            show_now: bool | None = True,
            size: Literal['large', 'middle', 'small'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            suffix_icon: str | None = None,
            use_12_hours: bool | None = None,
            variant: Literal['outlined', 'borderless', 'filled', 'underlined']
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
        self.order = order
        self.allow_clear = allow_clear
        self.auto_focus = auto_focus
        self.cell_render = cell_render
        self.change_on_scroll = change_on_scroll
        self.default_value = default_value
        self.disabled = disabled
        self.disabled_time = disabled_time
        self.format = format
        self.get_popup_container = get_popup_container
        self.hide_disabled_options = hide_disabled_options
        self.hour_step = hour_step
        self.input_read_only = input_read_only
        self.minute_step = minute_step
        self.need_confirm = need_confirm
        self.open = open
        self.placeholder = placeholder
        self.placement = placement
        self.popup_class_name = popup_class_name
        self.popup_style = popup_style
        self.render_extra_footer = render_extra_footer
        self.second_step = second_step
        self.show_now = show_now
        self.size = size
        self.status = status
        self.suffix_icon = suffix_icon
        self.use_12_hours = use_12_hours
        self.variant = variant
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("time-picker", 'range-picker')

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "type": "array",
            "items": {
                "anyOf": [{
                    "type": "number"
                }, {
                    "type": "string"
                }]
            }
        }

    def preprocess(
        self, payload: tuple[str | int | float, str | int | float]
    ) -> tuple[str | int | float, str | int | float]:
        return payload

    def postprocess(
        self, value: tuple[str | int | float, str | int | float]
    ) -> tuple[str | int | float, str | int | float]:
        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
