# Chatbot

Upgraded gradio Chatbot.

- Supports uniform frontend streaming output of messages
- Supports output of multimodal content (audio, video, voice, files, text)
- Supports multi-agent scenarios
- Supports custom rendering components and interaction with events on the Python side

## How to Use

### Basic Usage

<demo name="basic"></demo>

### Multimodal & Support for Local File Display

<demo name="multimodal"></demo>

### Control for Typewriter Single Sentence Message

<demo name="message_config"></demo>

### Support for Accordion Content Display

Include the `accordion` tag in the returned content to add an accordion within the content. For more usage details, see <tab-link component-tab="Markdown">Markdown Built-in Custom Tags</tab-link>.
Additionally, to adapt to the toolchain usage of large models, some preset configurations for certain large models have been made. Support for the following preset formats (which will be converted into the form wrapped by the above `accordion` tag).

```python
import modelscope_studio as mgr
from modelscope_studio.components.Chatbot.llm_thinking_presets import qwen

# Add qwen preset
mgr.Chatbot(llm_thinking_presets=[qwen()])
```

```text
Action: image_gen
Action Input: {"text": "glorious weather", "resolution": "1024*1024"}
Observation: <result>![IMAGEGEN](https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/a2/20231213/723609ee/1926736d-7c6e-4d2f-b438-b7746b3d89f5-1.png?Expires=1702537773&OSSAccessKeyId=LTAI5tQZd8AEcZX6KZV4G8qL&Signature=H%2B0rIn6BMfE%2BOr1uPb7%2Br9G3%2B5w%3D)</result> Based on your description: glorious weather,I generated a picture.[](https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/a2/20231213/723609ee/1926736d-7c6e-4d2f-b438-b7746b3d89f5-1.png?Expires=1702537773&OSSAccessKeyId=LTAI5tQZd8AEcZX6KZV4G8qL&Signature=H%2B0rIn6BMfE%2BOr1uPb7%2Br9G3%2B5w%3D)

Action: 「An arbitrary text representation that will be displayed as the name of the thought chain call」
Action Input: 「Any json or md content will be displayed in the drop-down box of the calling process」
Observation: <result>「Any md content will be displayed in the drop-down box when the call is completed」</result>
```

<demo name="accordion"></demo>

### Support for User Selection Interaction

Include the `select-box` tag in the returned content for more usage details, see <tab-link component-tab="Markdown">Markdown Built-in Custom Tags <tab-link component-tab="Markdown">.

<demo name="select-box"></demo>

### Multi-bot Scenarios

<demo name="multi_bots"></demo>

### Custom Tags (Advanced Usage, Requires Frontend Knowledge)

See the <tab-link component-tab="Markdown">Markdown component</tab-link> for details.

## API and Parameter List

The following APIs are additional extended parameters beyond the original gradio Chatbot.

### value

Interface definition:

```python

class FileMessage(GradioModel):
    file: FileData
    alt_text: Optional[str] = None


class MultimodalMessage(GradioModel):
    # By default, message index is used as id. it will cause the message to be re-rendered when id changed.
    id: Optional[str] = None
    # elem id of message container
    elem_id: Optional[str] = None
    # elem classes of message container
    elem_classes: Optional[list[str] | str] = None
    name: Optional[str] = None
    text: Optional[str] = None
    flushing: Optional[bool] = None
    avatar: Optional[Union[str, FileData]] = ''
    files: Optional[List[Union[FileMessage, dict, FileData, str]]] = None

# Support multi-bot scenarios
MultimodalMessageItem = Optional[Union[MultimodalMessage, MultimodalInputData,
                                       dict, str]]


class ChatbotData(GradioRootModel):
    root: List[Tuple[Union[MultimodalMessageItem, List[MultimodalMessageItem]],
                     Union[MultimodalMessageItem,
                           List[MultimodalMessageItem]]]]
```

### props

| Attribute                     | Type                                                                             | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| flushing                      | bool                                                                             | True          | Whether to enable the typewriter effect. By default, only the bot's messages will have this effect, but you can control the display effect of each message precisely by modifying the flushing attribute of a message individually.                                                                                                                                                                                                                                                                                      |
| enable_base64                 | bool                                                                             | False         | Whether to support rendering content as base64, since rendering base64 is unsafe, the default is False.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| enable_latex                  | bool                                                                             | True          | Whether to enable LaTeX rendering.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| latex_single_dollar_delimiter | bool                                                                             | True          | Whether to enable single dollar delimiter `$` for LaTeX rendering.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| preview                       | bool                                                                             | True          | Whether to enable image preview functionality.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| avatar_images                 | tuple\[str \| Path \| None \| dict \| list, str \| Path \| None \| dict\| list\] | None          | An extended parameter value for gr.Chatbot, in addition to accepting a URL, it can also accept a dict and list. The dict can include the fields avatar and name, where the name field will be displayed under the avatar when rendered. <br/> - When passing a dict, it must include an avatar field.<br/> - When passing a list, it generally corresponds to the multi-bot mode, where each item can receive all the aforementioned values, and each bot’s avatar matches with the position of the bot in the messages. |
| avatar_image_align            | Literal['top', 'middle', 'bottom']                                               | 'bottom'      | Controls the alignment of the avatar with the messages, default is bottom-aligned.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| avatar_image_width            | int                                                                              | 45            | The width of the avatar and name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| flushing_speed                | int                                                                              | 3             | Typewriter speed, values range from 1 - 10, with larger values indicating faster speeds.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| llm_thinking_presets          | list\[dict\]                                                                     | \[\]          | llm thinking link presets, which can convert the output format of llm calling tools into a fixed front-end display format. It needs to be imported from modelscope_studio.Chatbot.llm_thinking_presets, and currently supports: qwen.                                                                                                                                                                                                                                                                                    |
| custom_components             | dict\[str, CustomComponentDict\] CustomComponentDict is defined below            | None          | Allows users to define custom tags and control tag rendering styles and trigger Python events through JS.                                                                                                                                                                                                                                                                                                                                                                                                                |

**Definition of CustomComponent is as follows:**

```python
class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]
```

### Built-in Custom Tags

See <tab-link component-tab="Markdown">Markdown Built-in Custom Tags</tab-link>

### event listeners

| Event                          | Description                                                                                                                                                                                                                                                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mgr.Chatbot.flushed(fn, ···)` | Triggered when the typewriter effect ends. EventData is: <br/> - index: The index tuple of the current message.<br/> - value: The current message value.                                                                                                                                                                         |
| `mgr.Chatbot.custom(fn, ···)`  | Triggered when a custom tag event occurs. EventData is: <br/> - index: The index tuple of the previous message.<br/> - tag: The current tag that triggered the event.<br/> - tag_index: The index of the current triggered tag, re-calculated based on the index tuple of the message.<br/> - value: The custom value passed in. |
