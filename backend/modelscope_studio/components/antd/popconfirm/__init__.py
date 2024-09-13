from __future__ import annotations

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdPopconfirm(ModelScopeLayoutComponent):
    """
    """
    EVENTS = [
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
        EventListener("cancel",
                      callback=lambda block: block._internal.update(
                          bind_cancel_event=True)),
        EventListener("confirm",
                      callback=lambda block: block._internal.update(
                          bind_confirm_event=True)),
        EventListener("popup_click",
                      callback=lambda block: block._internal.update(
                          bind_popupClick_event=True))
    ]

    # supported slots
    SLOTS = [
        'title',
        'description',
        'cancelButtonProps.icon',
        'cancelText',
        'okButtonProps.icon',
        'okText',
    ]

    def __init__(
            self,
            title: str | None = "",
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
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.title = title
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("popconfirm")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> str:
        return "Popconfirm"

    def example_value(self) -> str:
        return "Popconfirm"
