from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .step import AntdTourStep


class AntdTour(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tour
    """
    Step = AntdTourStep
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True)),
        EventListener("finish",
                      callback=lambda block: block._internal.update(
                          bind_finish_event=True)),
    ]

    # supported slots
    SLOTS = ['closeIcon', 'indicatorsRender', 'actionsRender']

    def __init__(
            self,
            props: dict | None = None,
            *,
            open: bool | None = None,
            current: int | None = None,
            arrow: bool | dict | None = True,
            close_icon: str | None = None,
            disabled_interaction: bool | None = None,
            gap: dict | None = None,
            placement: Literal['center', 'left', 'leftTop', 'leftBottom',
                               'right'
                               'rightTop', 'rightBottom', 'top', 'topLeft',
                               'topRight', 'bottom', 'bottomLeft',
                               'bottomRight'] = 'bottom',
            mask: bool | dict = True,
            type: Literal['default', 'primary'] = 'default',
            scroll_into_view_options: bool | dict = True,
            indicators_render: str | None = None,
            actions_render: str | None = None,
            z_index: int | None = None,
            get_popup_container: str | None = None,
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
        self.open = open
        self.current = current
        self.arrow = arrow
        self.close_icon = close_icon
        self.disabled_interaction = disabled_interaction
        self.gap = gap
        self.placement = placement
        self.mask = mask
        self.type = type
        self.scroll_into_view_options = scroll_into_view_options
        self.indicators_render = indicators_render
        self.actions_render = actions_render
        self.z_index = z_index
        self.get_popup_container = get_popup_container
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("tour")

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
