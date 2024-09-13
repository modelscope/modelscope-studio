from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdTransfer(ModelScopeDataLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("scroll",
                      callback=lambda block: block._internal.update(
                          bind_scroll_event=True)),
        EventListener("search",
                      callback=lambda block: block._internal.update(
                          bind_search_event=True)),
        EventListener("select_change",
                      callback=lambda block: block._internal.update(
                          bind_selectChange_event=True)),
    ]

    # supported slots
    SLOTS = [
        'selectionsIcon',
        'titles',
        'footer',
        'locale.notFoundContent',
        'selectAllLabels',
    ]

    def __init__(
            self,
            value: list[float | int | str] | None = None,
            props: dict | None = None,
            *,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            key: int | str | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         key=key,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("transfer")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {
            "type": "array",
            "items": {
                "anyOf": [
                    {
                        "type": "string",
                    },
                    {
                        "type": "number",
                    },
                ],
            },
        },

    def preprocess(
        self, payload: list[float | int | str] | None
    ) -> list[float | int | str] | None:
        return payload

    def postprocess(
        self, value: list[float | int | str] | None
    ) -> list[float | int | str] | None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
