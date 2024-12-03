from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdCardGrid(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/card

    A container for displaying information.

    When to use:
    A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.
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
            hoverable: bool | None = None,
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
            hoverable:  Lift up when hovering card grid.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         elem_style=elem_style,
                         as_item=as_item,
                         **kwargs)
        self.props = props
        self.hoverable = hoverable

    FRONTEND_DIR = resolve_frontend_dir("card", "grid")

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
