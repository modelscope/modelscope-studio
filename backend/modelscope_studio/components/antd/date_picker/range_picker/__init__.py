from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdDatePickerRangePicker(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/date-picker
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener(
            "calendar_change",
            callback=lambda block: block._internal.update(bind_ok_event=True)),
        EventListener("focus",
                      callback=lambda block: block._internal.update(
                          bind_calendarChange_event=True)),
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
            allow_clear: bool | dict = True,
            auto_focus: bool | None = None,
            cell_render: str | None = None,
            components: dict | None = None,
            disabled: bool | None = None,
            disabled_date: str | None = None,
            format: str | list[str] | None = None,
            order: bool = True,
            preserve_invalid_on_blur: bool | None = None,
            input_read_only: bool | None = None,
            locale: dict | None = None,
            mode: Literal['time', 'date', 'month', 'year', 'decade']
        | None = None,
            need_confirm: bool | None = None,
            next_icon: str | None = None,
            open: bool | None = None,
            panel_render: str | None = None,
            picker: Literal['date', 'week', 'month', 'quarter',
                            'year'] = 'date',
            placement: Literal['bottomLeft', 'bottomRight', 'topLeft',
                               'topRight'] = 'bottomLeft',
            placeholder: str | None = None,
            popup_class_name: str | None = None,
            popup_style: dict | None = None,
            get_popup_container: str | None = None,
            min_date: str | int | float | None = None,
            max_date: str | int | float | None = None,
            prev_icon: str | None = None,
            size: Literal['large', 'middle', 'small'] | None = None,
            presets: list[dict] | None = None,
            status: Literal['error', 'warning'] | None = None,
            suffix_icon: str | None = None,
            super_next_icon: str | None = None,
            super_prev_icon: str | None = None,
            variant: Literal['outlined', 'borderless', 'filled'] | None = None,
            allow_empty: tuple[bool, bool] | None = None,
            default_picker_value: str | int | float | None = None,
            default_value: str | int | float | None = None,
            disabled_time: str | None = None,
            id: dict | None = None,
            picker_value: str | int | float | None = None,
            render_extra_footer: str | None = None,
            show_time: bool | dict | None = None,
            separator: str | None = None,
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
        self.preserve_invalid_on_blur = preserve_invalid_on_blur
        self.components = components
        self.locale = locale
        self.allow_clear = allow_clear
        self.auto_focus = auto_focus
        self.cell_render = cell_render
        self.disabled = disabled
        self.disabled_date = disabled_date
        self.format = format
        self.input_read_only = input_read_only
        self.mode = mode
        self.need_confirm = need_confirm
        self.next_icon = next_icon
        self.open = open
        self.panel_render = panel_render
        self.picker = picker
        self.placement = placement
        self.placeholder = placeholder
        self.popup_class_name = popup_class_name
        self.popup_style = popup_style
        self.get_popup_container = get_popup_container
        self.min_date = min_date
        self.max_date = max_date
        self.prev_icon = prev_icon
        self.size = size
        self.presets = presets
        self.status = status
        self.suffix_icon = suffix_icon
        self.super_next_icon = super_next_icon
        self.super_prev_icon = super_prev_icon
        self.variant = variant
        self.allow_empty = allow_empty
        self.default_picker_value = default_picker_value
        self.default_value = default_value
        self.disabled_time = disabled_time
        self.id = id
        self.picker_value = picker_value
        self.render_extra_footer = render_extra_footer
        self.show_time = show_time
        self.separator = separator
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("date-picker", 'range-picker')

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
