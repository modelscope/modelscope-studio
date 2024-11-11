from __future__ import annotations

from ......utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdFormItemRule(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/dropdown
    """
    EVENTS = []

    def __init__(
            self,
            props: dict | None = None,
            *,
            default_field: dict | str | None = None,
            enum: list | None = None,
            fields: dict | None = None,
            len: int | None = None,
            max: int | float | None = None,
            message: str | None = None,
            min: int | float | None = None,
            pattern: str | None = None,
            required: bool | None = None,
            transform: str | None = None,
            type: str | None = None,
            validator_trigger: str | list[str] | None = None,
            validator: str | None = None,
            warning_only: bool | None = None,
            whitespace: bool | None = None,
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
        self.default_field = default_field
        self.enum = enum
        self.fields = fields
        self.len = len
        self.max = max
        self.message = message
        self.min = min
        self.pattern = pattern
        self.required = required
        self.transform = transform
        self.type = type
        self.validator_trigger = validator_trigger
        self.validator = validator
        self.warning_only = warning_only
        self.whitespace = whitespace

    FRONTEND_DIR = resolve_frontend_dir("form", ["item", "rule"])

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
