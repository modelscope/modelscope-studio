from __future__ import annotations

from pathlib import Path
from typing import Any, Callable, List, Literal, Optional, Union

from gradio.components.base import FormComponent
from gradio.data_classes import FileData, GradioModel
from gradio.events import Events
from gradio_client import utils as client_utils
from gradio_client.documentation import document, set_documentation_group

from ...utils import resolve_frontend_dir

set_documentation_group("component")


class MultimodalInputData(GradioModel):
    files: List[Union[FileData, str]] = []
    text: str


@document()
class ModelScopeMultimodalInput(FormComponent):
    """
    Creates a textarea for user to enter string input or display string output.
    Preprocessing: passes textarea value as a {dict(text=str, files=List[str])} into the function.
    Postprocessing: expects a {str|dict(text=str, files=List[str])} returned from function and sets textarea value to it.
    Examples-format: a {str|dict(text=str, files=List[str])} representing the textbox input.

    Demos: hello_world, diff_texts, sentence_builder
    Guides: creating-a-chatbot, real-time-speech-recognition
    """
    FRONTEND_DIR = resolve_frontend_dir("MultimodalInput")

    EVENTS = [
        Events.change,
        Events.input,
        Events.select,
        Events.submit,
        Events.focus,
        Events.blur,
        Events.upload,
    ]
    data_model = MultimodalInputData

    @staticmethod
    def data_postprocess(component_instance, value):
        return value

    @staticmethod
    def data_preprocess(component_instance, value):
        return value

    def __init__(self,
                 value: MultimodalInputData | str | None = None,
                 *,
                 lines: int = 1,
                 max_lines: int = 20,
                 placeholder: str | None = None,
                 label: str | None = None,
                 info: str | None = None,
                 every: float | None = None,
                 show_label: bool | None = None,
                 container: bool = True,
                 scale: int | None = None,
                 min_width: int = 160,
                 interactive: bool | None = None,
                 visible: bool = True,
                 elem_id: str | None = None,
                 autofocus: bool = False,
                 autoscroll: bool = True,
                 elem_classes: List[str] | str | None = None,
                 render: bool = True,
                 type: Literal["text", "password", "email"] = "text",
                 text_align: Literal["left", "right"] | None = None,
                 rtl: bool = False,
                 show_copy_button: bool = False,
                 data_postprocess: Callable | None = None,
                 data_preprocess: Callable | None = None,
                 sources: List[Literal['upload', 'microphone',
                                       'webcam']] = ['upload'],
                 upload_button_props: dict | None = None,
                 submit_button_props: dict | None = None,
                 file_preview_props: dict | None = None,
                 webcam_props: dict | None = None):
        """
        Parameters:
            value: default text to provide in textarea. If callable, the function will be called whenever the app loads to set the initial value of the component.
            lines: minimum number of line rows to provide in textarea.
            max_lines: maximum number of line rows to provide in textarea.
            placeholder: placeholder hint to provide behind textarea.
            label: The label for this component. Appears above the component and is also used as the header if there are a table of examples for this component. If None and used in a `gr.Interface`, the label will be the name of the parameter this component is assigned to.
            info: additional component description.
            every: If `value` is a callable, run the function 'every' number of seconds while the client connection is open. Has no effect otherwise. Queue must be enabled. The event can be accessed (e.g. to cancel it) via this component's .load_event attribute.
            show_label: if True, will display label.
            container: If True, will place the component in a container - providing some extra padding around the border.
            scale: relative width compared to adjacent Components in a Row. For example, if Component A has scale=2, and Component B has scale=1, A will be twice as wide as B. Should be an integer.
            min_width: minimum pixel width, will wrap if not sufficient screen space to satisfy this value. If a certain scale value results in this Component being narrower than min_width, the min_width parameter will be respected first.
            interactive: if True, will be rendered as an editable textbox; if False, editing will be disabled. If not provided, this is inferred based on whether the component is used as an input or output.
            visible: If False, component will be hidden.
            autofocus: If True, will focus on the textbox when the page loads. Use this carefully, as it can cause usability issues for sighted and non-sighted users.
            elem_id: An optional string that is assigned as the id of this component in the HTML DOM. Can be used for targeting CSS styles.
            elem_classes: An optional list of strings that are assigned as the classes of this component in the HTML DOM. Can be used for targeting CSS styles.
            render: If False, component will not render be rendered in the Blocks context. Should be used if the intention is to assign event listeners now but render the component later.
            type: The type of textbox. One of: 'text', 'password', 'email', Default is 'text'.
            text_align: How to align the text in the textbox, can be: "left", "right", or None (default). If None, the alignment is left if `rtl` is False, or right if `rtl` is True. Can only be changed if `type` is "text".
            rtl: If True and `type` is "text", sets the direction of the text to right-to-left (cursor appears on the left of the text). Default is False, which renders cursor on the right.
            show_copy_button: If True, includes a copy button to copy the text in the textbox. Only applies if show_label is True.
            autoscroll: If True, will automatically scroll to the bottom of the textbox when the value changes, unless the user scrolls up. If False, will not scroll to the bottom of the textbox when the value changes.
            sources: A list of sources permitted. "upload" creates a upload button, "microphone" creates a microphone button. "webcam" creates a webcam button.
            upload_button_props: gradio UploadButton props.
            submit_button_props: gradio Button props.
            file_preview_props: FilePreview will render if `value.files` is not empty, accepting the following props: height(int).
            webcam_props: Webcam will render if `sources` contains "webcam", accepting the following props: mirror_webcam(bool), include_audio(bool).
        """
        if type not in ["text", "password", "email"]:
            raise ValueError(
                '`type` must be one of "text", "password", or "email".')

        self.lines = lines
        if type == "text":
            self.max_lines = max(lines, max_lines)
        else:
            self.max_lines = 1
        self.placeholder = placeholder
        self.show_copy_button = show_copy_button
        self.autofocus = autofocus
        self.autoscroll = autoscroll
        self.data_preprocess = data_preprocess
        self.data_postprocess = data_postprocess
        self.submit_button_props = submit_button_props
        self.upload_button_props = upload_button_props
        self.file_preview_props = file_preview_props
        self.webcam_props = webcam_props
        self.sources = sources
        super().__init__(
            label=label,
            info=info,
            every=every,
            show_label=show_label,
            container=container,
            scale=scale,
            min_width=min_width,
            interactive=interactive,
            visible=visible,
            elem_id=elem_id,
            elem_classes=elem_classes,
            render=render,
            value=value,
        )

        self.type = type
        self.rtl = rtl
        self.text_align = text_align

    def preprocess(
            self,
            payload: MultimodalInputData | None) -> MultimodalInputData | None:
        if self.data_preprocess:
            payload = self.data_preprocess(self, payload)
        payload = self.__class__.data_preprocess(self, payload)
        if payload.files is not None and len(payload.files) > 0:
            for i, file in enumerate(payload.files):
                if isinstance(file, str):
                    payload.files[i] = FileData(path=file,
                                                orig_name=Path(file).name,
                                                size=Path(file).stat().st_size)
        return payload

    def postprocess(
            self,
            value: MultimodalInputData | dict | str | None) -> str | None:
        if self.data_postprocess:
            value = self.data_postprocess(self, value)
        value = self.__class__.data_postprocess(self, value)
        if (value is None):
            return MultimodalInputData(text="")
        if isinstance(value, str):
            value = MultimodalInputData(text=value)
        elif isinstance(value, dict):
            value = MultimodalInputData(**value)
        if not value.files:
            value.files = []
        if value.text is None:
            value.text = ""
        for i, file in enumerate(value.files):
            if (isinstance(file, str)):
                value.files[i] = FileData(path=file,
                                          orig_name=Path(file).name,
                                          size=Path(file).stat().st_size)
            value.files[i].mime_type = client_utils.get_mimetype(
                value.files[i].path)
        return value

    def as_example(self,
                   input_data: str | dict | ModelScopeMultimodalInput) -> dict:
        value = input_data
        if isinstance(input_data, str):
            value = MultimodalInputData(text=input_data, files=[])
        if (isinstance(input_data, dict)):
            value = MultimodalInputData(**input_data)
        if value.files is not None and len(value.files) > 0:
            for i, file in enumerate(value.files):
                if (isinstance(file, str)):
                    value.files[i] = FileData(path=file,
                                              orig_name=Path(file).name,
                                              size=Path(file).stat().st_size)
                value.files[i].mime_type = client_utils.get_mimetype(
                    value.files[i].path)
        # gradio fix
        return MultimodalInputData(text=value.text, files=value.files)

    def example_inputs(self) -> Any:
        return {"text": "Hello!!", "files": []}
