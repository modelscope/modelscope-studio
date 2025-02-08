from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ......utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXBubbleListItem(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/bubble
    """
    EVENTS = [
        EventListener(
            "typing_complete",
            callback=lambda block: block._internal.update(
                bind_typingComplete_event=True),
            doc=
            "Callback when typing effect is completed. If typing is not set, it will be triggered immediately when rendering."
        )
    ]

    # supported slots
    SLOTS = [
        'avatar',
        'avatar.icon',
        'avatar.src',
        'content',
        'footer',
        'header',
        'loadingRender',
        'messageRender',
    ]

    def __init__(
            self,
            content: str | None = None,
            props: dict | None = None,
            *,
            key: str | int | float | None = None,
            role: str | None = None,
            avatar: str | dict | None = None,
            class_names: dict | None = None,
            footer: str | None = None,
            header: str | None = None,
            loading: bool | None = None,
            placement: Literal['start', 'end'] | None = None,
            shape: Literal['round', 'corner'] | None = None,
            styles: dict | None = None,
            typing: bool | dict | None = None,
            variant: Literal['filled', 'borderless', 'outlined', 'shadow']
        | None = None,
            loading_render: str | None = None,
            message_render: str | None = None,
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
        self.key = key
        self.role = role
        self.avatar = avatar
        self.class_names = class_names
        self.content = content
        self.footer = footer
        self.header = header
        self.loading = loading
        self.placement = placement
        self.shape = shape
        self.styles = styles
        self.typing = typing
        self.variant = variant
        self.loading_render = loading_render
        self.message_render = message_render
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
