from __future__ import annotations

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .countdown import AntdStatisticCountdown


class AntdStatistic(ModelScopeLayoutComponent):
    """
    """
    Countdown = AntdStatisticCountdown

    EVENTS = []

    # supported slots
    SLOTS = ['prefix', 'suffix', 'title', 'formatter']

    def __init__(
            self,
            value: int | float | str | None = None,
            props: dict | None = None,
            *,
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
        self.value = value
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("statistic")

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
