# MutilmodalInput 

多模态输入框，支持上传文件、录音、照相等功能。

- 支持文本输入+文件上传共同提交
- 支持文件上传时的图片、音频预览
- 提交内容作为 Chatbot 输入多模态内容作为用户输入问题自动匹配
- 支持用户录音和拍照

## 如何使用

### 基本使用

<demo name="basic"></demo>

### 与 Chatbot 配合使用

<demo name="with_chatbot"></demo>

### 配置上传/提交按钮

<demo name="config_buttons"></demo>

### 允许用户录音或拍照

<demo name="upload_sources"></demo>

## API 及参数列表

以下 API 均为在原有 gradio Textbox 外的额外拓展参数。

### value

接口定义：

```python
class MultimodalInputData(GradioModel):
    files: List[Union[FileData, str]] = []
    text: str
```

### props

| 属性                | 类型                                               | 默认值       | 描述                                                                                                                |
| ------------------- | -------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| sources             | list\[Literal\['upload', 'microphone','webcam'\]\] | \['upload'\] | 上传文件的类型列表。 "upload"会提供上文文件按钮。 "microphone"支持用户录音输入。 "webcam"支持用户照相生成图片或视频 |
| webcam_props        | dict                                               | None         | webcam 组件属性，目前支持传入mirror_webcam(bool)、include_audio(bool)                                               |
| upload_button_props | dict                                               | None         | 上传文件按钮属性，同 gradio UploadButton                                                                            |
| submit_button_props | dict                                               | None         | 提交按钮属性，同 gradio Button                                                                                      |
| file_preview_props  | dict                                               | None         | 文件预览组件属性，目前支持传入 height (int)                                                                         |
