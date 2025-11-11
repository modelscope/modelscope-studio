from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class ModelScopeProMonacoEditorDiffEditor(ModelScopeDataLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("mount",
                      callback=lambda block: block._internal.update(
                          bind_mount_event=True),
                      doc="An event is emitted when the editor is mounted."),
        EventListener(
            "change",
            callback=lambda block: block._internal.update(bind_change_event=
                                                          True),
            doc="An event is emitted when the editor value is changed."),
        EventListener(
            "validate",
            callback=lambda block: block._internal.update(bind_validate_event=
                                                          True),
            doc=
            "An event is emitted when the editor value is changed and the validation markers are ready."
        ),
    ]

    # supported slots
    SLOTS = ["loading"]

    def __init__(
            self,
            value: str | None = None,
            *,
            original: str | None = None,
            # python, javascript etc.
            language: str | None = None,
            original_language: str | None = None,
            modified_language: str | None = None,
            before_mount: str | None = None,
            after_mount: str | None = None,
            override_services: dict | None = None,
            loading: str | None = None,
            read_only: bool | None = None,
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
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         elem_style=elem_style,
                         **kwargs)
        from .. import ModelScopeProMonacoEditor
        self._loader = ModelScopeProMonacoEditor.LOADER
        self.original = original
        self.line = line
        self.loading = loading
        self.override_services = override_services
        self.options = options
        self.read_only = read_only
        self.before_mount = before_mount
        self.after_mount = after_mount
        self.language = language
        self.original_language = original_language
        self.modified_language = modified_language
        self.height = height

    FRONTEND_DIR = resolve_frontend_dir("monaco-editor",
                                        'diff-editor',
                                        type='pro')

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
