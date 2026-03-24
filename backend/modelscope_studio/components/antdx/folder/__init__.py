from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .directory_icon import AntdXFolderDirectoryIcon
from .tree_node import AntdXFolderTreeNode


class AntdXFolder(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/folder
    """
    TreeNode = AntdXFolderTreeNode
    DirectoryIcon = AntdXFolderDirectoryIcon

    EVENTS = [
        EventListener("file_click",
                      callback=lambda block: block._internal.update(
                          bind_fileClick_event=True)),
        EventListener("folder_click",
                      callback=lambda block: block._internal.update(
                          bind_folderClick_event=True)),
        EventListener("selected_file_change",
                      callback=lambda block: block._internal.update(
                          bind_selectedFileChange_event=True)),
        EventListener("expanded_paths_change",
                      callback=lambda block: block._internal.update(
                          bind_expandedPathsChange_event=True)),
        EventListener("file_content_service_load_file_content",
                      callback=lambda block: block._internal.update(
                          bind_fileContentService_loadFileContent_event=True)),
    ]

    # supported slots
    SLOTS = [
        'emptyRender', 'previewRender', 'directoryTitle', 'previewTitle',
        'treeData', 'directoryIcons'
    ]

    def __init__(
            self,
            additional_props: dict | None = None,
            *,
            tree_data: list[dict] | None = None,
            selectable: bool | None = None,
            selected_file: list[str] | None = None,
            default_selected_file: list[str] | None = None,
            directory_tree_width: int | float | str | None = None,
            empty_render: str | None = None,
            preview_render: str | None = None,
            expanded_paths: list[str] | None = None,
            default_expanded_paths: list[str] | None = None,
            default_expand_all: bool | None = None,
            directory_title: str | None = None,
            preview_title: str | None = None,
            directory_icons: dict | None = None,
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
        self.class_names = class_names
        self.styles = styles
        self.additional_props = additional_props
        self.root_class_name = root_class_name
        self.tree_data = tree_data
        self.selectable = selectable
        self.selected_file = selected_file
        self.default_selected_file = default_selected_file
        self.directory_tree_width = directory_tree_width
        self.empty_render = empty_render
        self.preview_render = preview_render
        self.expanded_paths = expanded_paths
        self.default_expanded_paths = default_expanded_paths
        self.default_expand_all = default_expand_all
        self.directory_title = directory_title
        self.preview_title = preview_title
        self.directory_icons = directory_icons

    FRONTEND_DIR = resolve_frontend_dir("folder", type="antdx")

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
