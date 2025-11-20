# WebSandbox

A frontend code sandbox component that compiles and previews `React` or `HTML` code in the page.

## Examples

### React Code Preview

When `template` is set to `react`, the following dependencies will be automatically added to the `imports` parameter. When a specific React version is needed, you can override the corresponding keys:

```json
{
  "react": "https://esm.sh/react",
  "react/": "https://esm.sh/react/",
  "react-dom": "https://esm.sh/react-dom",
  "react-dom/": "https://esm.sh/react-dom/"
}
```

<demo name="react"></demo>

### HTML Code Preview

<demo name="html"></demo>

### Custom Sandbox Event

<demo name="custom_sandbox_event"></demo>

### Error Handling

<demo name="error_handling"></demo>

## API

### Props

| Attribute            | Type                                     | Default Value | Description                                                                                                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value                | `Dict[str, Union[str, SandboxFileData]]` | None          | Files collection passed to the Sandbox. When `template` is `react`, `['index.tsx', 'index.jsx', 'index.ts', 'index.js']` are the default entry files. When `template` is `html`, `['index.html']` is the default entry file. You can also manually specify the entry file by setting the `is_entry` property.     |
| template             | `Literal['react', 'html']`               | 'react'       | Template type for Sandbox rendering.                                                                                                                                                                                                                                                                              |
| show_render_error    | `bool`                                   | True          | Whether to show rendering error messages.                                                                                                                                                                                                                                                                         |
| show_compile_error   | `bool`                                   | True          | Whether to show compilation failure styles.                                                                                                                                                                                                                                                                       |
| compile_error_render | `str \| None`                            | None          | Custom compilation failure style, passed as a JavaScript function string.                                                                                                                                                                                                                                         |
| imports              | `Dict[str, str]`                         | None          | Corresponds to the imports field in importmap, see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap), used for adding online frontend dependencies. When `template` is `react`, React-related dependencies are automatically added as shown in the example above. |
| height               | `str \| float \| int`                    | 400           | Height of the component. If a number is passed, it's specified in pixels; if a string is passed, it's specified in CSS units.                                                                                                                                                                                     |

### Events

| Event                                     | Description                                                                                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `pro.WebSandbox.compile_success(fn, ···)` | Triggered when Sandbox compilation succeeds.                                                                               |
| `pro.WebSandbox.compile_error(fn, ···)`   | Triggered when Sandbox compilation fails.                                                                                  |
| `pro.WebSandbox.render_error(fn, ···)`    | Triggered when Sandbox rendering throws an error.                                                                          |
| `pro.WebSandbox.custom(fn, ···)`          | Custom events triggered within the Sandbox are invoked via JavaScript when `window.dispatch` is called within the Sandbox. |

### Slots

```python
SLOTS=['compileErrorRender']
```

### Types

```python
class SandboxFileData(TypedDict):
    code: str
    is_entry: Optional[bool]
```
