from __future__ import annotations

from typing import Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .rule import AntdFormItemRule


class AntdFormItem(ModelScopeLayoutComponent):
    """
    """
    Rule = AntdFormItemRule
    EVENTS = []

    # supported slots
    SLOTS = [
        'extra', 'help', 'label', 'tooltip', 'tooltip.title', 'tooltip.icon',
        'rules'
    ]

    def __init__(
            self,
            label: str | None = None,
            props: dict | None = None,
            *,
            form_name: str | int | float | list[str | int | float]
        | None = None,
            colon: bool | None = None,
            dependencies: list[str | int | float | list[str | int | float]]
        | None = None,
            extra: str | None = None,
            get_value_from_event: str | None = None,
            get_value_props: str | None = None,
            has_feedback: bool | dict = False,
            help: str | None = None,
            hidden: bool | None = None,
            html_for: str | None = None,
            initial_value: str | int | float | list | dict | None = None,
            label_align: str | None = None,
            label_col: dict | None = None,
            message_variants: dict | None = None,
            normalize: str | None = None,
            no_style: bool | None = None,
            preserve: bool = True,
            required: bool | None = None,
            rules: list[dict] | None = None,
            should_update: str | None = None,
            tooltip: str | dict | None = None,
            trigger: str | list[str] = 'onChange',
            validate_debounce: int | float | None = None,
            validate_first: bool | Literal['parallel'] = False,
            validate_status: Literal['error', 'success', 'warning',
                                     'validating']
        | None = None,
            validate_trigger: str | list[str] = 'onChange',
            value_prop_name: str | None = None,
            wrapper_col: dict | None = None,
            layout: Literal['horizontal', 'vertical'] | None = None,
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
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.label = label
        self.form_name = form_name
        self.props = props
        self.colon = colon
        self.dependencies = dependencies
        self.extra = extra
        self.get_value_from_event = get_value_from_event
        self.get_value_props = get_value_props
        self.has_feedback = has_feedback
        self.help = help
        self.hidden = hidden
        self.html_for = html_for
        self.initial_value = initial_value
        self.label_align = label_align
        self.label_col = label_col
        self.message_variants = message_variants
        self.normalize = normalize
        self.no_style = no_style
        self.preserve = preserve
        self.required = required
        self.rules = rules
        self.should_update = should_update
        self.tooltip = tooltip
        self.trigger = trigger
        self.validate_debounce = validate_debounce
        self.validate_first = validate_first
        self.validate_status = validate_status
        self.validate_trigger = validate_trigger
        self.value_prop_name = value_prop_name
        self.wrapper_col = wrapper_col
        self.layout = layout
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("form", "item")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:
        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
