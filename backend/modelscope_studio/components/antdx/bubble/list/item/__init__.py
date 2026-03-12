from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ......utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXBubbleListItem(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/bubble
    """
    EVENTS = [
        EventListener("typing",
                      callback=lambda block: block._internal.update(
                          bind_typing_event=True),
                      doc="Typing animation callback."),
        EventListener(
            "typing_complete",
            callback=lambda block: block._internal.update(
                bind_typingComplete_event=True),
            doc=
            "Callback when typing effect is completed. If typing is not set, it will be triggered immediately when rendering."
        ),
        EventListener("edit_confirm",
                      callback=lambda block: block._internal.update(
                          bind_editConfirm_event=True),
                      doc="Edit cancel callback."),
        EventListener("edit_cancel",
                      callback=lambda block: block._internal.update(
                          bind_editCancel_event=True),
                      doc="Edit cancel callback.")
    ]

    # supported slots
    SLOTS = [
        'avatar',
        'editable.okText',
        'editable.cancelText',
        'content',
        'footer',
        'header',
        'extra',
        'loadingRender',
        'contentRender',
    ]

    def __init__(
            self,
            content: str | None = None,
            *,
            extra: str | None = None,
            avatar: str | None = None,
            footer: str | None = None,
            header: str | None = None,
            loading: bool | None = None,
            placement: Literal['start', 'end'] | None = None,
            editable: bool | dict | None = None,
            shape: Literal['round', 'corner', 'default'] | None = None,
            typing: bool | dict | str | None = None,
            streaming: bool | None = None,
            variant: Literal['filled', 'borderless', 'outlined', 'shadow']
        | None = None,
            footer_placement: Literal["outer-start", "outer-end",
                                      "inner-start", "inner-end"]
        | None = None,
            loading_render: str | None = None,
            content_render: str | None = None,
            root_class_name: str | None = None,
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
        self.additional_props = additional_props
        self.avatar = avatar
        self.class_names = class_names
        self.content = content
        self.footer = footer
        self.header = header
        self.extra = extra
        self.loading = loading
        self.placement = placement
        self.shape = shape
        self.styles = styles
        self.typing = typing
        self.variant = variant
        self.loading_render = loading_render
        self.content_render = content_render
        self.editable = editable
        self.streaming = streaming
        self.footer_placement = footer_placement
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("bubble", ["list", "item"],
                                        type="antdx")

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
