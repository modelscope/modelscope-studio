from __future__ import annotations

from typing import Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .compact import AntdSpaceCompact


class AntdSpace(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/space

    Set components spacing.

    When to use:
    - Avoid components clinging together and set a unified space.
    - Use Space.Compact when child form components are compactly connected and the border is collapsed

    Difference with Flex component:
    - Space is used to set the spacing between inline elements. It will add a wrapper element for each child element for inline alignment. Suitable for equidistant arrangement of multiple child elements in rows and columns.
    - Flex is used to set the layout of block-level elements. It does not add a wrapper element. Suitable for layout of child elements in vertical or horizontal direction, and provides more flexibility and control.
    """
    Compact = AntdSpaceCompact

    EVENTS = []

    # supported slots
    SLOTS = ['split']

    def __init__(
            self,
            props: dict | None = None,
            *,
            align: Literal['start', 'end', 'center', 'baseline'] | None = None,
            class_names: dict | None = None,
            styles: dict | None = None,
            direction: Literal['vertical', 'horizontal'] | None = 'horizontal',
            size: Literal['small', 'middle', 'large'] | int | float
        | list[Literal['small', 'middle', 'large'] | int | float] = 'small',
            split: str | None = None,
            wrap: bool = False,
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
            align: Align items.
            class_names: Semantic className.
            direction: The space direction.
            size: The space size.
            split: Set split.
            styles: Semantic style.
            wrap: Auto wrap line, when horizontal effective.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.align = align
        self.class_names = class_names
        self.styles = styles
        self.direction = direction
        self.size = size
        self.split = split
        self.wrap = wrap

    FRONTEND_DIR = resolve_frontend_dir("space")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
