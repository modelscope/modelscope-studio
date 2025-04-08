# MultimodalInput

A multimodal input component based on [Ant Design X](https://x.ant.design), supporting file upload, voice recording, and more.

## Examples

### Basic

<demo name="basic"></demo>

### Integration with Chatbot

<demo name="with_chatbot"></demo>

### Configuring Extra Buttons

<demo name="extra_button"></demo>

### Upload Configuration

<demo name="upload_config"></demo>

## API

### Props

| Attribute     | Type                                          | Default Value | Description                                                                                 |
| ------------- | --------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------- |
| value         | `dict \| MultimodalInputValue \| None`        | None          | Default value to display, formatted as `{ "text":"", "files":[] }`.                         |
| loading       | `bool \| None`                                | None          | Whether the input is in a loading state, in which case the `cancel` event can be triggered. |
| read_only     | `bool \| None`                                | None          | Whether the input is read-only.                                                             |
| submit_type   | `Literal['enter', 'shiftEnter'] \| None`      | 'enter'       | How the input box triggers the `submit` event.                                              |
| placeholder   | `str \| None`                                 | None          | Input placeholder text.                                                                     |
| upload_config | `MultimodalInputUploadConfig \| dict \| None` | None          | File upload configuration.                                                                  |

### Slots

```python
SLOTS = ["prefix"]
```

### Types

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
