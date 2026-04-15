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
            additional_props: dict | None = None,
            *,
            align: Literal['start', 'end', 'center', 'baseline'] | None = None,
            class_names: dict | str | None = None,
            styles: dict | str | None = None,
            direction: Literal['vertical', 'horizontal'] | None = None,
            orientation: Literal['vertical', 'horizontal'] | None = None,
            size: Literal['small', 'middle', 'large'] | int | float
        | list[Literal['small', 'middle', 'large'] | int | float]
        | None = None,
            split: str | None = None,
            separator: str | None = None,
            wrap: bool | None = None,
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
        """
        Parameters:
            align: Align items.
            class_names: dict | str | None
            direction: The space direction.
            orientation: The space orientation (v6 alias for direction).
            size: The space size.
            split: Set split.
            separator: Set separator (v6 alias for split).
            styles: dict | str | None
            wrap: Auto wrap line, when horizontal effective.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.additional_props = additional_props
        self.align = align
        self.class_names = class_names
        self.styles = styles
        self.direction = direction
        self.orientation = orientation
        self.size = size
        self.split = split
        self.separator = separator
        self.wrap = wrap
        self.root_class_name = root_class_name

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
