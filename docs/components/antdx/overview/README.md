# Overview

`modelscope_studio` integrates [Ant Design X](https://x.ant.design/) components and supports most component properties. You can use them directly by importing the `antdx` module.

```python
import modelscope_studio.components.antdx as antdx
```

## Quick Start

<demo name="quick_start"></demo>

Note: Both `ms.Application` and `antdx.XProvider`(or `antd.ConfigProvider`) are required.

- `Application` contains all component dependencies in `modelscope_studio`. Please ensure that all components exported from `modelscope_studio` are wrapped by it, otherwise the page will not be successfully previewed.
- `XProvider`(`ConfigProvider`) functions the same as in Ant Design X(Ant Design). Additionally, we have added some extra adaptations to be compatible with Gradio's styles. Therefore, to ensure normal page styling, all `antdx` components need to be wrapped within this component.

## Others

Same as `Antd` components.
