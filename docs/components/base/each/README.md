# Each

A helper rendering component that supports passing a list as a parameter and will traverse the wrapped components on the front end, injecting each item of the list into the current traversal context. The attributes of the wrapped components will be replaced by corresponding context properties on the front end (only supports components exported from `modelscope_studio`).

> Note: In most cases, you do not need to use the `Each` component. If you need to render components dynamically, we recommend using the [render](https://www.gradio.app/docs/gradio/render) function provided by Gradio.

## When to Use

- When all components being traversed are `modelscope_studio` components or non-`modelscope_studio` components whose values do not bind to the traversed values.
- When the length of the list to be traversed is uncertain.

## Examples

<demo name="basic"></demo>

Each component within `modelscope_studio` has an `as_item` parameter (including the `Each` component itself). Specifying this parameter value allows filtering based directly on the context value, similar logically to `ctx_value = ctx_value["as_item"]`. This feature is typically used when multiple components need to be iterated over, effectively avoiding property conflicts.

<demo name="use_as_item" title="Using the as_item Parameter"></demo>

If you need to add certain unified properties to all list item components, you can also pass in the `context_value` parameter. This parameter will be deeply merged with the list item's context and passed together to the front-end component.

<demo name="use_context_value" title="Using the context_value Parameter"></demo>

## API

### Props

| Attribute     | Type | Default Value | Description                   |
| ------------- | ---- | ------------- | ----------------------------- |
| value         | list | None          | Data source for the component |
| context_value | dict | None          | Unified context parameters    |
