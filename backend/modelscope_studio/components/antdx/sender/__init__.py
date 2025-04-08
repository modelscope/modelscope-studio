from __future__ import annotations

from typing import Any

from gradio.events import EventListener
from typing_extensions import Literal

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .header import AntdXSenderHeader


# as inputs, outputs
class AntdXSender(ModelScopeDataLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/sender
    """
    Header = AntdXSenderHeader

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True),
                      doc="Callback when input value changes."),
        EventListener("submit",
                      callback=lambda block: block._internal.update(
                          bind_submit_event=True),
                      doc="Callback when click send button."),
        EventListener("cancel",
                      callback=lambda block: block._internal.update(
                          bind_cancel_event=True),
                      doc="Callback when click cancel button."),
        EventListener("allow_speech_recording_change",
                      callback=lambda block: block._internal.update(
                          bind_allowSpeech_recordingChange_event=True),
                      doc="Callback when click cancel button."),
        EventListener("key_down",
                      callback=lambda block: block._internal.update(
                          bind_keyDown_event=True)),
        EventListener("key_press",
                      callback=lambda block: block._internal.update(
                          bind_keyPress_event=True)),
        EventListener("focus",
                      callback=lambda block: block._internal.update(
                          bind_focus_event=True)),
        EventListener("blur",
                      callback=lambda block: block._internal.update(
                          bind_blur_event=True)),
        EventListener("paste",
                      callback=lambda block: block._internal.update(
                          bind_paste_event=True)),
        EventListener("paste_file",
                      callback=lambda block: block._internal.update(
                          bind_pasteFile_event=True)),
    ]

    # supported slots
    SLOTS = ['actions', 'header', 'prefix', 'footer']

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            auto_size: bool | dict | None = None,
            footer: str | None = None,
            actions: str | bool | None = None,
            allow_speech: bool | dict | None = None,
            class_names: dict | None = None,
            components: dict | None = None,
            default_value: str | None = None,
            loading: bool | None = None,
            disabled: bool | None = None,
            header: str | None = None,
            prefix: str | None = None,
            read_only: bool | None = None,
            styles: dict | None = None,
            submit_type: Literal['enter', 'shiftEnter'] | None = None,
            placeholder: str | None = None,
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
        self.auto_size = auto_size
        self.footer = footer
        self.class_names = class_names
        self.default_value = default_value
        self.disabled = disabled
        self.prefix = prefix
        self.styles = styles
        self.submit_type = submit_type
        self.allow_speech = allow_speech
        self.components = components
        self.read_only = read_only
        self.loading = loading
        self.header = header
        self.actions = actions
        self.placeholder = placeholder
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("sender", type="antdx")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "string"}

    def preprocess(self, payload: None | str) -> None | str:
        return payload

    def postprocess(self, value: None | str) -> None | str:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
