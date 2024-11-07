# Overview

`modelscope_studio` integrates [Ant Design](https://ant.design/) components and supports most component properties. You can use them directly by importing the `antd` module.

```python
import modelscope_studio.components.antd as antd
```

## Quick Start

<demo name="quick_start"></demo>

Note: Both `ms.Application` and `antd.ConfigProvider` are required.

- `Application` contains all component dependencies in `modelscope_studio`. Please ensure that all components exported from `modelscope_studio` are wrapped by it, otherwise the page will not be successfully previewed.
- `ConfigProvider` functions the same as in Ant Design. Additionally, we have added some extra adaptations to be compatible with Gradio's styles. Therefore, to ensure normal page styling, all `antd` components need to be wrapped within this component.

## Property Limitations

Due to Python's type restrictions, the support for some component properties differs.

### Events

In `antd`, all events bound in the form of `onXxx` have been changed to Gradio's event binding form, such as `onClick`, `onChange`, etc. If you want to get event parameters, you also need to bind `gr.EventData`. All event parameters are stored in the form of an array in `e._data["payload"]`.

<demo name="limit_event"></demo>

### ReactNode

In Python, it's not possible to directly pass a component as a parameter, so we provide a slot mechanism. You can use `ms.Slot` to wrap the module that needs to be rendered.

<demo name="limit_react_node"></demo>

**Note:**

- You can view the `SLOTS` property of the component to get all supported slots.
- If you only want to render a string or number, you can still pass it directly as a component property without using `ms.Slot`. The following two ways of writing have the same effect, and it's more recommended to pass it directly as a component property:

  ```python
  antd.Card(title="Card Title")

  with antd.Card():
    ms.Slot("title"):
      ms.Text("Card Title")
  ```

### Regular Functions ((...args) => {})

To support passing JavaScript functions directly in Python, we have changed them to `str` type. Therefore, you only need to pass a regular function string, and it will be automatically compiled into a JavaScript function on the frontend.

<demo name="limit_function"></demo>

We have injected a global event notification object. You can actively send events to the Python side by calling `window.ms_globals.dispatch` in the function, which can be received on the Python side through the `ms.Application.custom` event.

<demo name="limit_function_with_event"></demo>

### Functions Returning ReactNode ((...args) => ReactNode)

When your JavaScript function returns a ReactNode, we provide two handling methods:

1. Treat it as a regular ReactNode value and continue using `ms.Slot` to render the module. Additionally, `ms.Slot` supports passing a `params_mapping` parameter, which also accepts a JavaScript function string. It can map the function's parameters to the context of the current `slot` environment (refer to `ms.Each` for details).

<demo name="limit_react_node_function_by_slot"></demo>

2. Treat it as a regular function and generate ReactNode on the frontend using global variables like `window.ms_globals.React` and `window.ms_globals.antd` (note that JSX cannot be used here, you need to use `React.createElement`).

<demo name="limit_react_node_function_by_function"></demo>

## Integrating Other Gradio Components

Some component slots may only support components from `modelscope_studio`. If you want to support other Gradio components, you need to wrap them with `Fragment`.

<demo name="integrate_other_components"></demo>
