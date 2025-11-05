from __future__ import annotations

from typing import Any, Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdRow(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/grid

    24 Grids System.

    In the grid system, we define the frame outside the information area based on row and column, to ensure that every area can have stable arrangement.

    Following is a brief look at how it works:

    - Establish a set of column in the horizontal space defined by row (abbreviated col).
    - Your content elements should be placed directly in the col, and only col should be placed directly in row.
    - The column grid system is a value of 1-24 to represent its range spans. For example, three columns of equal width can be created by <Col span={8} />.
    - If the sum of col spans in a row are more than 24, then the overflowing col as a whole will start a new line arrangement.

    Our grid systems base on Flex layout to allow the elements within the parent to be aligned horizontally - left, center, right, wide arrangement, and decentralized arrangement. The Grid system also supports vertical alignment - top aligned, vertically centered, bottom-aligned. You can also define the order of elements by using order.

    Layout uses a 24 grid layout to define the width of each "box", but does not rigidly adhere to the grid layout.
    """

    EVENTS = []

    def __init__(
            self,
            props: dict | None = None,
            *,
            align: Literal["top", "middle", "bottom", "stretch"]
        | dict[str, Literal["top", "middle", "bottom", "stretch"]] = "top",
            gutter: int | str | dict | list = 0,
            justify: Literal["start", "end", "center", "space-between",
                             'space-around', 'space-evenly']
        | dict[str, Literal["start", "end", "center", "space-between",
                            'space-around', 'space-evenly']] = "start",
            wrap: bool = True,
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
            align:  Vertical alignment.
            gutter:  Spacing between grids, could be a number or a object like { xs: 8, sm: 16, md: 24}. Or you can use array to make horizontal and vertical spacing work at the same time [horizontal, vertical].
            justify:  Horizontal arrangement.
            wrap:  Auto wrap line.
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
        self.gutter = gutter
        self.justify = justify
        self.wrap = wrap
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("grid", 'row')

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
