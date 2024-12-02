from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .tree_node import AntdTreeSelectTreeNode


# as inputs, outputs
class AntdTreeSelect(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/tree-select
    """
    TreeNode = AntdTreeSelectTreeNode

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
        EventListener("search",
                      callback=lambda block: block._internal.update(
                          bind_search_event=True)),
        EventListener("tree_expand",
                      callback=lambda block: block._internal.update(
                          bind_treeExpand_event=True)),
        EventListener("popup_scroll",
                      callback=lambda block: block._internal.update(
                          bind_popupScroll_event=True)),
        EventListener("dropdown_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownVisibleChange_event=True)),
        EventListener("load_data",
                      callback=lambda block: block._internal.update(
                          bind_loadData_event=True)),
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon', 'maxTagPlaceholder', 'notFoundContent',
        'suffixIcon', 'switcherIcon', 'dropdownRender', 'tagRender',
        'treeTitleRender', 'treeData'
    ]

    def __init__(
            self,
            value: str | list[str] | None = None,
            props: dict | None = None,
            *,
            allow_clear: bool | dict | None = None,
            auto_clear_search_value: bool | None = True,
            auto_focus: bool | None = None,
            default_value: str | list[str] | None = None,
            disabled: bool | None = None,
            popup_class_name: str | None = None,
            popup_match_select_width: bool | float | int | None = True,
            dropdown_render: str | None = None,
            dropdown_style: dict | None = None,
            field_names: dict | None = None,
            filter_tree_node: str | bool | None = None,
            get_popup_container: dict | None = None,
            label_in_value: bool | None = None,
            list_height: int | None = 256,
            loading: bool | None = None,
            max_tag_count: int | None = None,
            max_tag_placeholder: str | None = None,
            max_tag_text_length: int | None = None,
            multiple: bool | None = None,
            not_found_content: str | None = None,
            placeholder: str | None = None,
            placement: Literal['bottomLeft', 'bottomRight', 'topLeft',
                               'topRight'] | None = None,
            search_value: str | None = None,
            show_checked_strategy: Literal['SHOW_ALL', 'SHOW_PARENT',
                                           'SHOW_CHILD'] | None = None,
            show_search: bool | None = None,
            size: Literal['large', 'middle', 'small'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            suffix_icon: str | None = None,
            switcher_icon: str | None = None,
            tag_render: str | None = None,
            tree_checkable: bool | None = None,
            tree_check_strictly: bool | None = None,
            tree_data: list[dict] | None = None,
            tree_data_simple_mode: bool | dict | None = False,
            tree_title_render: str | None = None,
            tree_default_expand_all: bool | None = None,
            tree_default_expanded_keys: list[str] | None = None,
            tree_expand_action: str | bool | None = None,
            tree_expanded_keys: list[str] | None = None,
            tree_icon: bool | None = None,
            tree_line: bool | dict | None = None,
            tree_loaded_keys: list[str] | None = None,
            tree_node_filter_prop: str | None = None,
            tree_node_label_prop: str | None = None,
            variant: Literal['outlined', 'borderless', 'solid']
        | None = None,
            virtual: bool | None = True,
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
        self.auto_focus = auto_focus
        self.auto_clear_search_value = auto_clear_search_value
        self.default_value = default_value
        self.disabled = disabled
        self.popup_class_name = popup_class_name
        self.popup_match_select_width = popup_match_select_width
        self.dropdown_render = dropdown_render
        self.dropdown_style = dropdown_style
        self.field_names = field_names
        self.filter_tree_node = filter_tree_node
        self.get_popup_container = get_popup_container
        self.label_in_value = label_in_value
        self.list_height = list_height
        self.loading = loading
        self.max_tag_count = max_tag_count
        self.max_tag_placeholder = max_tag_placeholder
        self.max_tag_text_length = max_tag_text_length
        self.multiple = multiple
        self.not_found_content = not_found_content
        self.placeholder = placeholder
        self.placement = placement
        self.search_value = search_value
        self.show_checked_strategy = show_checked_strategy
        self.show_search = show_search
        self.size = size
        self.status = status
        self.suffix_icon = suffix_icon
        self.switcher_icon = switcher_icon
        self.tag_render = tag_render
        self.tree_checkable = tree_checkable
        self.tree_check_strictly = tree_check_strictly
        self.tree_data = tree_data
        self.tree_data_simple_mode = tree_data_simple_mode
        self.tree_title_render = tree_title_render
        self.tree_default_expand_all = tree_default_expand_all
        self.tree_default_expanded_keys = tree_default_expanded_keys
        self.tree_expand_action = tree_expand_action
        self.tree_expanded_keys = tree_expanded_keys
        self.tree_icon = tree_icon
        self.tree_line = tree_line
        self.tree_loaded_keys = tree_loaded_keys
        self.tree_node_filter_prop = tree_node_filter_prop
        self.tree_node_label_prop = tree_node_label_prop
        self.variant = variant
        self.virtual = virtual
        self.root_class_name = root_class_name
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("tree-select")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [{
                "type": "string"
            }, {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }]
        }

    def preprocess(self, payload: str | list[str]) -> str | list[str]:
        return payload

    def postprocess(self, value: str | list[str] | None) -> str | list[str]:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
