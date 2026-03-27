from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXActionsActionItem(ModelScopeLayoutComponent):
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
    SLOTS = ['label', 'icon', 'actionRender', "subItems"]

    def __init__(
            self,
            label: str | None = None,
            *,
            additional_props: dict | None = None,
            key: str | None = None,
            icon: str | None = None,
            danger: bool | None = None,
            trigger_sub_menu_action: Literal['hover', 'click'] | None = None,
            sub_items: list[dict] | None = None,
            action_render: str | None = None,
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
        self.additional_props = additional_props
        self.label = label
        self.icon = icon
        self.trigger_sub_menu_action = trigger_sub_menu_action
        self.danger = danger
        self.key = key
        self.sub_items = sub_items
        self.action_render = action_render

    FRONTEND_DIR = resolve_frontend_dir("actions", "action-item", type="antdx")

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
