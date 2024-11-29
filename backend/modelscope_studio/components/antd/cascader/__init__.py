from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdCascaderOption
from .panel import AntdCascaderPanel


# as inputs, outputs
class AntdCascader(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/cascader
    """
    Option = AntdCascaderOption
    Panel = AntdCascaderPanel

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("search",
                      callback=lambda block: block._internal.update(
                          bind_search_event=True)),
        EventListener("dropdown_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownVisibleChange_event=True)),
        EventListener("load_data",
                      callback=lambda block: block._internal.update(
                          bind_loadData_event=True)),
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon',
        'suffixIcon',
        'maxTagPlaceholder',
        'notFoundContent',
        'expandIcon',
        'removeIcon',
        'displayRender',
        'tagRender',
        'dropdownRender',
        'showSearch.render',
    ]

    def __init__(
            self,
            value: list[str] | list[int | float] | None = None,
            props: dict | None = None,
            *,
            allow_clear: bool | dict = False,
            auto_clear_search_value: bool = True,
            auto_focus: bool | None = None,
            change_on_select: bool | None = None,
            default_value: str | None = None,
            disabled: bool | None = None,
            display_render: str | None = None,
            tag_render: str | None = None,
            popup_class_name: str | None = None,
            dropdown_render: str | None = None,
            expand_icon: str | None = None,
            expand_trigger: Literal['click', 'hover'] = 'click',
            filed_names: dict | None = None,
            get_popup_container: str | None = None,
            max_tag_count: int | Literal['responsive'] | None = None,
            max_tag_placeholder: str | None = None,
            max_tag_text_length: int | None = None,
            not_found_content: str | None = None,
            open: bool | None = None,
            options: list[dict] | None = None,
            placeholder: str | None = None,
            placement: Literal['bottomLeft', 'bottomRight', 'topLeft',
                               'topRight'] = 'bottomLeft',
            show_search: bool | dict = False,
            size: Literal['small', 'middle', 'large'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            suffix_icon: str | None = None,
            variant: Literal['outlined', 'borderless', 'filled']
        | None = None,
            multiple: bool | None = None,
            show_checked_strategy: Literal['SHOW_PARENT', 'SHOW_CHILD']
        | None = None,
            remove_icon: str | None = None,
            search_value: str | None = None,
            dropdown_menu_column_style: dict | None = None,
            option_render: str | None = None,
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
        self.allow_clear = allow_clear
        self.auto_clear_search_value = auto_clear_search_value
        self.auto_focus = auto_focus
        self.change_on_select = change_on_select
        self.default_value = default_value
        self.disabled = disabled
        self.display_render = display_render
        self.tag_render = tag_render
        self.popup_class_name = popup_class_name
        self.dropdown_render = dropdown_render
        self.expand_icon = expand_icon
        self.expand_trigger = expand_trigger
        self.filed_names = filed_names
        self.get_popup_container = get_popup_container
        self.max_tag_count = max_tag_count
        self.max_tag_placeholder = max_tag_placeholder
        self.max_tag_text_length = max_tag_text_length
        self.not_found_content = not_found_content
        self.open = open
        self.options = options
        self.placeholder = placeholder
        self.placement = placement
        self.show_search = show_search
        self.size = size
        self.status = status
        self.suffix_icon = suffix_icon
        self.variant = variant
        self.multiple = multiple
        self.show_checked_strategy = show_checked_strategy
        self.remove_icon = remove_icon
        self.search_value = search_value
        self.dropdown_menu_column_style = dropdown_menu_column_style
        self.option_render = option_render
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("cascader")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [{
                "type": "array",
                "items": {
                    "type": "string"
                }
            }, {
                "type": "string"
            }]
        }

    def preprocess(
        self, payload: None | list[str] | list[int | float]
    ) -> None | list[str] | list[int | float]:
        return payload

    def postprocess(
        self, value: None | list[str] | list[int | float]
    ) -> None | list[str] | list[int | float]:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
