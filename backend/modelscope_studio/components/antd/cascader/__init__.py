from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdCascaderOption
from .panel import AntdCascaderPanel


# as inputs, outputs
class AntdCascader(ModelScopeDataLayoutComponent):
    """
    """
    Option = AntdCascaderOption
    Panel = AntdCascaderPanel

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("search",
                      callback=lambda block: block._internal.update(
                          bind_search_event=True)),
        EventListener("dropdown_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownVisibleChange_event=True)),
        EventListener("load_data",
                      callback=lambda block: block._internal.update(
                          bind_loadData_event=True)),
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon',
        'suffixIcon',
        'maxTagPlaceholder',
        'notFoundContent',
        'expandIcon',
        'removeIcon',
        'displayRender',
        'tagRender',
        'dropdownRender',
        'showSearch.render',
    ]

    def __init__(
            self,
            value: list[str] | list[int | float] | None = None,
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
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("cascader")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "anyOf": [{
                "type": "array",
                "items": {
                    "type": "string"
                }
            }, {
                "type": "string"
            }]
        }

    def preprocess(
        self, payload: None | list[str] | list[int | float]
    ) -> None | list[str] | list[int | float]:
        return payload

    def postprocess(
        self, value: None | list[str] | list[int | float]
    ) -> None | list[str] | list[int | float]:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
