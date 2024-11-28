from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdCarousel(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/carousel
    """

    EVENTS = []

    def __init__(
            self,
            props: dict | None = None,
            *,
            arrows: bool | None = None,
            autoplay: bool | None = None,
            autoplay_speed: int | float = 3000,
            adaptive_height: bool | None = None,
            dot_position: Literal['top', 'bottom', 'left', 'right'] = 'bottom',
            dots: bool | dict = True,
            draggable: bool | None = None,
            fade: bool | None = None,
            infinite: bool = True,
            speed: int = 500,
            easing: str = 'linear',
            effect: Literal['scrollx', 'fade'] = 'scrollx',
            after_change: str | None = None,
            before_change: str | None = None,
            wait_for_animate: bool | None = None,
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
        self.arrows = arrows
        self.autoplay = autoplay
        self.autoplay_speed = autoplay_speed
        self.adaptive_height = adaptive_height
        self.dot_position = dot_position
        self.dots = dots
        self.draggable = draggable
        self.fade = fade
        self.infinite = infinite
        self.speed = speed
        self.easing = easing
        self.effect = effect
        self.after_change = after_change
        self.before_change = before_change
        self.wait_for_animate = wait_for_animate
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("carousel")

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
