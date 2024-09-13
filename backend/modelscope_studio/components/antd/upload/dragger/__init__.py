from __future__ import annotations

import tempfile
from pathlib import Path
from typing import TYPE_CHECKING, Any, Callable

import gradio_client.utils as client_utils
from gradio import processing_utils
from gradio.components.base import Component
from gradio.data_classes import FileData, ListFiles
from gradio.events import EventListener
from gradio.utils import NamedString
from gradio_client import handle_file

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir

if TYPE_CHECKING:
    from gradio.components import Timer


# as inputs, outputs
class AntdUploadDragger(ModelScopeDataLayoutComponent):
    """
    """
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
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

    # supported slots
    SLOTS = [
        'showUploadList.extra',
        'showUploadList.previewIcon',
        'showUploadList.removeIcon',
        'showUploadList.downloadIcon',
    ]

    data_model = ListFiles

    def __init__(
            self,
            value: list[str] | Callable | None = None,
            props: dict | None = None,
            *,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            key: int | str | None = None,
            every: Timer | float | None = None,
            inputs: Component | list[Component] | set[Component] | None = None,
            render: bool = True,
            **kwargs):

        super().__init__(as_item=as_item,
                         visible=visible,
                         value=value,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         key=key,
                         elem_style=elem_style,
                         every=every,
                         inputs=inputs,
                         render=render,
                         **kwargs)

        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("upload", "dragger")

    def _process_single_file(self, f: FileData) -> NamedString:
        file_name = f.path
        file = tempfile.NamedTemporaryFile(delete=False, dir=self.GRADIO_CACHE)
        file.name = file_name
        return NamedString(file_name)

    def preprocess(self, payload: ListFiles | None) -> list[str] | None:
        """
            Parameters:
                payload: File information as a list of FileData objects.
            Returns:
                Passes the file as a list of `str`.
            """
        if payload is None:
            return None

        return [self._process_single_file(f) for f in payload]  # type: ignore

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

    def postprocess(self, value: list[str] | None) -> ListFiles | None:
        """
        Parameters:
            value: a `list[str]` of filepaths/URLs.
        Returns:
            File information as a list of FileData objects.
        """
        if value is None:
            return None
        value = self._download_files(value)
        return ListFiles(root=[
            FileData(
                path=file,
                orig_name=Path(file).name,
                size=Path(file).stat().st_size,
            ) for file in value
        ])

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, list[str]]:
        return ListFiles.model_json_schema()

    def example_payload(self) -> Any:
        return [
            handle_file(
                "https://github.com/gradio-app/gradio/raw/main/test/test_files/sample_file.pdf"
            )
        ]

    def example_value(self) -> Any:
        return [
            "https://github.com/gradio-app/gradio/raw/main/test/test_files/sample_file.pdf"
        ]
