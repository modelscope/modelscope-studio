from __future__ import annotations

from dataclasses import field
from pathlib import Path
from typing import Callable, List, Literal, Optional, TypedDict, Union

from gradio.data_classes import FileData, GradioModel, GradioRootModel
from gradio_client import utils as client_utils

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class ChatbotMarkdownConfig(GradioModel):
    render_markdown: Optional[bool] = True
    latex_delimiters: Optional[list[dict[str, str | bool]]] = field(
        default_factory=lambda: [{
            "left": "$$",
            "right": "$$",
            "display": True
        }])
    sanitize_html: Optional[bool] = True
    line_breaks: Optional[bool] = True
    rtl: Optional[bool] = False


class ChatbotActionDict(TypedDict):
    action: Literal['copy', 'dislike', 'like', 'regenerate', 'edit', 'delete']
    disabled: Optional[bool] = None
    # Ant Design tooltip: https://ant.design/components/tooltip
    tooltip: Optional[Union[str, dict]] = None
    # Ant Design popconfirm props: https://ant.design/components/popconfirm
    popconfirm: Optional[Union[str, dict]] = None


class ChatbotUserConfig(GradioModel):
    actions: Optional[List[Union[Literal[
        'copy',
        'edit',
        'delete',
    ], ChatbotActionDict, dict]]] = field(default_factory=lambda: [
        'copy', 'edit',
        ChatbotActionDict(
            action='delete',
            popconfirm=dict(title="Delete the message",
                            description="Are you sure to delete this message?",
                            okButtonProps=dict(danger=True)))
    ])
    header: Optional[str] = None
    # Ant Design avatar props: https://ant.design/components/avatar
    avatar: Optional[Union[str, Path, dict, None]] = None
    variant: Optional[Literal['filled', 'borderless', 'outlined',
                              'shadow']] = None
    shape: Optional[Literal['round', 'corner']] = None
    placement: Optional[Literal['start', 'end']] = 'end'
    loading: Optional[bool] = None
    typing: Optional[Union[bool, dict]] = None
    elem_style: Optional[dict] = None
    elem_classes: Optional[Union[str, List[str]]] = None
    styles: Optional[dict] = None
    class_names: Optional[dict] = None


class ChatbotBotConfig(ChatbotUserConfig):
    actions: Optional[List[Union[Literal[
        'copy',
        'like',
        'dislike',
        'regenerate',
        'edit',
        'delete',
    ], ChatbotActionDict, dict]]] = field(default_factory=lambda: [
        'copy', 'like', 'dislike', 'regenerate', 'edit',
        ChatbotActionDict(
            action='delete',
            popconfirm=dict(title="Delete the message",
                            description="Are you sure to delete this message?",
                            okButtonProps=dict(danger=True)))
    ])
    placement: Optional[Literal['start', 'end']] = 'start'


class ChatbotDataTextContentOptions(ChatbotMarkdownConfig):
    pass


class ChatbotDataThoughtContentOptions(ChatbotDataTextContentOptions):
    title: Optional[str] = None
    status: Optional[Literal['pending', 'done']] = None


# Ant Design flex props: https://ant.design/components/flex
class ChatbotDataFileContentOptions(GradioModel):
    vertical: Union[bool] = False
    wrap: Optional[Union[Literal['nowrap', 'wrap', 'wrap-reverse'],
                         bool]] = True
    justify: Optional[Literal['normal', 'start', 'end', 'flex-start',
                              'flex-end', 'center', 'left', 'right',
                              'space-between', 'space-around', 'space-evenly',
                              'stretch', 'safe', 'unsafe']] = "normal"
    align: Optional[Literal['normal', 'start', 'end', 'flex-start', 'flex-end',
                            'center', 'self-start', 'self-end', 'baseline',
                            'unsafe', 'stretch']] = "normal"
    flex: Optional[str] = "normal"
    gap: Optional[Union[Literal["small", "middle", "large"], str, int,
                        float]] = "small"


# Ant Design X prompts props: https://x.ant.design/components/prompts
class ChatbotDataSuggestionContentOptions(GradioModel):
    title: Optional[str] = None
    vertical: Optional[bool] = False
    wrap: Optional[bool] = False


# Ant Design X prompt props: https://x.ant.design/components/prompts#promptprops
class ChatbotDataSuggestionContentItem(GradioModel):
    disabled: Optional[bool] = None
    description: Optional[str] = None
    label: Optional[str] = None
    icon: Optional[str] = None
    key: Optional[str] = None
    children: Optional[List[ChatbotDataSuggestionContentItem]] = None


class ChatbotDataMeta(GradioModel):
    feedback: Optional[Literal['like', 'dislike', None]] = None


