# Each

辅助渲染组件，该组件支持传入列表作为参数，并会在前端遍历被包裹的组件，将列表的每一项注入当前遍历的上下文中，被包裹的组件属性会在前端被相应的上下文属性替换（只支持从`modelscope_studio`中导出的组件）。

> 注意：在大多数情况下，您不需要使用`Each`组件，如果您需要动态渲染组件，我们更建议您使 Gradio 提供的 [render](https://www.gradio.app/docs/gradio/render) 函数。

## 何时使用

- 当被遍历的组件中全部都是`modelscope_studio`组件或非`modelscope_studio`的组件值不与被遍历的值绑定时；
- 当需要遍历展示的列表长度无法确定时；
- 不想要在 Python 中绑定过多事件监听时；

## 示例

<demo name="basic"></demo>

`modelscope_studio`中的每个组件都有一个`as_item`参数（包括`Each`组件本身），指定该参数值后可以直接基于上下文的值做过滤，逻辑上类似`ctx_value = ctx_value["as_item"]`。该特性通常在需要遍历多个组件时使用，可以有效避免属性冲突。

<demo name="use_as_item" title="使用 as_item 参数"></demo>

如果您需要为所有的列表项的组件都添加某些统一的属性，您还可以传入`context_value`参数，该参数会与列表项的上下文深度合并，共同传递给前端组件。

<demo name="use_context_value" title="使用 context_value 参数"></demo>

## API

### 属性

| 属性          | 类型 | 默认值 | 描述             |
| ------------- | ---- | ------ | ---------------- |
| value         | list | None   | 组件的数据源     |
| context_value | dict | None   | 统一的上下文参数 |
