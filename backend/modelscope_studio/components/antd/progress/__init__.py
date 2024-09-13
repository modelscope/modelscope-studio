from __future__ import annotations

from typing import Any

from ....utils.dev import ModelScopeComponent, resolve_frontend_dir


class AntdProgress(ModelScopeComponent):
    """
    """

    EVENTS = []

    def __init__(
            self,
            percent: int = 0,
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
        self.props = props
        self.percent = percent

    FRONTEND_DIR = resolve_frontend_dir("progress")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:
        return value

    def example_payload(self) -> Any:
        return 0

    def example_value(self) -> Any:
        return 0
