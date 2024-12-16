from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .directory_tree import AntdTreeDirectoryTree
from .tree_node import AntdTreeTreeNode


class AntdTree(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tree
    """
    TreeNode = AntdTreeTreeNode
    DirectoryTree = AntdTreeDirectoryTree

    EVENTS = [
        EventListener("check",
                      callback=lambda block: block._internal.update(
                          bind_check_event=True)),
        EventListener("drag_end",
                      callback=lambda block: block._internal.update(
                          bind_dragEnd_event=True)),
        EventListener("drag_enter",
                      callback=lambda block: block._internal.update(
                          bind_dragEnter_event=True)),
        EventListener("drag_leave",
                      callback=lambda block: block._internal.update(
                          bind_dragLeave_event=True)),
        EventListener("drag_over",
                      callback=lambda block: block._internal.update(
                          bind_dragOver_event=True)),
        EventListener("drag_start",
                      callback=lambda block: block._internal.update(
                          bind_dragStart_event=True)),
        EventListener("drop",
                      callback=lambda block: block._internal.update(
                          bind_drop_event=True)),
        EventListener("expand",
                      callback=lambda block: block._internal.update(
                          bind_expand_event=True)),
        EventListener("load",
                      callback=lambda block: block._internal.update(
                          bind_load_event=True)),
        EventListener("right_click",
                      callback=lambda block: block._internal.update(
                          bind_rightClick_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
        EventListener("load_data",
                      callback=lambda block: block._internal.update(
                          bind_loadData_event=True)),
    ]

    # supported slots
    SLOTS = [
        'switcherLoadingIcon',
        'switcherIcon',
        'showLine.showLeafIcon',
        'icon',
        'treeData',
        'draggable.icon',
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            allow_drop: str | None = None,
            auto_expand_parent: bool | None = None,
            block_node: bool | None = None,
            checkable: bool | None = None,
            checked_keys: list[str] | dict | None = None,
            check_strictly: bool | None = None,
            default_checked_keys: list[str] | None = None,
            default_expand_all: bool | None = None,
            default_expanded_keys: list[str] | None = None,
            default_expand_parent: bool | None = None,
            default_selected_keys: list[str] | None = None,
            disabled: bool | None = None,
            draggable: bool | dict | str | None = None,
            expanded_keys: list[str] | None = None,
            filed_names: dict | None = None,
            filter_tree_node: str | None = None,
            height: int | float | None = None,
            icon: str | None = None,
            loaded_keys: list[str] | None = None,
            multiple: bool | None = None,
            root_style: dict | None = None,
            selectable: bool | None = None,
            selected_keys: list[str] | None = None,
            show_icon: bool | None = None,
            show_line: bool | dict | None = None,
            switcher_icon: str | None = None,
            title_render: str | None = None,
            tree_data: list[dict] | None = None,
            virtual: bool | None = None,
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
        self.allow_drop = allow_drop
        self.auto_expand_parent = auto_expand_parent
        self.block_node = block_node
        self.checkable = checkable
        self.checked_keys = checked_keys
        self.check_strictly = check_strictly
        self.default_checked_keys = default_checked_keys
        self.default_expand_all = default_expand_all
        self.default_expanded_keys = default_expanded_keys
        self.default_expand_parent = default_expand_parent
        self.default_selected_keys = default_selected_keys
        self.disabled = disabled
        self.draggable = draggable
        self.expanded_keys = expanded_keys
        self.filed_names = filed_names
        self.filter_tree_node = filter_tree_node
        self.height = height
        self.icon = icon
        self.loaded_keys = loaded_keys
        self.multiple = multiple
        self.root_style = root_style
        self.selectable = selectable
        self.selected_keys = selected_keys
        self.show_icon = show_icon
        self.show_line = show_line
        self.switcher_icon = switcher_icon
        self.title_render = title_render
        self.tree_data = tree_data
        self.virtual = virtual
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("tree")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None | None) -> None:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
