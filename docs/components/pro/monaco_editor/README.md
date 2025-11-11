# MonacoEditor

Code editor, Gradio implementation of [Monaco Editor](https://microsoft.github.io/monaco-editor/), integrated based on [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react).

## Examples

### Basic Usage

<demo name="basic"></demo>

### Diff Editor

<demo name="diff_editor"></demo>

### Monaco Editor Options

You can directly pass in Monaco Editor configuration options [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html).

In this example, we disable the `minimap` and `lineNumbers` of the editor.

<demo name="monaco_editor_options"></demo>

### Customization via JavaScript

If you need further customization of Monaco Editor, you can pass in JavaScript function strings for more advanced configuration.

<demo name="javascript_customize"></demo>

## API

### Props

#### MonacoEditor

| Attribute        | Type                  | Default                | Description                                                                                                                                           |
| ---------------- | --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| value            | `str\| None`          | None                   | The value of the editor.                                                                                                                              |
| language         | `str\| None`          | None                   | The language of the editor (all languages [supported](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) by monaco-editor).    |
| line             | `number\| None`       | None                   | Vertically scroll the editor to the specified line.                                                                                                   |
| read_only        | `bool\| None`         | None                   | Whether the editor is read-only.                                                                                                                      |
| loading          | `str\| None`          | 'Editor is loading...' | The loading text when the editor is initializing.                                                                                                     |
| options          | `dict \| None`        | None                   | [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html) |
| overrideServices | `dict \| None`        | None                   | [IEditorOverrideServices](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorOverrideServices.html)                           |
| height           | `str \| float \| int` | 400                    | The height of the component. If the value is a number, it is specified in pixels. If a string is passed, it is specified in CSS units.                |
| before_mount     | `str \| None`         | None                   | Pass in a JavaScript function string to execute before the editor loads, which can access the `monaco` object.                                        |
| after_mount      | `str \| None`         | None                   | Pass in a JavaScript function string to execute after the editor loads, which can access the `editor` object and `monaco` object.                     |

#### MonacoEditor.DiffEditor

| Property          | Type                  | Default                | Description                                                                                                                                           |
| ----------------- | --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| value             | `str\| None`          | None                   | The modified source (right one) value.                                                                                                                |
| original          | `str\| None`          | None                   | The original source (left one) value.                                                                                                                 |
| language          | `str\| None`          | None                   | The language of the editor (all languages [supported](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) by monaco-editor).    |
| original_language | `str\| None`          | None                   | Specifies the language of the original source separately. Otherwise, it will take the value of the language property.                                 |
| modified_language | `str\| None`          | None                   | Specifies the language of the modified source separately. Otherwise, it will take the value of the language property.                                 |
| line              | `number\| None`       | None                   | Vertically scroll the editor to the specified line.                                                                                                   |
| read_only         | `bool\| None`         | None                   | Whether the editor is read-only.                                                                                                                      |
| loading           | `str\| None`          | 'Editor is loading...' | The loading text when the editor is initializing.                                                                                                     |
| options           | `dict \| None`        | None                   | [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html) |
| overrideServices  | `dict \| None`        | None                   | [IEditorOverrideServices](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorOverrideServices.html)                           |
| height            | `str \| float \| int` | 400                    | The height of the component. If the value is a number, it is specified in pixels. If a string is passed, it is specified in CSS units.                |
| before_mount      | `str \| None`         | None                   | Pass in a JavaScript function string to execute before the editor loads, which can access the `monaco` object.                                        |
| after_mount       | `str \| None`         | None                   | Pass in a JavaScript function string to execute after the editor loads, which can access the `editor` object and `monaco` object.                     |

### Events

| Event                                                             | Description                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `pro.(MonacoEditor \| MonacoEditor.DiffEditor).mount(fn, ···)`    | Triggered when the editor is mounted.                                  |
| `pro.(MonacoEditor \| MonacoEditor.DiffEditor).change(fn, ···)`   | Triggered when the editor value changes.                               |
| `pro.(MonacoEditor \| MonacoEditor.DiffEditor).validate(fn, ···)` | Triggered when the editor triggers validation and error markers exist. |

**Note:** According to [monaco-editor](https://microsoft.github.io/monaco-editor/), only languages with rich IntelliSense will trigger the validate event.

- TypeScript
- JavaScript
- CSS
- LESS
- SCSS
- JSON
- HTML

### Slots

```python
SLOTS=['loading']
```