class ChatbotDataMessage(ChatbotBotConfig):
    role: Literal['user', 'assistant'] = None
    type: Optional[Literal['text', 'thought', 'file', 'suggestion']] = 'text'
    key: Optional[Union[str, int, float]] = None
    content: Union[str, List[Union[FileData, ChatbotDataSuggestionContentItem,
                                   dict, str]]] = None
    placement: Optional[Literal['start', 'end']] = None
    actions: Optional[List[Union[Literal[
        'copy',
        'like',
        'dislike',
        'regenerate',
        'edit',
        'delete',
    ], ChatbotActionDict, dict]]] = None
    content_options: Optional[
        Union[dict, ChatbotDataTextContentOptions,
              ChatbotDataFileContentOptions, ChatbotDataThoughtContentOptions,
              ChatbotDataSuggestionContentOptions]] = None
    meta: Optional[Union[ChatbotDataMeta, dict]] = None


class ChatbotDataMessages(GradioRootModel):
    root: List[ChatbotDataMessage]


class ModelscopeProChatbot(ModelScopeDataLayoutComponent):
    """
    """
    EVENTS = []

    # supported slots
    SLOTS = ["roles"]

    def __init__(
            self,
            value: Callable | list[ChatbotDataMessage | dict] | None = None,
            *,
            roles: str | dict | None = None,
            auto_scroll: bool = True,
            markdown_config: ChatbotMarkdownConfig | dict | None = None,
            user_config: ChatbotUserConfig | dict | None = None,
            bot_config: ChatbotBotConfig | dict | None = None,
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
        self.roles = roles
        self.auto_scroll = auto_scroll
        if markdown_config is None:
            markdown_config = ChatbotMarkdownConfig()
        elif isinstance(markdown_config, dict):
            markdown_config = ChatbotMarkdownConfig(**markdown_config)
        if user_config is None:
            user_config = ChatbotUserConfig()
        elif isinstance(user_config, dict):
            user_config = ChatbotUserConfig(**user_config)
        if bot_config is None:
            bot_config = ChatbotBotConfig()
        elif isinstance(bot_config, dict):
            bot_config = ChatbotBotConfig(**bot_config)
        if user_config.avatar:
            user_config.avatar = self._process_avatar(user_config.avatar)
        if bot_config.avatar:
            bot_config.avatar = self._process_avatar(bot_config.avatar)

        self.markdown_config = markdown_config.model_dump()
        self.user_config = user_config.model_dump()
        self.bot_config = bot_config.model_dump()

    FRONTEND_DIR = resolve_frontend_dir("chatbot", type="pro")

    data_model = ChatbotDataMessages

    def _process_avatar(self, avatar: str | Path | dict | None):
        if avatar is None:
            return None
        if isinstance(avatar, dict):
            src = avatar.get("src")
            if not src:
                return avatar
            return {**avatar, "src": self.serve_static_file(src)}
        return self.serve_static_file(avatar)

    def _preprocess_message_content(self, type: str, content: str | list):
        if type == "file":
            if isinstance(content, list) or isinstance(content, tuple):
                for i, file in enumerate(content):
                    if isinstance(file, dict):
                        content[i] = file["path"]

        return content

    def preprocess(self, payload: ChatbotDataMessages | None) -> list:
        if payload is None:
            return []
        messages = []
        for message in payload.root:
            message_dict = message.model_dump()
            message_dict["content"] = self._preprocess_message_content(
                message_dict["type"], message_dict["content"])
            messages.append(message_dict)
        return messages

    def _postprocess_message_content(self, type: str, content: str | list):
        if type == 'file':
            if isinstance(content, list) or isinstance(content, tuple):
                new_content = []
                for i, file in enumerate(content):
                    new_content.append(file)
                    if isinstance(file, str):
                        mime_type = client_utils.get_mimetype(file)
                        if client_utils.is_http_url_like(file):
                            new_content[i] = FileData(
                                path=file,
                                url=file,
                                orig_name=file.split("/")[-1],
                                mime_type=mime_type)
                        else:
                            new_content[i] = FileData(
                                path=file,
                                orig_name=Path(file).name,
                                size=Path(file).stat().st_size,
                                mime_type=mime_type)
                return new_content

        return content

    def _postprocess_message(
            self, message: ChatbotDataMessage | dict) -> ChatbotDataMessage:
        if isinstance(message, dict):
            message = ChatbotDataMessage(**message)
        message.avatar = self._process_avatar(message.avatar)
        message.content = self._postprocess_message_content(
            message.type, message.content)

        return message

    def postprocess(
        self,
        value: ChatbotDataMessages | List[ChatbotDataMessage | dict] | None
    ) -> ChatbotDataMessages:
        data_model = self.data_model
        if value is None:
            return data_model(root=[])
        if isinstance(value, ChatbotDataMessages):
            value = value.root

        processed_messages = [
            self._postprocess_message(message) for message in value
        ]
        return ChatbotDataMessages(root=processed_messages)

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
