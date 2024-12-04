from __future__ import annotations

from typing import Any

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdCol(ModelScopeLayoutComponent):
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
            flex: str | int | None = None,
            offset: int = 0,
            order: int = 0,
            pull: int = 0,
            push: int = 0,
            span: int | None = None,
            xs: int | dict | None = None,
            sm: int | dict | None = None,
            md: int | dict | None = None,
            lg: int | dict | None = None,
            xl: int | dict | None = None,
            xxl: int | dict | None = None,
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
            flex:  Flex layout style.
            offset:  The number of cells to offset Col from the left.
            order:  Raster order.
            pull:  The number of cells that raster is moved to the left.
            push:  The number of cells that raster is moved to the right.
            span:  Raster number of cells to occupy, 0 corresponds to display: none.
            xs:  screen < 576px and also default setting, could be a span value or an object containing above props.
            sm:  screen >= 576px, could be a span value or an object containing above props.
            md:  screen >= 768px, could be a span value or an object containing above props.
            lg:  screen >= 992px, could be a span value or an object containing above props.
            xl:  screen >= 1200px, could be a span value or an object containing above props.
            xxl:  screen >= 1600px, could be a span value or an object containing above props.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.flex = flex
        self.offset = offset
        self.order = order
        self.pull = pull
        self.push = push
        self.span = span
        self.xs = xs
        self.sm = sm
        self.md = md
        self.lg = lg
        self.xl = xl
        self.xxl = xxl
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("grid", 'col')

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
