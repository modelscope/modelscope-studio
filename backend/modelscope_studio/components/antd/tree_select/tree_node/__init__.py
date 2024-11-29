from __future__ import annotations

from typing import Any

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTreeSelectTreeNode(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tree-select
    """

    EVENTS = []

    # supported slots
    SLOTS = ["title"]

    def __init__(
            self,
            value: str | None = None,
            title: str | None = None,
            props: dict | None = None,
            *,
            disabled: bool | None = None,
            selectable: bool = True,
            checkable: bool | None = None,
            disable_checkbox: bool | None = None,
            is_leaf: bool | None = None,
            key: str | None = None,
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
        self.value = value
        self.title = title
        self.disabled = disabled
        self.selectable = selectable
        self.checkable = checkable
        self.disable_checkbox = disable_checkbox
        self.is_leaf = is_leaf
        self.key = key
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("tree-select", "tree-node")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
