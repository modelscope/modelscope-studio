# Chatbot

A chatbot component based on [Ant Design X](https://x.ant.design).

## Examples

### Basic

Supports:

- Two roles: user and assistant.
- Four message types: text, file, tool, and suggestion.

<demo name="basic" position="bottom" collapsible="true"></demo>

### Chatbot Config

Supports configuration options:

- `markdown_config`: Rendering configuration for Markdown text in the Chatbot.
- `welcome_config`: Welcome interface configuration displayed when the Chatbot is empty.
- `bot_config`: Display configuration for bot messages.
- `user_config`: Display configuration for user messages.
  <demo name="chatbot_config"  position="bottom" collapsible="true"></demo>

### Message Config

The `message` object includes all configurations from `bot_config` and `user_config`, allowing users to customize the display of individual messages.

<demo name="message_config"  position="bottom"  collapsible="true"></demo>

### Multimodal

<demo name="multimodal"  position="bottom" collapsible="true"></demo>

### Thinking

<demo name="thinking"  position="bottom" collapsible="true"></demo>

## API

### Props

| Attribute                      | Type                                                              | Default Value | Description                                                                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value                          | `list[dict \| ChatbotDataMessage] \| ChatbotDataMessages \| None` | None          | Default list of messages to show in chatbot, where each message is of the format `ChatbotDataMessage`.                                                                                               |
| welcome_config                 | `ChatbotWelcomeConfig \| dict \| None`                            | None          | Configuration of the welcome interface. If the `value` is empty, the welcome interface will be displayed.                                                                                            |
| markdown_config                | `ChatbotMarkdownConfig \| dict \| None`                           | None          | Markdown configuration for all messages.                                                                                                                                                             |
| user_config                    | `ChatbotUserConfig \| dict \| None`                               | None          | User configuration, will be applied when the message role is 'user'.                                                                                                                                 |
| bot_config                     | `ChatbotBotConfig \| dict \| None`                                | None          | Bot configuration, will be applied when the message role is 'assistant'.                                                                                                                             |
| auto_scroll                    | `bool`                                                            | True          | If `True`, will automatically scroll to the bottom of the textbox when the value changes, unless the user scrolls up. If False, will not scroll to the bottom of the textbox when the value changes. |
| show_scroll_to_bottom_button   | `bool`                                                            | True          | If `True`, the `Scroll To Bottom` button will be shown when the scrollbar is up a certain distance.                                                                                                  |
| scroll_to_bottom_button_offset | `int \| float`                                                    | 200           | The offset from the bottom where the `Scroll To Bottom` button appears.                                                                                                                              |
| height                         | `int \| float \| str`                                             | 400           | The height of the component, specified in pixels if a number is passed, or in CSS units if a string is passed. If messages exceed the height, the component will scroll.                             |
| max_height                     | `int \| float \| str \| None`                                     | None          | The maximum height of the component, specified in pixels if a number is passed, or in CSS units if a string is passed.                                                                               |
| min_height                     | `int \| float \| str \| None`                                     | None          | The minimum height of the component, specified in pixels if a number is passed, or in CSS units if a string is passed.                                                                               |

### Events

| Event                                        | Description                                             |
| -------------------------------------------- | ------------------------------------------------------- |
| `pro.Chatbot.change(fn, ···)`                | Triggered when the Chatbot value changed.               |
| `pro.Chatbot.copy(fn, ···)`                  | Triggered when the copy button is clicked.              |
| `pro.Chatbot.edit(fn, ···)`                  | Triggered when user edit a message.                     |
| `pro.Chatbot.delete(fn, ···)`                | Triggered when user delete a message.                   |
| `pro.Chatbot.like(fn, ···)`                  | Triggered when the like/dislike button is clicked       |
| `pro.Chatbot.retry(fn, ···)`                 | Triggered when the retry button is clicked              |
| `pro.Chatbot.suggestion_select(fn, ···)`     | Triggered when the suggestion message item is selected. |
| `pro.Chatbot.welcome_prompt_select(fn, ···)` | Triggered when the welcome prompt item is selected.     |

### Slots

```python
SLOTS=["roles"]
```

Additionally, if the role style does not meet your expectations, you can also use `ms.Slot("roles")` to customize it, just like the `Bubble` component of `Ant ​​Design X`.

### Types

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
                "left": "$",
                "right": "$",
                "display": False
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
    allow_tags: Optional[Union[List[str], bool]] = False


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
    image_props: Optional[dict] = None


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
