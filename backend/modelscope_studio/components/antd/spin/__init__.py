from __future__ import annotations

from typing import Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdSpin(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/spin
    """
    EVENTS = []

    # supported slots
    SLOTS = ['tip', 'indicator']

    def __init__(
            self,
            spinning: bool | None = None,
            props: dict | None = None,
            *,
            delay: int | float | None = None,
            fullscreen: bool | None = None,
            indicator: str | None = None,
            percent: int | float | Literal['auto'] | None = None,
            size: Literal['small', 'default', 'large'] | None = None,
            tip: str | None = None,
            wrapper_class_name: str | None = None,
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
        self.spinning = spinning
        self.delay = delay
        self.fullscreen = fullscreen
        self.indicator = indicator
        self.percent = percent
        self.size = size
        self.tip = tip
        self.wrapper_class_name = wrapper_class_name
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("spin")

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
