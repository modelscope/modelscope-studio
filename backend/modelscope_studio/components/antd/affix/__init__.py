from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdAffix(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/affix

    Stick an element to the viewport.

    When to use:
    On longer web pages, it's helpful to stick component into the viewport. This is common for menus and actions.

    Please note that Affix should not cover other content on the page, especially when the size of the viewport is small.
    """
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True),
                      doc="Callback for when Affix state is changed.")
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            offset_bottom: int | float | None = None,
            offset_top: int | float | None = 0,
            get_target: str | None = None,
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
            offset_bottom: Offset from the bottom of the viewport (in pixels).
            offset_top: Offset from the top of the viewport (in pixels).
            get_target: Specifies the scrollable area DOM node.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.offset_bottom = offset_bottom
        self.offset_top = offset_top
        self.get_target = get_target

    FRONTEND_DIR = resolve_frontend_dir("affix")

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
