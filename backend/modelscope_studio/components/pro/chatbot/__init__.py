from __future__ import annotations

from dataclasses import field
from pathlib import Path
from typing import Callable, List, Literal, Optional, Union

from gradio.data_classes import FileData, GradioModel, GradioRootModel
from gradio.events import EventListener
from gradio_client import utils as client_utils

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# Ant Design X prompt props: https://x.ant.design/components/prompts#promptprops
class ChatbotPromptConfig(GradioModel):
    disabled: Optional[bool] = None
    description: Optional[str] = None
    label: Optional[str] = None
    icon: Optional[str] = None
    key: Optional[str] = None
    children: Optional[List[Union[
        dict,
    ]]] = None


# Ant Design X prompts props: https://x.ant.design/components/prompts
class ChatbotPromptsConfig(GradioModel):
    title: Optional[str] = None
    vertical: Optional[bool] = False
    wrap: Optional[bool] = False
    styles: Optional[dict] = None
    class_names: Optional[dict] = None
    elem_style: Optional[dict] = None
    elem_classes: Optional[Union[str, List[str]]] = None
    items: Optional[List[Union[ChatbotPromptConfig, dict]]] = None


# Ant Design X welcome props: https://x.ant.design/components/welcome
class ChatbotWelcomeConfig(GradioModel):
    variant: Optional[Literal['borderless', 'filled']] = 'borderless'
    icon: Optional[Union[str, Path, dict]] = None
    title: Optional[str] = None
    description: Optional[str] = None
    extra: Optional[str] = None
    elem_style: Optional[dict] = None
    elem_classes: Optional[Union[str, List[str]]] = None
    styles: Optional[dict] = None
    class_names: Optional[dict] = None
    prompts: Optional[Union[ChatbotPromptsConfig, dict]] = None


class ChatbotMarkdownConfig(GradioModel):
    render_markdown: Optional[bool] = True
    latex_delimiters: Optional[list[dict[str, str | bool]]] = field(
        default_factory=lambda: [
            {
                "left": "$$",
                "right": "$$",
                "display": True
            },
            {
                "left": "\\(",
                "right": "\\)",
                "display": False
            },
            {
                "left": "\\begin{equation}",
                "right": "\\end{equation}",
                "display": True
            },
            {
                "left": "\\begin{align}",
                "right": "\\end{align}",
                "display": True
            },
            {
                "left": "\\begin{alignat}",
                "right": "\\end{alignat}",
                "display": True
            },
            {
                "left": "\\begin{gather}",
                "right": "\\end{gather}",
                "display": True
            },
            {
                "left": "\\begin{CD}",
                "right": "\\end{CD}",
                "display": True
            },
            {
                "left": "\\[",
                "right": "\\]",
                "display": True
            },
        ])
    sanitize_html: Optional[bool] = True
    line_breaks: Optional[bool] = True
    rtl: Optional[bool] = False
    allow_tags: Optional[List[str]] = None


class ChatbotActionConfig(GradioModel):
    action: Literal['copy', 'like', 'dislike', 'retry', 'edit', 'delete']
    disabled: Optional[bool] = None
    # Ant Design tooltip: https://ant.design/components/tooltip
    tooltip: Optional[Union[str, dict]] = None
    # Ant Design popconfirm props: https://ant.design/components/popconfirm
    popconfirm: Optional[Union[str, dict]] = None


class ChatbotUserConfig(GradioModel):
    # Action buttons for user message
    actions: Optional[List[Union[Literal[
        'copy',
        'edit',
        'delete',
    ], ChatbotActionConfig, dict]]] = field(default_factory=lambda: [
        "copy"
        # 'edit',
        # ChatbotActionConfig(
        #     action='delete',
        #     popconfirm=dict(title="Delete the message",
        #                     description="Are you sure to delete this message?",
        #                     okButtonProps=dict(danger=True)))
    ])
    disabled_actions: Optional[List[Union[Literal[
        'copy',
        'edit',
        'delete',
    ]]]] = None
    header: Optional[str] = None
    footer: Optional[str] = None
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
    # Action buttons for bot message
    actions: Optional[List[Union[Literal[
        'copy',
        'like',
        'dislike',
        'retry',
        'edit',
        'delete',
    ], ChatbotActionConfig, dict]]] = field(default_factory=lambda: [
        'copy',
        # 'like', 'dislike', 'retry', 'edit',
        # ChatbotActionConfig(
        #     action='delete',
        #     popconfirm=dict(title="Delete the message",
        #                     description="Are you sure to delete this message?",
        #                     okButtonProps=dict(danger=True)))
    ])
    disabled_actions: Optional[List[Union[Literal[
        'copy',
        'like',
        'dislike',
        'retry',
        'edit',
        'delete',
    ]]]] = None
    placement: Optional[Literal['start', 'end']] = 'start'


class ChatbotDataTextContentOptions(ChatbotMarkdownConfig):
    pass


class ChatbotDataToolContentOptions(ChatbotDataTextContentOptions):
    """
    title: tool message title.
    status: tool message status, if status is 'done', the message will be collapsed.
    """
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
class ChatbotDataSuggestionContentOptions(ChatbotPromptsConfig):
    pass


# Ant Design X prompt props: https://x.ant.design/components/prompts#promptprops
class ChatbotDataSuggestionContentItem(ChatbotPromptConfig):
    pass


class ChatbotDataMeta(GradioModel):
    feedback: Optional[Literal['like', 'dislike', None]] = None


