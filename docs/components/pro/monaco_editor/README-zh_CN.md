# MonacoEditor

代码编辑器，[Monaco Editor](https://microsoft.github.io/monaco-editor/) 的 Gradio 实现，基于 [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) 集成。

## 示例

### 基本使用

<demo name="basic"></demo>

### Diff 编辑器

<demo name="diff_editor"></demo>

### Monaco Editor 配置项

可以直接传入 Monaco Editor 的配置项 [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html)。

在这个示例中，我们关闭了编辑器的`minimap`与 `lineNumbers`。

<demo name="monaco_editor_options"></demo>

### 通过 JavaScript 定制化配置

如果你还需要更进一步地操作 Monaco Editor，你可以通过传入 JavaScript 函数字符串来进一步定制化配置。

<demo name="javascript_customize"></demo>

## API 

### 属性

#### MonacoEditor

| 属性             | 类型                  | 默认值                 | 描述                                                                                                                                                  |
| ---------------- | --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| value            | `str\| None`          | None                   | 编辑器的值。                                                                                                                                          |
| language         | `str\| None`          | None                   | 编辑器的语言（monaco-editor [支持](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages)的所有语言）。                            |
| line             | `number\| None`       | None                   | 垂直滚动编辑器到指定行。                                                                                                                              |
| read_only        | `bool\| None`         | None                   | 编辑器是否只读。                                                                                                                                      |
| loading          | `str\| None`          | 'Editor is loading...' | 编辑器初始化加载时的加载文案。                                                                                                                        |
| options          | `dict \| None`        | None                   | [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html) |
| overrideServices | `dict \| None`        | None                   | [IEditorOverrideServices](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorOverrideServices.html)                           |
| height           | `str \| float \| int` | 400                    | 组件的高度，如果值为数字，则以像素为单位指定，如果传递的是字符串，则以 CSS 单位指定。                                                                 |
| before_mount     | `str \| None`         | None                   | 传入 JavaScript 函数字符串，在编辑器加载前执行，可以获取到 `monaco` 对象。                                                                            |
| after_mount      | `str \| None`         | None                   | 传入 JavaScript 函数字符串，在编辑器加载后执行，可以获取到`editor`对象与`monaco` 对象。                                                               |

#### MonacoEditor.DiffEditor

| 属性              | 类型                  | 默认值                 | 描述                                                                                                                                                  |
| ----------------- | --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| value             | `str\| None`          | None                   | 修改后的源的值（右侧）。                                                                                                                              |
| original          | `str\| None`          | None                   | 原始源的值（左侧）。                                                                                                                                  |
| language          | `str\| None`          | None                   | 编辑器的语言（monaco-editor [支持](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages)的所有语言）。                            |
| original_language | `str\| None`          | None                   | 单独指定原始源的语言。否则，它将获取 language 属性的值。                                                                                              |
| modified_Language | `str\| None`          | None                   | 单独指定修改后的源的语言。否则，它将获取 language 属性的值。                                                                                          |
| line              | `number\| None`       | None                   | 垂直滚动编辑器到指定行。                                                                                                                              |
| read_only         | `bool\| None`         | None                   | 编辑器是否只读。                                                                                                                                      |
| loading           | `str\| None`          | 'Editor is loading...' | 编辑器初始化加载时的加载文案。                                                                                                                        |
| options           | `dict \| None`        | None                   | [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html) |
| overrideServices  | `dict \| None`        | None                   | [IEditorOverrideServices](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorOverrideServices.html)                           |
| height            | `str \| float \| int` | 400                    | 组件的高度，如果值为数字，则以像素为单位指定，如果传递的是字符串，则以 CSS 单位指定。                                                                 |
| before_mount      | `str \| None`         | None                   | 传入 JavaScript 函数字符串，在编辑器加载前执行，可以获取到 `monaco` 对象。                                                                            |
| after_mount       | `str \| None`         | None                   | 传入 JavaScript 函数字符串，在编辑器加载后执行，可以获取到`editor`对象与`monaco` 对象。                                                               |

### 事件

| 事件                                                              | 描述                                     |
| ----------------------------------------------------------------- | ---------------------------------------- |
| `pro.(MonacoEditor \| MonacoEditor.DiffEditor).mount(fn, ···)`    | 当编辑器加载完成时触发。                 |
| `pro.(MonacoEditor \| MonacoEditor.DiffEditor).change(fn, ···)`   | 当编辑器值改变时触发。                   |
| `pro.(MonacoEditor \| MonacoEditor.DiffEditor).validate(fn, ···)` | 当编辑器触发校验并且校错误记存在时触发。 |

**注：** 根据 [monaco-editor](https://microsoft.github.io/monaco-editor/)，只有具备丰富智能感知的语言才会触发 validate 事件。

- TypeScript
- JavaScript
- CSS
- LESS
- SCSS
- JSON
- HTML

### 插槽

```python
SLOTS=['loading']
```
