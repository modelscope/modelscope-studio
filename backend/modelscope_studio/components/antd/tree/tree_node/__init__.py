from __future__ import annotations

from typing import Any

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTreeTreeNode(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tree
    """

    EVENTS = []

    # supported slots
    SLOTS = ["title", 'icon']

    def __init__(
            self,
            title: str | None = None,
            props: dict | None = None,
            *,
            checkable: bool | None = None,
            disable_checkbox: bool | None = None,
            disabled: bool | None = None,
            icon: str | None = None,
            is_leaf: bool | None = None,
            key: str | None = None,
            selectable: bool | None = None,
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
        self.title = title
        self.props = props
        self.checkable = checkable
        self.disable_checkbox = disable_checkbox
        self.disabled = disabled
        self.icon = icon
        self.is_leaf = is_leaf
        self.key = key
        self.selectable = selectable

    FRONTEND_DIR = resolve_frontend_dir("tree", "tree-node")

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
