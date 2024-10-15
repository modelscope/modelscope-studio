from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdFlex(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/flex

    A flex layout container for alignment.

    When to use:
    - Good for setting spacing between elements.
    - Suitable for setting various horizontal and vertical alignments.
    """

    EVENTS = []

    def __init__(
            self,
            props: dict | None = None,
            *,
            vertical: bool = False,
            wrap: Literal['nowrap', 'wrap', 'wrap-reverse'] | bool = "nowrap",
            justify: Literal['normal', 'start', 'end', 'flex-start',
                             'flex-end', 'center', 'left', 'right',
                             'space-between', 'space-around', 'space-evenly',
                             'stretch', 'safe', 'unsafe'] | None = "normal",
            align: Literal['normal', 'start', 'end', 'flex-start', 'flex-end',
                           'center', 'self-start', 'self-end', 'baseline',
                           'unsafe'] | None = "normal",
            flex: str | None = "normal",
            gap: Literal["small", "middle", "large"] | str | int | float
        | None = None,
            component: str | None = None,
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
            vertical: Is direction of the flex vertical, use flex-direction: column.
            wrap: Set whether the element is displayed in a single line or in multiple lines.
            justify: Sets the alignment of elements in the direction of the main axis.
            align: Sets the alignment of elements in the direction of the cross axis.
            flex: flex CSS shorthand properties.
            gap: Sets the gap between grids.
            component: custom element type.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.vertical = vertical
        self.wrap = wrap
        self.justify = justify
        self.align = align
        self.flex = flex
        self.gap = gap
        self.component = component

    FRONTEND_DIR = resolve_frontend_dir("flex")

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
