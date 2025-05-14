# WebSandbox

前端代码沙箱组件，能够将`React`或`HTML`类型的前端代码在页面编译并预览。

## 示例

### 预览 React 代码

当`template`为`react`时，会自动在`imports`参数中添加以下依赖，当需要特定的某个 React 版本时，可以通过覆盖对应的 key 进行修改：

```json
{
  "react": "https://esm.sh/react",
  "react/": "https://esm.sh/react/",
  "react-dom": "https://esm.sh/react-dom",
  "react-dom/": "https://esm.sh/react-dom/"
}
```

<demo name="react"></demo>

### 预览 HTML 代码

<demo name="html"></demo>

### 处理错误

<demo name="error_handling"></demo>

## API 

### 属性

| 属性                 | 类型                                     | 默认值  | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value                | `Dict[str, Union[str, SandboxFileData]]` | None    | 传入 Sandbox 的文件集合。当`template`为`react`时，`['index.tsx', 'index.jsx', 'index.ts', 'index.js']` 为默认的入口文件，当`template`为`html`时，`['index.html']` 为默认的入口文件。你也可以通过对象的形式填写`is_entry`属性手动指定入口文件。                                                                                                                                                                                                             |
| template             | `Literal['react', 'html']`               | 'react' | Sandbox 渲染的模板类型。                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| show_render_error    | `bool`                                   | True    | 是否抛出渲染错误提示。                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| show_compile_error   | `bool`                                   | True    | 是否展示编译失败样式。                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| compile_error_render | `str \| None`                            | None    | 自定义编译失败样式，传入类型为 Javascript 的函数字符串。                                                                                                                                                                                                                                                                                                                                                                                                   |
| imports              | `Dict[str, str]`                         | None    | 对应 importmap 中的 imports 字段，见 [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap)，可用于添加在线的前端依赖模块。 `template` 为 `react` 时会自动添加以下依赖，当需要特定的某个 React 版本时，可以通过覆盖对应的 key 进行修改： `{   "react": "https://esm.sh/react",   "react/": "https://esm.sh/react/",   "react-dom": "https://esm.sh/react-dom",   "react-dom/": "https://esm.sh/react-dom/" }`。 |
| height               | `str \| float \| int`                    | 400     | 组件的高度，如果值为数字，则以像素为单位指定，如果传递的是字符串，则以 CSS 单位指定。                                                                                                                                                                                                                                                                                                                                                                      |

### 事件

| 事件                                      | 描述                        |
| ----------------------------------------- | --------------------------- |
| `pro.WebSandbox.compile_success(fn, ···)` | 当 Sandbox 编译成功时触发。 |
| `pro.WebSandbox.compile_error(fn, ···)`   | 当 Sandbox 编译失败时触发。 |
| `pro.WebSandbox.render_error(fn, ···)`    | 当 Sandbox 渲染抛错时触发。 |

### 插槽

```python
SLOTS=['compileErrorRender']
```

### 类型

```python
class SandboxFileData(TypedDict):
    code: str
    is_entry: Optional[bool]
```
