from __future__ import annotations

from typing import Literal, Union

from gradio.data_classes import GradioRootModel
from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .item import AntdFormItem
from .provider import AntdFormProvider


class AntdFormData(GradioRootModel):
    root: Union[dict, None] = None


class AntdForm(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/form
    """
    Item = AntdFormItem
    Provider = AntdFormProvider
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
    SLOTS = ["requiredMark"]

    def __init__(
            self,
            value: dict | None = None,
            props: dict | None = None,
            *,
            colon: bool = True,
            disabled: bool | None = None,
            component: str | False | None = None,
            feedback_icons: str | None = None,
            initial_values: dict | None = None,
            label_align: Literal['left', 'right'] = 'right',
            label_col: dict | None = None,
            label_wrap: bool | None = None,
            layout: Literal['horizontal', 'vertical', 'inline'] = 'horizontal',
            form_name: str | None = None,
            preserve: bool = True,
            required_mark: bool | Literal['optional'] | str | None = None,
            scroll_to_first_error: bool | dict = False,
            size: Literal['small', 'middle', 'large'] | None = None,
            validate_messages: dict | None = None,
            validate_trigger: str | list[str] = 'onChange',
            variant: Literal['outlined', 'borderless', 'filled', 'underlined']
        | None = None,
            wrapper_col: dict | None = None,
            clear_on_destroy: bool | None = None,
            root_class_name: str | None = None,
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
        self.colon = colon
        self.disabled = disabled
        self.component = component
        self.feedback_icons = feedback_icons
        self.initial_values = initial_values
        self.label_align = label_align
        self.label_col = label_col
        self.label_wrap = label_wrap
        self.layout = layout
        self.form_name = form_name
        self.preserve = preserve
        self.required_mark = required_mark
        self.scroll_to_first_error = scroll_to_first_error
        self.size = size
        self.validate_messages = validate_messages
        self.validate_trigger = validate_trigger
        self.variant = variant
        self.wrapper_col = wrapper_col
        self.clear_on_destroy = clear_on_destroy
        self.root_class_name = root_class_name

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
