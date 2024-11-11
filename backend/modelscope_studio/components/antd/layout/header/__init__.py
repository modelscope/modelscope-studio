from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdLayoutHeader(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/layout

    Handling the overall layout of a page.

    Component overview:
    - Layout: The layout wrapper, in which Header Sider Content Footer or Layout itself can be nested, and can be placed in any parent container.
    - Header: The top layout with the default style, in which any element can be nested, and must be placed in Layout.
    - Sider: The sidebar with default style and basic functions, in which any element can be nested, and must be placed in Layout.
    - Content: The content layout with the default style, in which any element can be nested, and must be placed in Layout.
    - Footer: The bottom layout with the default style, in which any element can be nested, and must be placed in Layout.
    """
    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True))
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
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
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("layout", 'header')

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
