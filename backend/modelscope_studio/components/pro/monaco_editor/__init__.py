from __future__ import annotations

from typing import Any, Literal, TypedDict, Union

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .diff_editor import ModelScopeProMonacoEditorDiffEditor


class LoaderConfig(TypedDict):
    mode: Literal['cdn', 'local'] | None = None
    cdn_url: str | None = None


class ModelScopeProMonacoEditor(ModelScopeDataLayoutComponent):
    """
    """
    DiffEditor = ModelScopeProMonacoEditorDiffEditor

    EVENTS = [
        EventListener("mount",
                      callback=lambda block: block._internal.update(
                          bind_mount_event=True)),
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("validate",
                      callback=lambda block: block._internal.update(
                          bind_validate_event=True)),
    ]

    # supported slots
    SLOTS = ["loading"]

    # or { "mode": "cdn" }, default cdn: https://cdn.jsdelivr.net/npm/monaco-editor@xxx/min/vs
    LOADER: Union[LoaderConfig, dict, None] = {"mode": "local"}

    def __init__(
            self,
            value: str | None = None,
            *,
            # python, javascript etc.
            language: str | None = None,
            before_mount: str | None = None,
            after_mount: str | None = None,
            override_services: dict | None = None,
            loading: str | None = None,
            options: dict | None = None,
            line: int | None = None,
            height: str | int | float | None = 400,
            _loader: None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         value=value,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         elem_style=elem_style,
                         **kwargs)
        self.line = line
        self.loading = loading
        print('loader', ModelScopeProMonacoEditor.LOADER)
        self._loader = ModelScopeProMonacoEditor.LOADER
        self.override_services = override_services
        self.options = options
        self.before_mount = before_mount
        self.after_mount = after_mount
        self.language = language
        self.height = height

    FRONTEND_DIR = resolve_frontend_dir("monaco-editor", type='pro')

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "string"}

    def preprocess(self, payload: None | str) -> None | str:
        return payload

    def postprocess(self, value: None | str) -> None | str:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
