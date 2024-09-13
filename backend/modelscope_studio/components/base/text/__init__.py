from __future__ import annotations

from typing import Any

from ....utils.dev import ModelScopeComponent, resolve_frontend_dir
from ...antd.carousel import AntdCarousel
from ...antd.space import AntdSpace


class ModelScopeText(ModelScopeComponent):
    """
    """

    EVENTS = []

    # supported slots
    SLOTS = []

    def __init__(
            self,
            value: str | None = None,
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
        if self.parent and self._internal and (any(
                isinstance(self.parent, component)
                for component in [AntdCarousel, AntdSpace])):
            self._internal.update(fragment=True)
        self.value = value

    FRONTEND_DIR = resolve_frontend_dir("text", type="base")

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
