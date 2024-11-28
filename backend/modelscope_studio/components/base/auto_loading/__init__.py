from __future__ import annotations

from typing import Any

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class ModelScopeAutoLoading(ModelScopeLayoutComponent):
    """
    """

    EVENTS = []

    # supported slots
    SLOTS = ["render", "errorRender", "loadingText"]

    def __init__(
            self,
            *,
            generating: bool | None = None,
            show_error: bool | None = None,
            show_mask: bool | None = None,
            show_timer: bool = True,
            loading_text: str | None = None,
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
        self.generating = generating
        self.show_error = show_error
        self.show_mask = show_mask
        self.show_timer = show_timer
        self.loading_text = loading_text

    FRONTEND_DIR = resolve_frontend_dir("auto-loading", type="base")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
