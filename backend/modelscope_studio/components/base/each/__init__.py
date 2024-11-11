from __future__ import annotations

from timeit import Timer
from typing import Callable

from gradio.components.base import Component
from gradio.data_classes import GradioRootModel

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class ModelScopeEachData(GradioRootModel):
    root: list = []


# as inputs, outputs
class ModelScopeEach(ModelScopeDataLayoutComponent):
    """
    """
    EVENTS = []
    data_model = ModelScopeEachData

    def __init__(
            self,
            value: list[dict] | Callable = None,
            *,
            context_value: dict | None = None,
            as_item: str | None = None,
            _internal: None = None,

            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            key: int | str | None = None,
            every: Timer | float | None = None,
            inputs: Component | list[Component] | set[Component] | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         render=render,
                         value=value,
                         as_item=as_item,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         key=key,
                         elem_style=elem_style,
                         every=every,
                         inputs=inputs,
                         **kwargs)
        self.context_value = context_value

    FRONTEND_DIR = resolve_frontend_dir("each", type='base')

    @property
    def skip_api(self):
        return False

    def preprocess(self, payload: list | ModelScopeEachData) -> list:
        if isinstance(payload, ModelScopeEachData):
            return payload.root
        return payload

    def postprocess(self, value: list) -> list:
        return value

    def example_payload(self) -> list:
        return []

    def example_value(self) -> list:
        return []
