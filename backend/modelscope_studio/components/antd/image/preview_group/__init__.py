from __future__ import annotations

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdImagePreviewGroup(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/image
    """
    EVENTS = [
        EventListener("preview_transform",
                      callback=lambda block: block._internal.update(
                          bind_preview_transform_event=True)),
        EventListener("preview_change",
                      callback=lambda block: block._internal.update(
                          bind_preview_change_event=True)),
        EventListener("preview_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_preview_visibleChange_event=True))
    ]
    # supported slots
    SLOTS = ['preview.mask', 'preview.closeIcon']

    def __init__(
            self,
            items: list[dict | str] | None = None,
            props: dict | None = None,
            *,
            preview: bool | dict | None = None,
            fallback: str | None = None,
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
        self.items = items
        self.preview = preview
        self.fallback = fallback

    FRONTEND_DIR = resolve_frontend_dir("image", 'preview-group')

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
