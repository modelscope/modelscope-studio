from __future__ import annotations

from typing import Any

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class ModelScopeApplication(ModelScopeLayoutComponent):
    """
    """

    EVENTS = ["custom"]

    # supported slots
    SLOTS = []

    def __init__(
            self,
            *,
            # gradio properties
            visible: bool = True,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible, render=render, **kwargs)

    FRONTEND_DIR = resolve_frontend_dir("application", type="base")

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
