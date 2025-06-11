from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXActionsItem(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/actions
    """

    EVENTS = [
        EventListener(
            "item_click",
            callback=lambda block: block._internal.update(bind_itemClick_event=
                                                          True),
            doc="Callback function when the custom action button is clicked."),
    ]

    # Supported slots
    SLOTS = ['label', 'icon']

    def __init__(
            self,
            label: str | None = None,
            props: dict | None = None,
            *,
            key: str | None = None,
            icon: str | None = None,
            trigger_sub_menu_action: Literal['hover', 'click'] | None = None,
            danger: bool | None = None,
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
        self.label = label
        self.icon = icon
        self.trigger_sub_menu_action = trigger_sub_menu_action
        self.danger = danger
        self.key = key

    FRONTEND_DIR = resolve_frontend_dir("actions", "item", type="antdx")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
