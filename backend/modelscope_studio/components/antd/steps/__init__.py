from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdStepsItem


class AntdSteps(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/steps
    """
    Item = AntdStepsItem
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    # supported slots
    SLOTS = ['progressDot', "items"]

    def __init__(
            self,
            props: dict | None = None,
            *,
            current: int = 0,
            direction: Literal['vertical', 'horizontal'] = "horizontal",
            initial: int = 0,
            label_placement: Literal['horizontal', 'vertical'] = 'horizontal',
            percent: int | None = None,
            progress_dot: bool | str = False,
            responsive: bool = True,
            size: Literal['small', 'default'] = 'default',
            status: Literal['wait', 'process', 'finish', 'error'] = 'process',
            type: Literal['default', 'navigation', 'inline'] = 'default',
            items: list[dict] | None = None,
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
        self.current = current
        self.direction = direction
        self.initial = initial
        self.label_placement = label_placement
        self.percent = percent
        self.progress_dot = progress_dot
        self.responsive = responsive
        self.size = size
        self.status = status
        self.type = type
        self.items = items
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("steps")

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
