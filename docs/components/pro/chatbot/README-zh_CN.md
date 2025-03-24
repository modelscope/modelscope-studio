# Chatbot

基于 [Ant Design X](https://x.ant.design) 封装的对话机器人组件。

## 示例

### 基础使用

支持传入：

- `user`,`assistant`两种 role。
- `text`,`file`,`tool`,`suggestion`四种消息类型。

<demo name="basic" position="bottom" collapsible="true"></demo>

### Chatbot 配置

支持传入配置项：

- `markdown_config`：Chatbot 中 Markdown 文本的渲染配置。
- `welcome_config`：当 Chatbot 中内容为空时显示的欢迎界面配置。
- `bot_config`：Chatbot 中 bot 信息的展示配置。
- `user_config`：Chatbot 中 user 信息的展示配置。

<demo name="chatbot_config"  position="bottom" collapsible="true"></demo>

### Message 配置

`message`对象包含了`bot_config`和`user_config`的所有配置，这意味着用户可以自定义每条消息的显示方式。

<demo name="message_config"  position="bottom"  collapsible="true"></demo>

### 多模态示例

<demo name="multimodal"  position="bottom" collapsible="true"></demo>

### Thinking 示例

<demo name="thinking"  position="bottom" collapsible="true"></demo>

### API

#### 属性

| 属性                           | 类型                                                              | 默认值 | 描述                                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| value                          | `list[dict \| ChatbotDataMessage] \| ChatbotDataMessages \| None` | None   | 聊天机器人中显示的默认消息列表，每条消息的格式为`ChatbotDataMessage`。                                                              |
| welcome_config                 | `ChatbotWelcomeConfig \| dict \| None`                            | None   | 欢迎界面配置。若`value`为空则会显示欢迎界面。                                                                                       |
| markdown_config                | `ChatbotMarkdownConfig \| dict \| None`                           | None   | 所有消息的 Markdown 配置。                                                                                                          |
| user_config                    | `ChatbotUserConfig \| dict \| None`                               | None   | 用户配置，当 message 的 role 为 'user'时生效。                                                                                      |
| bot_config                     | `ChatbotBotConfig \| dict \| None`                                | None   | 机器人配置，当 message 的 role 为 'assistant'时生效。                                                                               |
| auto_scroll                    | `bool`                                                            | True   | 如果为 `True`，则当值改变时将自动滚动到文本框底部，除非用户向上滚动。如果为 `False`，则当值改变时不会滚动到文本框底部。             |
| show_scroll_to_bottom_button   | `bool`                                                            | True   | 如果为 `True`，则会在滚动条向上一定距离时显示滚动到底部按钮。                                                                       |
| scroll_to_bottom_button_offset | `int \| float`                                                    | 200    | 滚动到底部按钮出现时距离底部的偏移量。                                                                                              |
| height                         | `int \| float \| str`                                             | 400    | 组件的高度，如果值为数字，则以像素为单位指定，如果传递的是字符串，则以 CSS 单位指定。如果 messages 超出了组件高度，则组件将可滚动。 |
| max_height                     | `int \| float \| str \| None`                                     | None   | 组件的最大高度，如果传递的是数字，则以像素为单位指定，如果传递的是字符串，则以 CSS 单位指定。                                       |
| min_height                     | `int \| float \| str \| None`                                     | None   | 组件的最小高度，如果传递的是数字，则以像素为单位指定，如果传递的是字符串，则以 CSS 单位指定。                                       |

#### 事件

| 事件                                         | 描述                                 |
| -------------------------------------------- | ------------------------------------ |
| `pro.Chatbot.change(fn, ···)`                | 当 Chatbot 的值发生变化时触发。      |
| `pro.Chatbot.copy(fn, ···)`                  | 当点击复制按钮时触发。               |
| `pro.Chatbot.edit(fn, ···)`                  | 当用户编辑消息时触发。               |
| `pro.Chatbot.delete(fn, ···)`                | 当用户删除消息时触发。               |
| `pro.Chatbot.like(fn, ···)`                  | 当点击喜欢/不喜欢按钮时触发。        |
| `pro.Chatbot.retry(fn, ···)`                 | 当点击重试按钮时触发。               |
| `pro.Chatbot.suggestion_select(fn, ···)`     | 当选择 suggestion 消息的选项时触发。 |
| `pro.Chatbot.welcome_prompt_select(fn, ···)` | 当选择欢迎提示词的选项时触发。       |

### 插槽

```python
SLOTS=["roles"]
```

另外，如果已有的 role 样式不符合预期，也可以和`Ant Design X`的`Bubble`组件一样使用`ms.Slot("roles")`进行自定义。

### 类型

```python
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
    icon: Optional[Union[str, Path]] = None
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
```
