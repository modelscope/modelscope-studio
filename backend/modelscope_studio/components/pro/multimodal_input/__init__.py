from __future__ import annotations

import tempfile
from dataclasses import field
from pathlib import Path
from typing import Optional

import gradio_client.utils as client_utils
from gradio import FileData, processing_utils
from gradio.data_classes import GradioModel, ListFiles
from gradio.events import EventListener
from gradio.utils import NamedString
from typing_extensions import Literal

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class MultimodalInputUploadConfig(GradioModel):
    fullscreen_drop: Optional[bool] = False
    allow_paste_file: Optional[bool] = True
    allow_speech: Optional[bool] = False
    show_count: Optional[bool] = True
    button_tooltip: Optional[str] = None
    accept: Optional[str] = None
    max_count: Optional[int] = None
    directory: Optional[bool] = False
    multiple: Optional[bool] = False
    disabled: Optional[bool] = False
    overflow: Literal['wrap', 'scrollX', 'scrollY'] | None = None
    title: Optional[str] = "Attachments"
    placeholder: Optional[dict] = field(
        default_factory=lambda: {
            "inline": {
                "title": "Upload files",
                "description": "Click or drag files to this area to upload"
            },
            "drop": {
                "title": "Drop files here",
            }
        })


class MultimodalInputValue(GradioModel):
    files: Optional[ListFiles] = None
    text: Optional[str] = None


# as inputs, outputs
class ModelScopeProMultimodalInput(ModelScopeDataLayoutComponent):
    """
    """

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
        EventListener("key_down",
                      callback=lambda block: block._internal.update(
                          bind_keyDown_event=True)),
        EventListener("key_press",
                      callback=lambda block: block._internal.update(
                          bind_keyPress_event=True)),
        EventListener("paste",
                      callback=lambda block: block._internal.update(
                          bind_paste_event=True)),
        EventListener("paste_file",
                      callback=lambda block: block._internal.update(
                          bind_pasteFile_event=True)),
        EventListener("drop",
                      callback=lambda block: block._internal.update(
                          bind_drop_event=True)),
        EventListener("download",
                      callback=lambda block: block._internal.update(
                          bind_download_event=True)),
        EventListener("preview",
                      callback=lambda block: block._internal.update(
                          bind_preview_event=True)),
        EventListener("remove",
                      callback=lambda block: block._internal.update(
                          bind_remove_event=True))
    ]

    data_model = MultimodalInputValue

    # supported slots
    SLOTS = ["prefix"]

    def __init__(
            self,
            value: dict | MultimodalInputValue | None = None,
            *,
            class_names: dict | None = None,
            styles: dict | None = None,
            loading: bool | None = None,
            disabled: bool | None = None,
            read_only: bool | None = None,
            submit_type: Literal['enter', 'shiftEnter'] | None = None,
            placeholder: str | None = None,
            upload_config: MultimodalInputUploadConfig | dict = None,
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
        self.class_names = class_names
        self.disabled = disabled
        self.styles = styles
        self.submit_type = submit_type
        self.read_only = read_only
        self.loading = loading
        self.placeholder = placeholder
        self.root_class_name = root_class_name
        if upload_config is None:
            upload_config = MultimodalInputUploadConfig()
        elif isinstance(upload_config, dict):
            upload_config = MultimodalInputUploadConfig(**upload_config)
        self.upload_config = upload_config.model_dump()

    FRONTEND_DIR = resolve_frontend_dir("multimodal-input", type="pro")

    def _process_single_file(self, f: FileData) -> NamedString:
        file_name = f.path
        file = tempfile.NamedTemporaryFile(delete=False, dir=self.GRADIO_CACHE)
        file.name = file_name
        return NamedString(file_name)

    def preprocess(self,
                   payload: MultimodalInputValue | None) -> list[str] | None:
        if payload is None:
            return dict(text=None, files=[])

        return dict(
            text=payload.text,
            files=[self._process_single_file(f) for f in payload.files or []])

    def _download_files(self, value: list[str]) -> list[str]:
        downloaded_files = []
        for file in value:
            if client_utils.is_http_url_like(file):
                downloaded_file = processing_utils.save_url_to_cache(
                    file, self.GRADIO_CACHE)
                downloaded_files.append(downloaded_file)
            else:
                downloaded_files.append(file)
        return downloaded_files

    def postprocess(self, value: dict | None) -> MultimodalInputValue | None:

        if value is None:
            return MultimodalInputValue()
        files = []
        if "files" in value:
            files = self._download_files(value["files"])

        return MultimodalInputValue(text=value.get("text"),
                                    files=ListFiles(root=[
                                        FileData(
                                            path=file,
                                            orig_name=Path(file).name,
                                            size=Path(file).stat().st_size,
                                        ) for file in files
                                    ]))

    @property
    def skip_api(self):
        return False

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
