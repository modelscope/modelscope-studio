from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdSelectOption


# as inputs, outputs
class AntdSelect(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/select
    """
    Option = AntdSelectOption

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("blur",
                      callback=lambda block: block._internal.update(
                          bind_blur_event=True)),
        EventListener("focus",
                      callback=lambda block: block._internal.update(
                          bind_focus_event=True)),
        EventListener("search",
                      callback=lambda block: block._internal.update(
                          bind_search_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
        EventListener("clear",
                      callback=lambda block: block._internal.update(
                          bind_clear_event=True)),
        EventListener("popup_scroll",
                      callback=lambda block: block._internal.update(
                          bind_popupScroll_event=True)),
        EventListener("dropdown_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownVisibleChange_event=True)),
        EventListener("popup_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_popupVisibleChange_event=True)),
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon', 'maxTagPlaceholder', 'menuItemSelectedIcon',
        'dropdownRender', 'popupRender', 'optionRender', 'tagRender',
        'labelRender', 'notFoundContent', 'removeIcon', 'suffixIcon', 'prefix',
        'options'
    ]

    def __init__(
            self,
            value: str | int | float | list[float | int | str] | None = None,
            props: dict | None = None,
            *,
            allow_clear: bool | dict | None = None,
            auto_clear_search_value: bool | None = None,
            auto_focus: bool | None = None,
            default_active_first_option: bool | None = True,
            default_open: bool | None = None,
            default_value: str | int | float | list[float | int | str]
        | None = None,
            disabled: bool | None = None,
            popup_class_name: str | None = None,
            popup_match_select_width: bool | int | float | None = True,
            dropdown_render: str | None = None,
            popup_render: str | None = None,
            dropdown_style: dict | None = None,
            field_names: dict | None = None,
            filter_option: bool | str | None = None,
            filter_sort: bool | None = None,
            get_popup_container: str | None = None,
            label_in_value: bool | None = None,
            list_height: int | None = None,
            loading: bool | None = None,
            max_count: int | None = None,
            max_tag_count: int | Literal['responsive'] | None = None,
            max_tag_placeholder: str | None = None,
            max_tag_text_length: int | None = None,
            menu_item_selected_icon: str | None = None,
            mode: Literal['multiple', 'tags'] | None = None,
            not_found_content: str | None = None,
            open: bool | None = None,
            option_filter_prop: str | None = None,
            option_label_prop: str | None = None,
            options: list[dict] | None = None,
            option_render: str | None = None,
            placeholder: str | None = None,
            placement: Literal['bottomLeft', 'bottomRight', 'topLeft',
                               'topRight'] | None = 'bottomLeft',
            remove_icon: str | None = None,
            search_value: str | None = None,
            show_search: bool | None = None,
            size: Literal['large', 'middle', 'small'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            suffix_icon: str | None = None,
            prefix: str | None = None,
            tag_render: str | None = None,
            label_render: str | None = None,
            token_separators: list[str] | None = None,
            variant: Literal['outlined', 'borderless', 'filled', 'underlined']
        | None = None,
            virtual: bool | None = True,
            class_names: dict | None = None,
            styles: dict | None = None,
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
        self.allow_clear = allow_clear
        self.auto_clear_search_value = auto_clear_search_value
        self.auto_focus = auto_focus
        self.default_active_first_option = default_active_first_option
        self.default_open = default_open
        self.default_value = default_value
        self.disabled = disabled
        self.prefix = prefix
        self.popup_class_name = popup_class_name
        self.popup_match_select_width = popup_match_select_width
        self.get_popup_container = get_popup_container
        self.dropdown_render = dropdown_render
        self.popup_render = popup_render
        self.dropdown_style = dropdown_style
        self.field_names = field_names
        self.filter_option = filter_option
        self.filter_sort = filter_sort
        self.label_in_value = label_in_value
        self.list_height = list_height
        self.loading = loading
        self.max_count = max_count
        self.max_tag_count = max_tag_count
        self.max_tag_placeholder = max_tag_placeholder
        self.max_tag_text_length = max_tag_text_length
        self.menu_item_selected_icon = menu_item_selected_icon
        self.mode = mode
        self.not_found_content = not_found_content
        self.open = open
        self.option_filter_prop = option_filter_prop
        self.option_label_prop = option_label_prop
        self.options = options
        self.option_render = option_render
        self.placeholder = placeholder
        self.placement = placement
        self.remove_icon = remove_icon
        self.search_value = search_value
        self.show_search = show_search
        self.size = size
        self.status = status
        self.suffix_icon = suffix_icon
        self.tag_render = tag_render
        self.label_render = label_render
        self.token_separators = token_separators
        self.variant = variant
        self.virtual = virtual
        self.class_names = class_names
        self.styles = styles
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("select")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [
                {
                    "type": "string",
                },
                {
                    "type": "number",
                },
                {
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
            ]
        }

    def preprocess(
        self, payload: str | int | float | list[float | int | str] | None
    ) -> str | int | float | list[float | int | str] | None:
        return payload

    def postprocess(
        self, value: str | int | float | list[float | int | str] | None
    ) -> str | int | float | list[float | int | str] | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
