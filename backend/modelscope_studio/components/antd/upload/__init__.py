from __future__ import annotations

import tempfile
from pathlib import Path
from typing import TYPE_CHECKING, Any, Callable, Literal

import gradio_client.utils as client_utils
from gradio import processing_utils
from gradio.components.base import Component
from gradio.data_classes import FileData, ListFiles
from gradio.events import EventListener
from gradio.utils import NamedString
from gradio_client import handle_file

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .dragger import AntdUploadDragger

if TYPE_CHECKING:
    from gradio.components import Timer


# as inputs, outputs
class AntdUpload(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/upload
    """
    Dragger = AntdUploadDragger

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
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
        'iconRender',
        'itemRender',
    ]

    data_model = ListFiles

    def __init__(
            self,
            value: list[str] | Callable | None = None,
            props: dict | None = None,
            *,
            accept: str | None = None,
            action: str | None = None,
            before_upload: str | None = None,
            custom_request: str | None = None,
            data: dict | str | None = None,
            default_file_list: list[dict] | None = None,
            directory: bool | None = None,
            disabled: bool | None = None,
            file_list: list[dict] | None = None,
            headers: dict | None = None,
            icon_render: str | None = None,
            is_image_url: str | None = None,
            item_render: str | None = None,
            list_type: Literal['text', 'picture', 'picture-card',
                               'picture-circle'] | None = None,
            max_count: int | None = None,
            method: str | None = None,
            multiple: bool | None = None,
            form_name: str | None = None,
            open_file_dialog_on_click: bool | None = True,
            preview_file: str | None = None,
            progress: dict | None = None,
            show_upload_list: bool | dict | None = True,
            with_credentials: bool | None = None,
            root_class_name: str | None = None,
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
        self.accept = accept
        self.action = action
        self.before_upload = before_upload
        self.custom_request = custom_request
        self.data = data
        self.default_file_list = default_file_list
        self.directory = directory
        self.disabled = disabled
        self.file_list = file_list
        self.headers = headers
        self.icon_render = icon_render
        self.is_image_url = is_image_url
        self.item_render = item_render
        self.list_type = list_type
        self.max_count = max_count
        self.method = method
        self.multiple = multiple
        self.form_name = form_name
        self.open_file_dialog_on_click = open_file_dialog_on_click
        self.preview_file = preview_file
        self.progress = progress
        self.show_upload_list = show_upload_list
        self.with_credentials = with_credentials
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("upload")

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
            return []
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
