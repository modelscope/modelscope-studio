from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdDrawer(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/drawer
    """
    EVENTS = [
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True))
    ]

    # supported slots
    SLOTS = ['closeIcon', 'extra', 'footer', 'title', 'drawerRender']

    def __init__(
            self,
            props: dict | None = None,
            *,
            after_open_change: str | None = None,
            auto_focus: bool | None = None,
            body_style: dict | None = None,
            close_icon: str | None = None,
            class_names: dict | None = None,
            destroy_on_close: bool | None = None,
            extra: str | None = None,
            footer: str | None = None,
            force_render: bool | None = None,
            get_container: str | None = None,
            height: int | float | str | None = None,
            keyboard: bool | None = None,
            mask: bool | None = None,
            mask_closable: bool | None = None,
            placement: Literal['left', 'right', 'top', 'bottom'] | None = None,
            push: bool | dict | None = None,
            size: Literal['default', 'large'] | None = None,
            styles: dict | None = None,
            title: str | None = None,
            loading: bool | None = None,
            open: bool | None = None,
            width: int | float | None = None,
            z_index: int | None = None,
            drawer_render: str | None = None,
            root_style: dict | None = None,
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
        self.after_open_change = after_open_change
        self.auto_focus = auto_focus
        self.body_style = body_style
        self.close_icon = close_icon
        self.class_names = class_names
        self.destroy_on_close = destroy_on_close
        self.extra = extra
        self.footer = footer
        self.force_render = force_render
        self.get_container = get_container
        self.height = height
        self.keyboard = keyboard
        self.mask = mask
        self.mask_closable = mask_closable
        self.placement = placement
        self.push = push
        self.size = size
        self.styles = styles
        self.title = title
        self.loading = loading
        self.open = open
        self.width = width
        self.z_index = z_index
        self.drawer_render = drawer_render
        self.root_style = root_style
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("drawer")

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
