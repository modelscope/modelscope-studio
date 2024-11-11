from __future__ import annotations

from pathlib import Path
from typing import Any, Literal, Union

from gradio import processing_utils
from gradio.data_classes import FileData, GradioRootModel
from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .group import AntdAvatarGroup


class AntdAvatarData(GradioRootModel):
    root: Union[FileData, str]


class AntdAvatar(ModelScopeDataLayoutComponent):
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
            value: str | None = None,
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
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
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

    data_model = AntdAvatarData

    @property
    def skip_api(self):
        return True

    def preprocess(
            self, payload: str | AntdAvatarData | None
    ) -> str | AntdAvatarData | None:
        if isinstance(payload, AntdAvatarData):
            value = payload.root
            if isinstance(value, FileData):
                return value.path
            return value
        return payload

    def postprocess(self, value: str | None) -> str | None:
        if value is None:
            return None
        if value.startswith("http") or value.startswith("data"):
            return AntdAvatarData(root=value)
        file = processing_utils.move_resource_to_block_cache(value, self)
        return AntdAvatarData(root=FileData(path=file,
                                            orig_name=Path(file).name,
                                            size=Path(file).stat().st_size))

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
