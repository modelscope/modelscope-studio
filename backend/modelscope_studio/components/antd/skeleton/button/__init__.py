from __future__ import annotations

from typing import Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdSkeletonButton(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/skeleton
    """
    EVENTS = []

    def __init__(
            self,
            props: dict | None = None,
            *,
            active: bool | None = None,
            block: bool | None = None,
            shape: Literal['default', 'circle', 'round', 'square']
        | None = None,
            size: Literal['large', 'small', 'default'] | None = None,
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
        self.active = active
        self.block = block
        self.shape = shape
        self.size = size
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("skeleton", "button")

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
