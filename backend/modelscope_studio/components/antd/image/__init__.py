from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .preview_group import AntdImagePreviewGroup


class AntdImage(ModelScopeLayoutComponent):
    """
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
            src: str | None = None,
            props: dict | None = None,
            *,
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
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("image")

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
