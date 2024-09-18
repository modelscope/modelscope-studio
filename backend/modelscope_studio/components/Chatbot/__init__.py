from __future__ import annotations

import inspect
from pathlib import Path
from typing import Any, Callable, Dict, List, Literal, Optional, Tuple, Union

from gradio import processing_utils
from gradio.components.base import Component
from gradio.data_classes import FileData, GradioModel, GradioRootModel
from gradio.events import Events
from gradio_client import utils as client_utils
from gradio_client.documentation import document, set_documentation_group

from ...utils import CustomComponentDict, process_links, resolve_frontend_dir
from ..MultimodalInput import MultimodalInputData


class FileMessage(GradioModel):
    file: FileData
    alt_text: Optional[str] = None


class MultimodalMessage(GradioModel):
    # By default, message index is used as id. it will cause the message to be re-rendered when id changed.
    id: Optional[str] = None
    # elem id of message container
    elem_id: Optional[str] = None
    # elem classes of message container
    elem_classes: Optional[Union[List[str], str]] = None
    name: Optional[str] = None
    text: Optional[str] = ''
    flushing: Optional[bool] = None
    avatar: Optional[Union[str, FileData]] = ''
    files: Optional[List[Union[FileMessage, dict, FileData, str, Path]]] = None


MultimodalMessageItem = Optional[Union[MultimodalMessage, MultimodalInputData,
                                       dict, str]]


class ChatbotData(GradioRootModel):
    root: List[Tuple[Union[MultimodalMessageItem, List[MultimodalMessageItem]],
                     Union[MultimodalMessageItem,
                           List[MultimodalMessageItem]]]]


set_documentation_group("component")


