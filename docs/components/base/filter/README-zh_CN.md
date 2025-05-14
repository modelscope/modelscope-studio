# Filter

辅助渲染组件，该组件需要与`Each`组件配合使用，用于过滤`Each`组件中的上下文信息。

该组件的`as_item`参数有所不同，它会将过滤后的上下文信息作为基础继续往下传递，适合在多个模块组件的`Each`组件遍历中使用。

同时，您也可以传入`params_mapping`参数，该参数允许用户通过 Javascript 函数的形式自定义过滤上下文信息。

而如果不传入任何参数，该组件会阻断`Each`组件的上下文传递，让属性的覆盖失效。

## 示例

<demo name="basic"></demo>
<demo name="use_as_item" title="使用 as_item 参数"></demo>
<demo name="use_params_mapping" title="使用 params_mapping 参数"></demo

## API

| 属性           | 类型 | 默认值 | 描述                                                                                         |
| -------------- | ---- | ------ | -------------------------------------------------------------------------------------------- |
| params_mapping | str  | None   | 该值为一个 Javascript 的函数字符串，允许用户通过 Javascript 函数的形式自定义过滤上下文信息。 |
