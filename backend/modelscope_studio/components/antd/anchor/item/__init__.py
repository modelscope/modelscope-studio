from __future__ import annotations

from typing import Any

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdAnchorItem(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/anchor
    Hyperlinks to scroll on one page.

    When to use:
    For displaying anchor hyperlinks on page and jumping between them.
    """
    EVENTS = []
    # supported slots
    SLOTS = ["title"]

    def __init__(
            self,
            title: str | None = None,
            props: dict | None = None,
            *,
            key: str | None = None,
            replace: bool | None = None,
            href: str | None = None,
            href_target: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        """
        Parameters:
            title: The content of hyperlink.
            key: The unique identifier of the Anchor Link.
            href: The target of hyperlink.
            href_target: Specifies where to display the linked URL.
            replace: Replace item href in browser history instead of pushing it.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.title = title
        self.key = key
        self.replace = replace
        self.href = href
        self.href_target = href_target

    FRONTEND_DIR = resolve_frontend_dir("anchor", "item")

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
