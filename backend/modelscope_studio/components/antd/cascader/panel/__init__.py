from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdCascaderPanel(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/cascader
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("load_data",
                      callback=lambda block: block._internal.update(
                          bind_loadData_event=True)),
    ]

    # supported slots
    SLOTS = ['notFoundContent', 'expandIcon']

    def __init__(
            self,
            value: list[str] | list[int | float] | None = None,
            props: dict | None = None,
            *,
            change_on_select: bool | None = None,
            default_value: str | None = None,
            expand_icon: str | None = None,
            expand_trigger: Literal['click', 'hover'] = 'click',
            filed_names: dict | None = None,
            not_found_content: str | None = None,
            options: list[dict] | None = None,
            multiple: bool | None = None,
            show_checked_strategy: Literal['SHOW_PARENT', 'SHOW_CHILD']
        | None = None,
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
        self.change_on_select = change_on_select
        self.default_value = default_value
        self.expand_icon = expand_icon
        self.expand_trigger = expand_trigger
        self.filed_names = filed_names
        self.not_found_content = not_found_content
        self.options = options
        self.multiple = multiple
        self.show_checked_strategy = show_checked_strategy
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("cascader", "panel")

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
