# AutoLoading 自动加载

在`Gradio`前端发送请求时自动为被包裹的内容添加加载动画。该组件会自动收集子组件的加载状态，建议至少在全局使用一次此组件，以显示兜底的加载反馈。

> **注：** 如果有多个嵌套的`AutoLoading`组件，则只有最内层的`AutoLoading`能收集到子组件的加载状态并展示加载动画。

在`Gradio`中，前端到服务端的请求一共有 4 种状态：

- `pending`：此时前端发出的请求还没有收到服务端的响应。
- `generating`：此时前端发出的请求已经收到了响应，但是服务端还没有完成所有内容返回（该状态并不是必定发生的，只有当服务端的处理函数使用`yield`返回值时才会存在）。
- `completed`：服务端返回了所有内容，本次请求结束。
- `error`：本次请求发生错误。

默认情况下，`AutoLoading`组件会：

- 在请求状态为`pending`时添加加载动画。
- 在请求状态为`generating`时结束加载动画，此时用户可以手动控制应用的加载效果，您也可以通过设置`generating=True`来继续展示动画。
- 在请求状态为`completed`时结束加载动画。
- 在请求状态为`error`时结束加载动画，您可以通过设置`show_error=True`来为用户展示错误信息（该信息会在页面居中显示）。

## 示例

<demo name="basic"></demo>

<demo name="nested" title="嵌套的 AutoLoading"></demo>

## API

| 属性         | 类型 | 默认值 | 描述                                                                                     |
| ------------ | ---- | ------ | ---------------------------------------------------------------------------------------- |
| generating   | bool | False  | 是否包含对`generating`状态的处理                                                         |
| show_error   | bool | True   | 是否显示错误信息                                                                         |
| show_mask    | bool | True   | 是否显示遮罩                                                                             |
| show_timer   | bool | True   | 是否显示计时器                                                                           |
| loading_text | str  | None   | 加载中文案，默认不填写使用 `Gradio` 的加载文案显示（包括加载时间、当前用户的排队队列等） |
