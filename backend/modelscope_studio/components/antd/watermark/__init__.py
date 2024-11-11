from __future__ import annotations

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdWatermark(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/watermark
    """
    EVENTS = []

    def __init__(
            self,
            content: str | list[str] | None = "",
            props: dict | None = None,
            *,
            width: int | float | None = None,
            height: int | float | None = None,
            inherit: bool | None = None,
            rotate: int | float | None = None,
            z_index: int | None = None,
            image: str | None = None,
            font: dict | None = None,
            gap: list[int | float] | None = None,
            offset: list[int | float] | None = None,
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
        self.content = content
        self.width = width
        self.height = height
        self.inherit = inherit
        self.rotate = rotate
        self.z_index = z_index
        self.image = image
        self.font = font
        self.gap = gap
        self.offset = offset
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("watermark")

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