@document()
class ModelScopeChatbot(Component):
    """
    Displays a chatbot output showing both user submitted messages and responses. Supports a subset of Markdown including bold, italics, code, tables. Also supports audio/video/image files, which are displayed in the MultimodalChatbot, and other kinds of files which are displayed as links.
    Preprocessing: passes the messages in the MultimodalChatbot as a {List[List[str | None | Tuple]]}, i.e. a list of lists. The inner list has 2 elements: the user message and the response message. See `Postprocessing` for the format of these messages.
    Postprocessing: expects function to return a {List[List[str | None | Tuple]]}, i.e. a list of lists. The inner list should have 2 elements: the user message and the response message. The individual messages can be (1) strings in valid Markdown, (2) tuples if sending files: (a filepath or URL to a file, [optional string alt text]) -- if the file is image/video/audio, it is displayed in the MultimodalChatbot, or (3) None, in which case the message is not displayed.

    Demos: chatbot_simple, chatbot_multimodal
    Guides: creating-a-chatbot
    """
    FRONTEND_DIR = resolve_frontend_dir("Chatbot")
    EVENTS = [Events.change, Events.select, Events.like, 'flushed', 'custom']
    data_model = ChatbotData

    @staticmethod
    def data_postprocess(component_instance, value):
        return value

    @staticmethod
    def data_preprocess(component_instance, value):
        return value

    def __init__(
            self,
            value: List[List[str | tuple[str] | tuple[str | Path, str] | None]]
        | Callable | None = None,
            *,
            label: str | None = None,
            every: float | None = None,
            show_label: bool | None = None,
            container: bool = True,
            scale: int | None = None,
            min_width: int = 160,
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: List[str] | str | None = None,
            render: bool = True,
            height: int | None = None,
            rtl: bool = False,
            show_share_button: bool | None = None,
            show_copy_button: bool = False,
            avatar_images: tuple[str | Path | None | dict | list | tuple,
                                 str | Path | None | dict | list | tuple]
        | None = None,
            avatar_image_align: Literal['top', 'middle', 'bottom'] = 'bottom',
            avatar_image_width: Union[int, Literal['auto']] = 45,
            sanitize_html: bool = True,
            render_markdown: bool = True,
            bubble_full_width: bool = True,
            line_breaks: bool = True,
            likeable: bool = False,
            layout: Literal["panel", "bubble"] | None = None,
            flushing: bool = True,
            flushing_speed: int = 5,
            enable_base64: bool = False,
            enable_latex: bool = True,
            latex_single_dollar_delimiter: bool = True,
            latex_delimiters: list[dict[str, str | bool]] | None = None,
            preview: bool = True,
            llm_thinking_presets: List[dict] = [],
            data_postprocess: Callable | None = None,
            data_preprocess: Callable | None = None,
            custom_components: Dict[str, CustomComponentDict] | None = None):
        """
        Parameters:
            value: Default value to show in chatbot. If callable, the function will be called whenever the app loads to set the initial value of the component.
            label: The label for this component. Appears above the component and is also used as the header if there are a table of examples for this component. If None and used in a `gr.Interface`, the label will be the name of the parameter this component is assigned to.
            every: If `value` is a callable, run the function 'every' number of seconds while the client connection is open. Has no effect otherwise. Queue must be enabled. The event can be accessed (e.g. to cancel it) via this component's .load_event attribute.
            show_label: if True, will display label.
            container: If True, will place the component in a container - providing some extra padding around the border.
            scale: relative width compared to adjacent Components in a Row. For example, if Component A has scale=2, and Component B has scale=1, A will be twice as wide as B. Should be an integer.
            min_width: minimum pixel width, will wrap if not sufficient screen space to satisfy this value. If a certain scale value results in this Component being narrower than min_width, the min_width parameter will be respected first.
            visible: If False, component will be hidden.
            elem_id: An optional string that is assigned as the id of this component in the HTML DOM. Can be used for targeting CSS styles.
            elem_classes: An optional list of strings that are assigned as the classes of this component in the HTML DOM. Can be used for targeting CSS styles.
            render: If False, component will not render be rendered in the Blocks context. Should be used if the intention is to assign event listeners now but render the component later.
            height: height of the component in pixels.
            enable_latex: If True, will enable LaTeX rendering.
            latex_single_dollar_delimiter: If True, will enable single dollar delimiter for LaTeX rendering.
            latex_delimiters: A list of dicts of the form {"left": open delimiter (str), "right": close delimiter (str), "display": whether to display in newline (bool), "inline": whether to render inline (bool)} that will be used to render LaTeX expressions. For more information, see the [KaTeX documentation](https://katex.org/docs/autorender.html).
            rtl: If True, sets the direction of the rendered text to right-to-left. Default is False, which renders text left-to-right.
            show_share_button: If True, will show a share icon in the corner of the component that allows user to share outputs. If False, icon does not appear.
            show_copy_button: If True, will show a copy button for each chatbot message.
            avatar_images: Tuple of two avatar image paths or URLs or dict ("avatar" and "name") or list (each item receives the previous parameters) for user(s) and bot(s) (in that order). Pass None for either the user or bot image to skip. Must be within the working directory of the Gradio app or an external URL and use `gr.update` to update.
            sanitize_html: If False, will disable HTML sanitization for chatbot messages. This is not recommended, as it can lead to security vulnerabilities.
            avatar_image_width: Width of the avatar image in pixels, pass in `auto` to automatically stretch in each message.
            avatar_image_align: Aligns the avatar images to the top, middle, or bottom of the message.
            render_markdown: If False, will disable Markdown rendering for chatbot messages.
            bubble_full_width: If False, the chat bubble will fit to the content of the message. If True (default), the chat bubble will be the full width of the component.
            line_breaks: If True (default), will enable Github-flavored Markdown line breaks in chatbot messages. If False, single new lines will be ignored. Only applies if `render_markdown` is True.
            likeable: Whether the chat messages display a like or dislike button. Set automatically by the .like method but has to be present in the signature for it to show up in the config.
            layout: If "panel", will display the chatbot in a llm style layout. If "bubble", will display the chatbot with message bubbles, with the user and bot messages on alterating sides. Will default to "bubble".
            flushing: If True (default), will stream output the chatbot (not the user) messages to the frontend linearly when they are updated. Can be configured for each message.
            flushing_speed: Range 1 to 10, default is 5.
            llm_thinking_presets: llm presets, imported from modelscope_studio.Chatbot.llm_thinking_presets .
            enable_base64: Enable base64 encoding for markdown rendering.
            preview: If True (default), will enable image preview.
            custom_components: Define custom tags for markdown rendering.
        """
        self.likeable = likeable
        self.height = height
        self.rtl = rtl
        self.enable_latex = enable_latex
        self.latex_single_dollar_delimiter = latex_single_dollar_delimiter
        self.latex_delimiters = latex_delimiters
        self.show_share_button = show_share_button
        self.render_markdown = render_markdown
        self.show_copy_button = show_copy_button
        self.sanitize_html = sanitize_html
        self.bubble_full_width = bubble_full_width
        self.line_breaks = line_breaks
        self.layout = layout
        self.flushing = flushing
        self.flushing_speed = flushing_speed
        self.preview = preview
        self.avatar_image_width = avatar_image_width
        self.enable_base64 = enable_base64
        self.data_preprocess = data_preprocess
        self.data_postprocess = data_postprocess
        self.llm_thinking_presets = llm_thinking_presets
        self.custom_components = custom_components
        super().__init__(
            label=label,
            every=every,
            show_label=show_label,
            container=container,
            scale=scale,
            min_width=min_width,
            visible=visible,
            elem_id=elem_id,
            elem_classes=elem_classes,
            render=render,
            value=value,
        )
        self.avatar_images = avatar_images or [None, None]
        self.avatar_image_align = avatar_image_align

        if avatar_images is None:
            pass
        else:
            if len(self.avatar_images) != 2:
                raise ValueError(
                    "Expected avatar_images to be a tuple of length 2.")
            for i, avatar_image_item in enumerate(self.avatar_images):
                if isinstance(avatar_image_item, (list, tuple)):
                    for j, avatar_image in enumerate(avatar_image_item):
                        self.avatar_images[i][j] = self._process_avatar_image(
                            avatar_image)
                else:
                    self.avatar_images[i] = self._process_avatar_image(
                        avatar_image_item)

    def _process_avatar_image(self, avatar_image: str | dict):
        if isinstance(avatar_image, dict):
            avatar_image[
                "avatar"] = processing_utils.move_resource_to_block_cache(
                    avatar_image.get("avatar"), self)
        elif isinstance(avatar_image, str):
            avatar_image = processing_utils.move_resource_to_block_cache(
                avatar_image, self)
        return avatar_image

    def _preprocess_chat_messages(
        self, chat_message: MultimodalMessage | str | dict | None
    ) -> MultimodalMessage | None:
        if chat_message is None:
            return None
        if isinstance(chat_message, dict):
            chat_message = MultimodalMessage(**chat_message)
        if isinstance(chat_message, MultimodalMessage):
            if chat_message.avatar and isinstance(chat_message.avatar, str):
                chat_message.avatar = FileData(
                    path=chat_message.avatar,
                    orig_name=Path(chat_message.avatar).name,
                    size=Path(chat_message.avatar).stat().st_size)
            if chat_message.files is not None and len(chat_message.files) > 0:
                for i, file in enumerate(chat_message.files):
                    if isinstance(file, FileData):
                        chat_message.files[i] = FileMessage(file=file)
                    elif isinstance(file, str):
                        chat_message.files[i] = FileMessage(
                            file=FileData(path=file,
                                          orig_name=Path(file).name,
                                          size=Path(file).stat().st_size))
                    elif isinstance(file, dict):
                        chat_message.files[i] = FileMessage(file=FileData(
                            **file))
                return chat_message
            else:
                return chat_message
        elif isinstance(chat_message, str):
            return MultimodalMessage(text=chat_message)
        else:
            raise ValueError(
                f"Invalid message for Chatbot component: {chat_message}")

    def preprocess(
        self,
        payload: ChatbotData | None,
    ) -> List[List[MultimodalMessage | None]]:
        if self.data_preprocess:
            payload = self.data_preprocess(self, payload)
            payload = self.__class__.data_preprocess(self, payload)
        if payload is None:
            return payload
        processed_messages = []
        for message_pair in payload.root:
            if not isinstance(message_pair, (tuple, list)):
                raise TypeError(
                    "Expected a list of lists or list of tuples. Received: " +
                    message_pair)
            if len(message_pair) != 2:
                raise TypeError(
                    "Expected a list of lists of length 2 or list of tuples of length 2. Received: "
                    + {message_pair})
            processed_message = []
            for message in message_pair:
                processed_message.append([
                    self._preprocess_chat_messages(message_item)
                    for message_item in message
                ] if isinstance(message, (
                    tuple, list)) else self._preprocess_chat_messages(message))

            processed_messages.append(processed_message)
        return processed_messages

    def _postprocess_chat_messages(
        self, chat_message: MultimodalMessage | MultimodalInputData | str
        | dict | None
    ) -> MultimodalMessage | None:
        if chat_message is None:
            return None
        if isinstance(chat_message, MultimodalInputData):
            chat_message = dict(text=chat_message.text,
                                files=chat_message.files)
        if isinstance(chat_message, str):
            chat_message = dict(text=chat_message)
        if isinstance(chat_message, dict):
            chat_message = MultimodalMessage(**chat_message)
        chat_message.text = process_links(inspect.cleandoc(chat_message.text),
                                          self)
        if chat_message.avatar:
            if isinstance(chat_message.avatar, str):
                mime_type = client_utils.get_mimetype(chat_message.avatar)
                chat_message.avatar = FileData(
                    path=chat_message.avatar,
                    orig_name=Path(chat_message.avatar).name,
                    size=Path(chat_message.avatar).stat().st_size,
                    mime_type=mime_type)
            # Fix Gradio
            chat_message.avatar.url = None

        if chat_message.files:
            for i, file in enumerate(chat_message.files):
                new_file = file
                if isinstance(file, str):
                    mime_type = client_utils.get_mimetype(file)
                    new_file = FileMessage(
                        file=FileData(path=file,
                                      orig_name=Path(file).name,
                                      size=Path(file).stat().st_size,
                                      mime_type=mime_type))
                elif isinstance(file, Path):
                    mime_type = client_utils.get_mimetype(str(file))
                    new_file = FileMessage(
                        file=FileData(path=str(file),
                                      orig_name=file.name,
                                      size=file.stat().st_size,
                                      mime_type=mime_type))
                elif isinstance(file, FileData):
                    new_file = FileMessage(file=file.model_copy())
                elif isinstance(file, dict):
                    new_file = FileMessage(file=FileData(**file))
                new_file.file.mime_type = client_utils.get_mimetype(
                    new_file.file.path)
                # Fix Gradio
                new_file.file.url = None
                chat_message.files[i] = new_file

        return chat_message

    def postprocess(
        self,
        value: List[List[str | dict | MultimodalInputData | MultimodalMessage
                         | None] | tuple],
    ) -> ChatbotData:
        if self.data_postprocess:
            value = self.data_postprocess(self, value)
        value = self.__class__.data_postprocess(self, value)
        if value is None:
            return ChatbotData(root=[])
        processed_messages = []
        for message_pair in value:
            if not isinstance(message_pair, (tuple, list)):
                raise TypeError(
                    "Expected a list of lists or list of tuples. Received: " +
                    message_pair)
            if len(message_pair) != 2:
                raise TypeError(
                    "Expected a list of lists of length 2 or list of tuples of length 2. Received: "
                    + {message_pair})
            processed_message = []
            for message in message_pair:
                processed_message.append([
                    self._postprocess_chat_messages(message_item)
                    for message_item in message
                ] if isinstance(message, (
                    tuple,
                    list)) else self._postprocess_chat_messages(message))

            processed_messages.append(processed_message)
        return ChatbotData(root=processed_messages)

    def example_inputs(self) -> Any:
        return [[{
            "text": "Hello!!",
            "files": []
        }, {
            "text": "Hello!!",
            "flushing": False
        }]]
