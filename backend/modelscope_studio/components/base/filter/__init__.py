from __future__ import annotations

from typing import Any

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class ModelScopeFilter(ModelScopeLayoutComponent):
    """
    """
    EVENTS = []

    def __init__(self,
                 *,
                 params_mapping: str | None = None,
                 as_item: str | None = None,
                 _internal: None = None,
                 visible: bool = True,
                 render: bool = True,
                 **kwargs):
        super().__init__(visible=visible,
                         render=render,
                         as_item=as_item,
                         **kwargs)
        self.params_mapping = params_mapping

    FRONTEND_DIR = resolve_frontend_dir("filter", type='base')

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
