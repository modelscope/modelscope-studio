# Chatbot

升级版的 gradio Chatbot。

- 支持前端匀速流式输出 message
- 支持输出多模态内容（音频、视频、语音、文件、文本）
- 支持多 agent 场景
- 支持自定义渲染组件，并与 Python 侧事件交互

## 如何使用

### 基本使用

<demo name="basic"></demo>

### 多模态 & 支持本地文件的展示

<demo name="multimodal"></demo>

### 控制打字机单句 message 开关

<demo name="message_config"></demo>

### 支持手风琴内容展示

在返回的内容中加入 `accordion` 标签，可以在内容中加入手风琴，更多用法详见 <tab-link component-tab="Markdown">Markdown 内置自定义标签</tab-link>

同时为了适配大模型的工具调用链路，额外对某些大模型的格式做了预设配置，支持下述格式的预设处理（会将下面的格式转换成上方`accordion`标签包裹形式）

```python
import modelscope_studio as mgr
from modelscope_studio.components.Chatbot.llm_thinking_presets import qwen

# 添加 qwen 解析预设
mgr.Chatbot(llm_thinking_presets=[qwen()])
```

```text
Action: image_gen
Action Input: {"text": "glorious weather", "resolution": "1024*1024"}
Observation: <result>![IMAGEGEN](https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/a2/20231213/723609ee/1926736d-7c6e-4d2f-b438-b7746b3d89f5-1.png?Expires=1702537773&OSSAccessKeyId=LTAI5tQZd8AEcZX6KZV4G8qL&Signature=H%2B0rIn6BMfE%2BOr1uPb7%2Br9G3%2B5w%3D)</result> 根据您的描述"glorious weather"，我生成了一张图片。![](https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/a2/20231213/723609ee/1926736d-7c6e-4d2f-b438-b7746b3d89f5-1.png?Expires=1702537773&OSSAccessKeyId=LTAI5tQZd8AEcZX6KZV4G8qL&Signature=H%2B0rIn6BMfE%2BOr1uPb7%2Br9G3%2B5w%3D)

Action: 「任意文本表示，将展示为思考链调用的名称」
Action Input: 「任意json or md 内容，将展示到调用过程的下拉框」
Observation: <result>「任意 md 内容，将作为完成调用的展示的下拉框内」</result>
```

<demo name="accordion"></demo>

### 支持用户选择交互

在返回的内容中加入 `select-box` 标签，更多用法详见 <tab-link component-tab="Markdown">Markdown 内置自定义标签</tab-link>

<demo name="select-box"></demo>

### 支持图表展示

在返回的内容中加入 `chart` 标签，更多用法详见 <tab-link component-tab="Markdown">Markdown 内置自定义标签</tab-link>

<demo name="chart"></demo>

### 多 bot 场景

<demo name="multi_bots"></demo>

### 自定义标签（高阶用法，需要了解前端知识）

详见 <tab-link component-tab="Markdown">Markdown</tab-link> 组件

## API 及参数列表

以下 API 均为在原有 gradio Chatbot 外的额外拓展参数。

### value

接口定义：

```python

class FileMessage(GradioModel):
    file: FileData
    alt_text: Optional[str] = None


class MultimodalMessage(GradioModel):
    # 默认以 index 为作为 id，id 改变会导致 message 重新渲染
    id: Optional[str] = None
    # message 容器的 elem id
    elem_id: Optional[str] = None
    # message 容器的 elem classes
    elem_classes: Optional[list[str] | str] = None
    name: Optional[str] = None
    text: Optional[str] = None
    flushing: Optional[bool] = None
    avatar: Optional[Union[str, FileData]] = ''
    files: Optional[List[Union[FileMessage, dict, FileData, str]]] = None

# 支持多 bot 场景
MultimodalMessageItem = Optional[Union[MultimodalMessage, MultimodalInputData,
                                       dict, str]]


class ChatbotData(GradioRootModel):
    root: List[Tuple[Union[MultimodalMessageItem, List[MultimodalMessageItem]],
                     Union[MultimodalMessageItem,
                           List[MultimodalMessageItem]]]]
```

### props

| 属性                          | 类型                                                                             | 默认值   | 描述                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| flushing                      | bool                                                                             | True     | 是否开启打字机效果。默认只有 bot 的 message 会开启，可以通过单独修改 message 的 flushing 属性精确控制每一条 message 的显示效果                                                                                                                                                                           |
| enable_base64                 | bool                                                                             | False    | 是否支持渲染的内容为 base64，因为直接渲染 base64 会带来安全问题，默认为 False。                                                                                                                                                                                                                          |
| enable_latex                  | bool                                                                             | True     | 是否支持 Latex 公式渲染                                                                                                                                                                                                                                                                                  |
| latex_single_dollar_delimiter | bool                                                                             | True     | 是否支持单`$`符号在 Latex 公式中渲染                                                                                                                                                                                                                                                                     |
| preview                       | bool                                                                             | True     | 是否开启图片预览功能                                                                                                                                                                                                                                                                                     |
| avatar_images                 | tuple\[str \| Path \| None \| dict \| list, str \| Path \| None \| dict\| list\] | None     | 拓展gr.Chatbot的参数值，除了接收 url 外还可以接收 dict 和 list，dict 可以传入avatar和name字段，name字段在渲染时会显示在头像下方。 <br/> - 当传入 dict 时，必须包含有avatar字段。<br/> - 当传入 list 时，一般对应多 bot 模式，每一项可以接收前面所有的值，每个 bot 的头像与 message 中 bot 的位置一一对应 |
| avatar_image_align            | Literal['top', 'middle', 'bottom']                                               | 'bottom' | 控制头像与 message 的对齐方式，默认为下对齐                                                                                                                                                                                                                                                              |
| avatar_image_width            | int                                                                              | 45       | 头像与名称的宽度                                                                                                                                                                                                                                                                                         |
| flushing_speed                | int                                                                              | 3        | 打字机速度，值为 1 - 10，值越大速度越快                                                                                                                                                                                                                                                                  |
| llm_thinking_presets          | list\[dict\]                                                                     | \[\]     | llm 思考链路解析预设，可以将 llm 调用工具的输出格式转为固定的前端展示格式，需要从modelscope_studio.Chatbot.llm_thinking_presets引入，目前支持：qwen                                                                                                                                                      |
| custom_components             | dict\[str, CustomComponentDict\] CustomComponentDict 定义见下方                  | None     | 支持用户定义自定义标签，并通过 js 控制标签渲染样式与触发 python 事件。                                                                                                                                                                                                                                   |

**CustomComponent 定义如下**

```python
class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]
```

### 内置的自定义标签

见 <tab-link component-tab="Markdown">Markdown 内置自定义标签</tab-link>

### event listeners

| 事件                           | 描述                                                                                                                                                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mgr.Chatbot.flushed(fn, ···)` | 当打字机效果结束时触发。EventData 为：<br/> - index：当前 message 的 index tuple。<br/> - value：当前 message value。                                                                                                                                                                                                           |
| `mgr.Chatbot.custom(fn, ···)`  | 自定义标签触发事件时触发，EventData 为：<br/> - index：当前 message 的 index tuple ([message index, user group(index 0) or bot group(index 1), user/bot group index])。<br/> - tag：当前触发的标签。<br/> - tag_index：当前触发标签的 index，此 index 在 message 的 index tuple 基础上重新计算。<br/> - value：自定义传入的值。 |
