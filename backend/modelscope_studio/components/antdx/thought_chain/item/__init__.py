from __future__ import annotations

from typing import Any, Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXThoughtChainItem(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/thought-chain
    """

    EVENTS = []

    # supported slots
    SLOTS = ['content', 'description', 'extra', 'footer', 'icon', 'title']

    def __init__(
            self,
            props: dict | None = None,
            *,
            key: str | None = None,
            content: str | None = None,
            description: str | None = None,
            extra: str | None = None,
            footer: str | None = None,
            icon: str | None = None,
            title: str | None = None,
            status: Literal['pending', 'success', 'error'] | None = None,
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
        self.content = content
        self.description = description
        self.extra = extra
        self.footer = footer
        self.icon = icon
        self.title = title
        self.status = status
        self.key = key

    FRONTEND_DIR = resolve_frontend_dir("thought-chain", "item", type="antdx")

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