class ChatbotDataMessageContent(GradioModel):
    """
    type: Content type, support 'text', 'tool', 'file', 'suggestion'.

    content: Content value.

    options: Content options, each content type has different options.

    copyable: Whether the content can be copied via the 'copy' button.

    editable: Whether the content can be edited via the 'edit' button. Only available for content type 'text' and 'tool'.
    """
    type: Optional[Literal['text', 'tool', 'file', 'suggestion']] = 'text'
    copyable: Optional[bool] = True
    editable: Optional[bool] = True
    content: Optional[Union[str, List[Union[FileData,
                                            ChatbotDataSuggestionContentItem,
                                            dict, str]]]] = None
    options: Optional[Union[dict, ChatbotDataTextContentOptions,
                            ChatbotDataFileContentOptions,
                            ChatbotDataToolContentOptions,
                            ChatbotDataSuggestionContentOptions]] = None


class ChatbotDataMessage(ChatbotBotConfig):
    role: Union[Literal['user', 'assistant', 'system'], str] = None
    key: Optional[Union[str, int, float]] = None
    # If status is 'pending', the message will not render the footer area (including 'actions' and 'footer').
    status: Optional[Literal['pending', 'done']] = None
    content: Optional[Union[str, ChatbotDataMessageContent, dict,
                            List[ChatbotDataMessageContent],
                            List[dict]]] = None
    placement: Optional[Literal['start', 'end']] = None
    actions: Optional[List[Union[Literal[
        'copy',
        'like',
        'dislike',
        'retry',
        'edit',
        'delete',
    ], ChatbotActionConfig, dict]]] = None
    disabled_actions: Optional[List[Union[Literal[
        'copy',
        'like',
        'dislike',
        'retry',
        'edit',
        'delete',
    ]]]] = None
    meta: Optional[Union[ChatbotDataMeta, dict]] = None


class ChatbotDataMessages(GradioRootModel):
    root: List[ChatbotDataMessage]


class ModelScopeProChatbot(ModelScopeDataLayoutComponent):
    """
    """
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("copy",
                      callback=lambda block: block._internal.update(
                          bind_copy_event=True)),
        EventListener("edit",
                      callback=lambda block: block._internal.update(
                          bind_edit_event=True)),
        EventListener("delete",
                      callback=lambda block: block._internal.update(
                          bind_delete_event=True)),
        EventListener("like",
                      callback=lambda block: block._internal.update(
                          bind_like_event=True)),
        EventListener("retry",
                      callback=lambda block: block._internal.update(
                          bind_retry_event=True)),
        EventListener("suggestion_select",
                      callback=lambda block: block._internal.update(
                          bind_suggestionSelect_event=True)),
        EventListener("welcome_prompt_select",
                      callback=lambda block: block._internal.update(
                          bind_welcomePromptSelect_event=True)),
    ]

    # supported slots
    SLOTS = ["roles"]

    def __init__(
            self,
            value: Callable | ChatbotDataMessages
        | list[ChatbotDataMessage | dict] | None = None,
            *,
            height: int | float | str = 400,
            min_height: int | float | str | None = None,
            max_height: int | float | str | None = None,
            roles: str | dict | None = None,
            auto_scroll: bool = True,
            show_scroll_to_bottom_button: bool = True,
            scroll_to_bottom_button_offset: int | float = 200,
            welcome_config: ChatbotWelcomeConfig | dict | None = None,
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
        self.height = height
        self.min_height = min_height
        self.max_height = max_height
        self.roles = roles
        self.auto_scroll = auto_scroll
        self.show_scroll_to_bottom_button = show_scroll_to_bottom_button
        self.scroll_to_bottom_button_offset = scroll_to_bottom_button_offset
        if welcome_config is None:
            welcome_config = ChatbotWelcomeConfig()
        elif isinstance(welcome_config, dict):
            welcome_config = ChatbotWelcomeConfig(**welcome_config)
        if welcome_config.icon:
            welcome_config.icon = self.serve_static_file(welcome_config.icon)
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
        self.welcome_config = welcome_config.model_dump()
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

    def _preprocess_message_content(self, content: str | list | dict):
        if isinstance(content, str):
            return content
        elif isinstance(content, dict):
            type = content.get("type")
            content_value = content.get("content")
            if type == "file":
                if isinstance(content_value, list) or isinstance(
                        content_value, tuple):
                    for i, file in enumerate(content_value):
                        if isinstance(file, dict):
                            content_value[i] = file["path"]
            return content
        elif isinstance(content, list) or isinstance(content, tuple):
            return [self._preprocess_message_content(item) for item in content]

        return content

    def preprocess(self, payload: ChatbotDataMessages | None) -> list:
        if payload is None:
            return []
        messages = []
        for message in payload.root:
            message_dict = message.model_dump()
            message_dict["content"] = self._preprocess_message_content(
                message_dict["content"])
            messages.append(message_dict)
        return messages

    def _postprocess_message_content(self, content: str | list | dict
                                     | ChatbotDataMessageContent):
        if isinstance(content, str):
            return content
        if isinstance(content, dict) or isinstance(content,
                                                   ChatbotDataMessageContent):
            if isinstance(content, dict):
                content = ChatbotDataMessageContent(**content)
            if content.type == "file":
                if isinstance(content.content, list) or isinstance(
                        content.content, tuple):
                    new_content = []
                    for i, file in enumerate(content.content):
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
                    content.content = new_content
            return content
        elif isinstance(content, list) or isinstance(content, tuple):
            return [
                self._postprocess_message_content(item) for item in content
            ]
        return content

    def _postprocess_message(
            self, message: ChatbotDataMessage | dict) -> ChatbotDataMessage:
        if isinstance(message, dict):
            message = ChatbotDataMessage(**message)

        message.avatar = self._process_avatar(message.avatar)
        message.content = self._postprocess_message_content(message.content)

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
