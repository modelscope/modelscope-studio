from __future__ import annotations

from typing import Union

from gradio.data_classes import GradioRootModel
from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .item import AntdFormItem


class AntdFormData(GradioRootModel):
    root: Union[dict, None] = None


class AntdForm(ModelScopeDataLayoutComponent):
    """
    """
    Item = AntdFormItem
    EVENTS = [
        EventListener("fields_change",
                      callback=lambda block: block._internal.update(
                          bind_fieldsChange_event=True)),
        EventListener("finish",
                      callback=lambda block: block._internal.update(
                          bind_finish_event=True)),
        EventListener("finish_failed",
                      callback=lambda block: block._internal.update(
                          bind_finishFailed_event=True)),
        EventListener("values_change",
                      callback=lambda block: block._internal.update(
                          bind_valuesChange_event=True)),
    ]

    data_model = AntdFormData

    # supported slots
    SLOTS = []

    def __init__(
            self,
            value: dict | None = None,
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

    FRONTEND_DIR = resolve_frontend_dir("form")

    @property
    def skip_api(self):
        return False

    def preprocess(self, payload: dict | AntdFormData | None) -> dict | None:
        if isinstance(payload, AntdFormData):
            return payload.root
        return payload

    def postprocess(self, value: dict | None) -> dict | None:
        return value

    def example_payload(self) -> dict:
        return {}

    def example_value(self) -> dict:
        return {}
