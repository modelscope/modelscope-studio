# Application

应用的根组件，该组件包含了所有`modelscope_studio`的组件依赖，需要确保所有从`modelscope_studio`导出的组件都被其包裹，否则页面将会无法成功预览。

该组件还可以监听用户页面的生命周期，并获取当前用户的环境信息，您可以

- 获取当前用户的语言、页面主题、user agent 和屏幕状态。
- 监听页面行为并触发相应事件（页面加载、尺寸变化、页面关闭等）。

另外，该组件还提供了`custom`事件，您可以通过在任意 Javascript 函数中调用`window.ms_globals.dispatch`主动向 Python 端发送事件，在 Python 端可以通过`ms.Application.custom`事件接收。

## 示例

<demo name="basic"></demo>

<demo name="language_adaptation" title="自动适配用户语言环境"></demo>

<demo name="theme_adaptation" title="根据用户界面主题返回不同权重内容"></demo>

<demo name="custom_event" title="发送自定义事件"></demo>

## API

### 属性

| 属性  | 类型                | 默认值 | 描述     |
| ----- | ------------------- | ------ | -------- |
| value | ApplicationPageData | None   | 页面数据 |

### 事件

| 事件                              | 描述                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `ms.Application.mount(fn, ···)`   | 当页面加载时触发。                                                           |
| `ms.Application.resize(fn, ···)`  | 当页面尺寸变化时触发。                                                       |
| `ms.Application.unmount(fn, ···)` | 当页面卸载时触发。                                                           |
| `ms.Application.custom(fn, ···)`  | 当用户在 JavaScript 中调用`window.ms_globals.dispatch`抛出自定义事件时触发。 |

### 类型

```python

class ApplicationPageScreenData(GradioModel):
    width: float
    height: float
    scrollX: float
    scrollY: float


class ApplicationPageData(GradioModel):
    screen: ApplicationPageScreenData
    language: str
    theme: str
    userAgent: str
```
