# MutilmodalInput 

基于 [Ant Design X](https://x.ant.design) 封装的多模态输入框组件，支持文件上传、录音等功能。

## 示例

### 基本使用

<demo name="basic"></demo>

### 与 Chatbot 配合使用

<demo name="with_chatbot"></demo>

### 配置额外按钮

<demo name="extra_button"></demo>

### Block 模式

<demo name="block_mode"></demo>

### 上传配置

<demo name="upload_config"></demo>

## API 

### 属性

| 属性          | 类型                                                     | 默认值           | 描述                                                                            |
| ------------- | -------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------- |
| value         | `dict \| MultimodalInputValue \| None`                   | None             | 显示的默认值，格式为`{ "text":"", "files":[] }`。                               |
| loading       | `bool \| None`                                           | None             | 输入框是否处处于加载状态，此时可以触发 `cancel` 事件。                          |
| mode          | `inline \| block`                                        | 'inline'         | 输入框的渲染模式， 值为 `block` 时会将输入框与提交按钮分开渲染。                |
| auto_size     | `bool \| { minRows?: number; maxRows?: number } \| None` | { "maxRows": 8 } | 自适应内容高度，可设置为 True \| False 或对象：{ "minRows": 2, "maxRows": 6 }。 |
| read_only     | `bool \| None`                                           | None             | 输入框是否为只读状态。                                                          |
| submit_type   | `Literal['enter', 'shiftEnter'] \| None`                 | 'enter'          | 输入框触发`submit`事件的方式。                                                  |
| placeholder   | `str \| None`                                            | None             | 输入框的提示信息。                                                              |
| disabled      | `bool \| None`                                           | None             | 是否禁用。                                                                      |
| upload_config | `MultimodalInputUploadConfig \| dict \| None`            | None             | 文件上传配置。                                                                  |

### 插槽

```python
SLOTS=['actions', "prefix", 'footer', 'header']
```

### 类型

```python
class MultimodalInputUploadConfig(GradioModel):
    """
    fullscreen_drop: Whether to allow fullscreen drop files to the attachments.

    allow_upload: Whether to allow upload files to the attachments.

    allow_paste_file: Whether to allow paste file to the attachments.

    allow_speech: Whether to allow speech input.

    show_count: Whether to show the count of files when the attachments panel is close.

    upload_button_tooltip: Tooltip of the upload button.

    accept: File types that can be accepted. See [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept).

    max_count: Limit the number of uploaded files. Will replace current one when maxCount is 1.

    directory: Support upload whole directory.

    disabled: Disable upload files.

    multiple: Whether to support selected multiple files. IE10+ supported. You can select multiple files with CTRL holding down while multiple is set to be True.

    overflow: Behavior when the file list overflows.

    title: Title of the attachments panel.

    image_props: Image config, same as [Image](https://ant.design/components/image)

    placeholder: Placeholder information when there is no file.
    """
    fullscreen_drop: Optional[bool] = False
    allow_upload: Optional[bool] = True
    allow_paste_file: Optional[bool] = True
    allow_speech: Optional[bool] = False
    show_count: Optional[bool] = True
    upload_button_tooltip: Optional[str] = None
    accept: Optional[str] = None
    max_count: Optional[int] = None
    directory: Optional[bool] = False
    multiple: Optional[bool] = False
    disabled: Optional[bool] = False
    overflow: Literal['wrap', 'scrollX', 'scrollY'] | None = None
    title: Optional[str] = "Attachments"
    image_props: Optional[dict] = None
    placeholder: Optional[dict] = field(
        default_factory=lambda: {
            "inline": {
                "title": "Upload files",
                "description": "Click or drag files to this area to upload"
            },
            "drop": {
                "title": "Drop files here",
            }
        })


class MultimodalInputValue(GradioModel):
    files: Optional[ListFiles] = None
    text: Optional[str] = None

```
