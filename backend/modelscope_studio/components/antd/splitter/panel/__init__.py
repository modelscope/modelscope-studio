from __future__ import annotations

from typing import Any

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdSplitterPanel(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/splitter

    Split panels to isolate.

    When to use:
    Can be used to separate areas horizontally or vertically. When you need to freely drag and adjust the size of each area. When you need to specify the maximum and minimum width and height of an area.
    """

    EVENTS = []

    def __init__(
            self,
            props: dict | None = None,
            *,
            default_size: str | int | None = None,
            min: int | str | None = None,
            max: int | str | None = None,
            size: int | str | None = None,
            collapsible: bool | dict = False,
            resizable: bool = True,
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
            default_size:  Initial panel size support number for px or 'percent%' usage.
            min:  Minimum threshold support number for px or 'percent%' usage.
            max:  Maximum threshold support number for px or 'percent%' usage.
            size:  Controlled panel size support number for px or 'percent%' usage.
            collapsible:  Quick folding.
            resizable:  Whether to enable drag and drop.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.default_size = default_size
        self.min = min
        self.max = max
        self.size = size
        self.collapsible = collapsible
        self.resizable = resizable

    FRONTEND_DIR = resolve_frontend_dir("splitter", 'panel')

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
