# Markdown

升级版的 gradio Markdown。

- 支持输出多模态内容（音频、视频、图片、文本）
- 内置标签（chart、select-box、accordion）
- 支持自定义渲染组件，并与 Python 事件交互

## 如何使用

### 基本使用

<demo name="basic"></demo>

### 多模态 & 支持本地文件的展示

<demo name="multimodal"></demo>

### 支持手风琴内容展示

在返回的内容中加入 `accordion` 标签，更多用法详见 <tab-link tab="custom_tags/accordion">accordion</tab-link>

<demo name="accordion"></demo>

### 支持用户选择交互

在返回的内容中加入 `select-box` 标签，更多用法详见 <tab-link tab="custom_tags/select-box">select-box</tab-link>

<demo name="select-box"></demo>

### 支持图表展示

在返回的内容中加入 `chart` 标签，更多用法详见 <tab-link tab="custom_tags/chart">chart</tab-link>

<demo name="chart"></demo>

### 自定义标签（高阶用法，需要了解前端知识）

<demo name="custom-tag"></demo>

#### 引入 js

<demo name="custom-tag2"></demo>

template只能做简单的变量替换，如果想要引入更多自定义的行为，如条件判断、循环渲染等，请使用 js 控制 el 自行处理，下面是简单的示例：

<demo name="custom-tag3">
<demo-suffix>
custom_select.js

```js
<file src="../resources/custom_components/custom_select.js"></file>
```

</demo-suffix>
</demo>

#### 与 Python 侧交互

在 js 中可以使用`cc.dispatch`触发 Python 侧监听的`custom`事件，以前面的custom_select.js为例，我们在前端调用了`cc.dispatch(options[i])`，则会向 Python 侧同时发送通知。

<demo name="custom-tag4"></demo>

## API 及参数列表

以下 API 均为在原有 gradio Markdown 外的额外拓展参数。

### props

| 属性                          | 类型                                                            | 默认值 | 描述                                                                        |
| ----------------------------- | --------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| enable_base64                 | bool                                                            | False  | 是否支持渲染的内容为 base64，因为直接渲染 base64 有安全问题，默认为 False。 |
| enable_latex                  | bool                                                            | True   | 是否支持 Latex 公式渲染                                                     |
| latex_single_dollar_delimiter | bool                                                            | True   | 是否支持单`$`符号在 Latex 公式中渲染                                        |
| preview                       | bool                                                            | True   | 是否开启图片预览功能                                                        |
| custom_components             | dict\[str, CustomComponentDict\] CustomComponentDict 定义见下方 | None   | 支持用户定义自定义标签，并通过 js 控制标签渲染样式与触发 python 事件。      |

**CustomComponent 定义如下**

```python
class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]
```

### 内置的自定义标签

- <tab-link tab="custom_tags/select-box">select-box</tab-link>
- <tab-link tab="custom_tags/accordion">accordion</tab-link>
- <tab-link tab="custom_tags/chart">chart</tab-link>

### event listeners

| 事件                           | 描述                                                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `mgr.Markdown.custom(fn, ···)` | 自定义标签触发事件时触发，EventData 为：<br/> - tag_index：当前触发标签的 index。<br/> - value：自定义传入的值。 |
