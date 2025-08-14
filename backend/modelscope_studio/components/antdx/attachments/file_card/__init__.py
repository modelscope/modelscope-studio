from __future__ import annotations

from typing import Literal, Union

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXAttachmentsFileCard(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/attachments
    """
    EVENTS = [
        EventListener("remove",
                      callback=lambda block: block._internal.update(
                          bind_remove_event=True))
    ]

    # supported slots
    SLOTS = [
        'imageProps.placeholder', 'imageProps.preview.mask',
        'imageProps.preview.closeIcon', 'imageProps.preview.toolbarRender',
        'imageProps.preview.imageRender', 'icon'
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            image_props: dict | None = None,
            icon: Union[Literal['default', 'excel', 'image', 'markdown', 'pdf',
                                'ppt', 'word', 'zip', 'video', 'audio'], str]
        | None = None,
            type: Literal['image', 'file'] | None = None,
            item: dict | str | None = None,
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
        self.icon = icon
        self.type = type
        self.image_props = image_props
        if isinstance(item, str):
            self.item = self.serve_static_file(item)
        elif isinstance(item, dict):
            if not item.get("url", None) and item.get("path", None):
                self.item = {
                    **item,
                    **self.serve_static_file(self.item["path"])
                }
            self.item = item

    FRONTEND_DIR = resolve_frontend_dir("attachments",
                                        'file-card',
                                        type="antdx")

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
