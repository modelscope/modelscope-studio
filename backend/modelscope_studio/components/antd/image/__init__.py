from __future__ import annotations

from pathlib import Path
from typing import Any, Union

from gradio import processing_utils
from gradio.data_classes import FileData, GradioRootModel
from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .preview_group import AntdImagePreviewGroup


class AntdImageData(GradioRootModel):
    root: Union[FileData, str]


class AntdImage(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/image
    """
    PreviewGroup = AntdImagePreviewGroup

    EVENTS = [
        EventListener("error",
                      callback=lambda block: block._internal.update(
                          bind_error_event=True)),
        EventListener("preview_transform",
                      callback=lambda block: block._internal.update(
                          bind_preview_transform_event=True)),
        EventListener("preview_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_preview_visibleChange_event=True))
    ]

    # supported slots
    SLOTS = [
        'placeholder',
        'preview.mask',
        'preview.closeIcon',
        'preview.toolbarRender',
        'preview.imageRender',
    ]

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            alt: str | None = None,
            fallback: str | None = None,
            height: str | int | float | None = None,
            placeholder: bool | str | int | float | None = None,
            preview: bool | dict | None = None,
            width: str | int | float | None = None,
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
        self.props = props
        self.alt = alt
        self.fallback = fallback
        self.height = height
        self.placeholder = placeholder
        self.preview = preview
        self.width = width
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("image")

    data_model = AntdImageData

    @property
    def skip_api(self):
        return True

    def preprocess(
            self,
            payload: str | AntdImageData | None) -> str | AntdImageData | None:
        if isinstance(payload, AntdImageData):
            value = payload.root
            if isinstance(value, FileData):
                return value.path
            return value
        return payload

    def postprocess(self, value: str | None) -> str | None:
        if value is None:
            return None
        if value.startswith("http") or value.startswith("data"):
            return AntdImageData(root=value)
        file = processing_utils.move_resource_to_block_cache(value, self)
        return AntdImageData(root=FileData(path=file,
                                           orig_name=Path(file).name,
                                           size=Path(file).stat().st_size))

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
