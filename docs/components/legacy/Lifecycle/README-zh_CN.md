# Lifecycle

生命周期组件，用于获取当前用户的环境信息。

- 获取当前用户的语言、页面主题、user agent 和屏幕状态。
- 监听页面行为并触发相应事件（页面加载、尺寸变化、页面关闭等）。

## 如何使用

### 基本使用

<demo name="basic"></demo>

### 自动适配用户语言环境

<demo name="language_adaptation"></demo>

### 根据用户界面主题返回不同权重内容

<demo name="theme_adaptation"></demo>

## API 及参数列表

### value

接口定义：

```python
class LifecycleScreenData(GradioModel):
    width: float
    height: float
    scrollX: float
    scrollY: float


class LifecycleData(GradioModel):
    screen: LifecycleScreenData
    language: str
    theme: str
    userAgent: str
```

### props

该组件不支持传入 props。

### event listeners

| 事件                             | 描述                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| `mgr.Lifecycle.mount(fn, ···)`   | 用户页面加载时触发，EventData 为当前组件 value 的 dict 类型值。       |
| `mgr.Lifecycle.unmount(fn, ···)` | 用户页面关闭时触发，EventData 为当前组件 value 的 dict 类型值。       |
| `mgr.Lifecycle.resize(fn, ···)`  | 自定义标签触发事件时触发，EventData 为当前组件 value 的 dict 类型值。 |
