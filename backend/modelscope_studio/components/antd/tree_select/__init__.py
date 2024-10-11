from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .tree_node import AntdTreeSelectTreeNode


# as inputs, outputs
class AntdTreeSelect(ModelScopeDataLayoutComponent):
    """
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
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon',
        'maxTagPlaceholder',
        'notFoundContent',
        'suffixIcon',
        'switcherIcon',
        'dropdownRender',
        'tagRender',
        'treeTitleRender',
    ]

    def __init__(
            self,
            value: str | list[str] | None = None,
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
