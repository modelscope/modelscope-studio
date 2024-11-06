# 概览

`modelscope_studio`集成了 [Ant Design](https://ant.design/components/icon/) 的组件，并支持大部分的组件属性，您只需要引入`antd`模块即可直接使用。

```python
import modelscope_studio.components.antd as antd
```

## 快速开始

<demo name="quick_start"></demo>

注意：其中`ms.Application`与`antd.ConfigProvider`是必须的。

- `Application` 包含了`modelscope_studio`中所有的组件依赖，请确保`modelscope_studio`所有导出的组件都被其包裹，否则页面将会无法成功预览。
- `ConfigProvider` 与 Ant Design 中的功能一致，除此之外，我们还加了一些额外的适配来兼容 Gradio 的样式。因此，为了保证页面样式正常，所有的`antd`组件需要包裹在该组件下。

## 属性限制

由于 Python 的类型限制，一些组件属性的支持形式有所不同。

### 事件

在`antd`中，所有以`onXxx`形式绑定的事件，均改为了`gradio`的事件绑定形式，如`onClick`、`onChange`等。如果您想要获取事件参数，也需要绑定`gr.EventData`，所有的事件参数都通过数组的形式保存在`e._data["payload"]`中。

<demo name="limit_event"></demo>

### ReactNode

在 Python 中无法直接将某个组件作为参数，因此我们提供了插槽机制，您可以使用`ms.Slot`来包裹需要被渲染的模块。

<demo name="limit_react_node"></demo>

**注：**

- 您可以通过查看组件的`SLOTS`属性获取所有支持的插槽。
- 如果您只想渲染一段字符串或数字，您依然可以直接将其作为组件的属性传入，无需使用`ms.Slot`。下面两种写法效果是一样的，并且更推荐直接作为组件属性传入：

  ```python
  antd.Card(title="Card Title")

  with antd.Card():
    ms.Slot("title"):
      ms.Text("Card Title")
  ```

### 普通函数（(...args) => {}）

为了支持在 Python 直接传入 Javascript 函数，我们将其改为了`str`类型。因此，您只需要传递普通的函数字符串即可，它会在前端被自动编译为 Javascript 函数。

<demo name="limit_function"></demo>

我们在全局注入了事件通知对象，您可以通过在函数中调用`window.ms_globals.dispatch`来主动向 Python 端发送事件，在 Python 端可以通过`ms.Application.custom`事件接收。

<demo name="limit_function_with_event"></demo>

### 返回 ReactNode 的函数 ((...args) => ReactNode)

当您的 Javascript 函数返回值为 ReactNode 时，我们提供了两种处理方式：

- 将它当做普通的 ReactNode 值，继续使用`ms.Slot`来渲染模块。
- 将其当做普通函数，通过`window.ms_globals.React`与`window.ms_globals.antd`等全局变量在前端生成 ReactNode（注意此时不能使用 jsx，需要使用 `React.createElement`）。

## 集成其他 Gradio 组件

某些组件的插槽可能只支持`modelscope_studio`中的组件，如果您想要支持其他的 Gradio 组件，您需要使用`Fragment`来将其包裹。

<demo name="integrate_other_components"></demo>
