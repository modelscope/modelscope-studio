from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTourStep(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tour
    """
    EVENTS = [
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True)),
        EventListener("next_button_props_click",
                      callback=lambda block: block._internal.update(
                          bind_nextButtonProps_click_event=True)),
        EventListener("prev_button_props_click",
                      callback=lambda block: block._internal.update(
                          bind_prevButtonProps_click_event=True)),
    ]

    # supported slots
    SLOTS = [
        'closeIcon', "cover", "title", "description",
        "nextButtonProps.children", "prevButtonProps.children"
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            elem_target: str | None = None,
            arrow: bool | dict | None = True,
            close_icon: str | None = None,
            cover: str | None = None,
            title: str | None = None,
            description: str | None = None,
            placement: Literal['center', 'left', 'leftTop', 'leftBottom',
                               'right'
                               'rightTop', 'rightBottom', 'top', 'topLeft',
                               'topRight', 'bottom', 'bottomLeft',
                               'bottomRight'] = 'bottom',
            mask: bool | dict = True,
            type: Literal['default', 'primary'] = 'default',
            next_button_props: dict | None = None,
            prev_button_props: dict | None = None,
            scroll_into_view_options: bool | dict = True,
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
        self.elem_target = elem_target
        self.arrow = arrow
        self.close_icon = close_icon
        self.cover = cover
        self.title = title
        self.description = description
        self.placement = placement
        self.mask = mask
        self.type = type
        self.next_button_props = next_button_props
        self.prev_button_props = prev_button_props
        self.scroll_into_view_options = scroll_into_view_options

    FRONTEND_DIR = resolve_frontend_dir("tour", "step")

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
