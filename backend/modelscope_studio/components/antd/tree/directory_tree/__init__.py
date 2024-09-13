from __future__ import annotations

from typing import Any, List, Union

from gradio.data_classes import GradioModel
from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class TreeData(GradioModel):
    expanded_keys: List[str] = []
    selected_keys: List[str] = []
    checked_keys: Union[List[str], dict] = []


# as inputs, outputs
class AntdTreeDirectoryTree(ModelScopeDataLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("check",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
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
                          bind_dragDrop_event=True)),
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
    data_model = TreeData

    def __init__(
            self,
            value: TreeData | dict | None = None,
            props: dict | None = None,
            *,
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

    FRONTEND_DIR = resolve_frontend_dir("tree", "directory-tree")

    @property
    def skip_api(self):
        return False

    def preprocess(self, payload: dict | TreeData) -> dict | TreeData:
        return payload

    def postprocess(self, value: dict | TreeData | None) -> TreeData:
        if isinstance(value, dict):
            value = TreeData(**value)
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
