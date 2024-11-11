from __future__ import annotations

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdMessage(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/message
    """
    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("close",
                      callback=lambda block: block._internal.update(
                          bind_close_event=True))
    ]

    # supported slots
    SLOTS = ['icon', 'content']

    def __init__(
            self,
            content: str | None = "",
            props: dict | None = None,
            *,
            duration: float | int | None = 3,
            icon: str | None = None,
            key: str | int | float | None = None,
            get_container: str | None = None,
            rtl: bool | None = None,
            top: int | float | None = 8,
            root_class_name: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = False,
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
        self.content = content
        self.duration = duration
        self.icon = icon
        self.key = key
        self.get_container = get_container
        self.rtl = rtl
        self.top = top
        self.root_class_name = root_class_name
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("message")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> str:
        return "Message"

    def example_value(self) -> str:
        return "Message"
