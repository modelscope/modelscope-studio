from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdEmpty(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/empty
    """

    EVENTS = []

    # supported slots
    SLOTS = ['description', 'image']

    def __init__(
            self,
            props: dict | None = None,
            *,
            description: str | bool | None = None,
            image: str
        | Literal['PRESENTED_IMAGE_DEFAULT', 'PRESENTED_IMAGE_SIMPLE']
        | None = None,
            image_style: dict | None = None,
            root_class_name: str | None = None,
            styles: dict | None = None,
            class_names: dict | None = None,
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
        self.styles = styles
        self.class_names = class_names
        self.description = description
        self.image = image
        self.image_style = image_style
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("empty")

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
