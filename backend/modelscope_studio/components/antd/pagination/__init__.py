from __future__ import annotations

from typing import Optional, Union

from gradio.data_classes import GradioModel
from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class PaginationData(GradioModel):
    page: int
    page_size: Optional[Union[int, None]] = None


# as inputs, outputs
class AntdPagination(ModelScopeDataLayoutComponent):
    """
    """
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("show_size_change",
                      callback=lambda block: block._internal.update(
                          bind_showSizeChange_event=True)),
    ]

    # supported slots
    SLOTS = ['showQuickJumper.goButton', 'itemRender']

    data_model = PaginationData

    def __init__(
            self,
            value: int | dict | PaginationData | None = None,
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

    FRONTEND_DIR = resolve_frontend_dir("pagination")

    @property
    def skip_api(self):
        return False

    def preprocess(self,
                   payload: PaginationData | dict) -> PaginationData | dict:
        return payload

    def postprocess(self,
                    value: PaginationData | dict | int) -> PaginationData:
        if isinstance(value, int):
            value = dict(page=value)
        if isinstance(value, dict):
            value = PaginationData(**value)
        return value

    def example_payload(self) -> None:
        return {"page": 1, "page_size": 10}

    def example_value(self) -> None:
        return {"page": 1, "page_size": 10}
