from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .group import AntdAvatarGroup


class AntdAvatar(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/avatar
    """
    Group = AntdAvatarGroup

    EVENTS = [
        EventListener("error",
                      callback=lambda block: block._internal.update(
                          bind_error_event=True))
    ]

    # supported slots
    SLOTS = ['icon', "src"]

    def __init__(
            self,
            src: str | None = None,
            props: dict | None = None,
            *,
            alt: str | None = None,
            gap: int = 4,
            icon: str | None = None,
            shape: Literal['circle', 'square'] = 'circle',
            size: int | Literal['large', 'small', 'default'] | dict
        | None = 'default',
            src_set: str | None = None,
            draggable: bool | Literal['true', 'false'] | None = None,
            cross_origin: Literal['anonymous', 'use-credentials', '']
        | None = None,
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
        self.src = src
        self.alt = alt
        self.gap = gap
        self.icon = icon
        self.shape = shape
        self.size = size
        self.src_set = src_set
        self.draggable = draggable
        self.cross_origin = cross_origin
        self.root_class_name = root_class_name
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("avatar")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
