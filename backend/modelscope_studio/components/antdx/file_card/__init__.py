from __future__ import annotations

from typing import Literal, Union

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .list import AntdXFileCardList


class AntdXFileCard(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/file-card
    """

    List = AntdXFileCardList

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True))
    ]

    # supported slots
    SLOTS = [
        'imageProps.placeholder', 'imageProps.preview.mask',
        'imageProps.preview.closeIcon', 'imageProps.preview.toolbarRender',
        'imageProps.preview.imageRender', 'description', 'icon', 'mask',
        'spinProps.icon', 'spinProps.description', 'spinProps.indicator'
    ]

    def __init__(
            self,
            *,
            image_props: dict | None = None,
            filename: str | None = None,
            byte: int | float | None = None,
            size: Literal['small', 'default'] | None = None,
            description: str | None = None,
            loading: bool | None = None,
            type: Literal['image', 'file', 'audio', 'video'] | str
        | None = None,
            src: str | None = None,
            mask: str | None = None,
            icon: Union[Literal['default', 'excel', 'image', 'markdown', 'pdf',
                                'ppt', 'word', 'zip', 'video', 'audio', 'java',
                                'javascript', 'python'], str]
        | None = None,
            video_props: dict | None = None,
            audio_props: dict | None = None,
            spin_props: dict | None = None,
            class_names: dict | str | None = None,
            styles: dict | str | None = None,
            additional_props: dict | None = None,
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
        self.class_names = class_names
        self.styles = styles
        self.additional_props = additional_props
        self.icon = icon
        self.type = type
        self.image_props = image_props
        self.filename = filename
        self.byte = byte
        self.size = size
        self.description = description
        self.loading = loading
        self.mask = mask
        self.video_props = video_props
        self.audio_props = audio_props
        self.spin_props = spin_props

        if isinstance(src, str):
            self.src = self.serve_static_file(src)
        elif isinstance(src, dict):
            if not src.get("url", None) and src.get("path", None):
                self.src = {**src, **self.serve_static_file(self.item["path"])}
            self.src = src

    FRONTEND_DIR = resolve_frontend_dir('file-card', type="antdx")

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
