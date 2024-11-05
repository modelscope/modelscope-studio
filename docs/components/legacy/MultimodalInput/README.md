# MutilmodalInput

A multimodal input field that supports uploading files, recording audio, taking photos, etc.

- Supports text input and file upload for joint submission
- Supports image and audio previews during file upload
- Submissions serve as Chatbot input, matching multimodal content as user input questions automatically
- Supports user recording and photography

## How to Use

### Basic Usage

<demo name="basic"></demo>

### Using with Chatbot

<demo name="with_chatbot"></demo>

### Configuring Upload/Submit Buttons

<demo name="config_buttons"></demo>

### Allowing User Recording or Photography

<demo name="upload_sources"></demo>

## API and Parameter List

The following APIs are additional expanded parameters beyond the original gradio Textbox.

### value

Interface definition:

```python
class MultimodalInputData(GradioModel):
    files: List[Union[FileData, str]] = []
    text: str
```

### props

| Attribute           | Type                                            | Default Value | Description                                                                                                                                                                            |
| ------------------- | ----------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sources             | List[Literal['upload', 'microphone', 'webcam']] | ['upload']    | A list of types for uploading files. "upload" provides an upload file button. "microphone" supports user audio input. "webcam" supports user photography to generate images or videos. |
| webcam_props        | dict                                            | None          | webcam component properties, currently supports passing mirror_webcam(bool), include_audio(bool)                                                                                       |
| upload_button_props | dict                                            | None          | Upload file button properties, same as gradio UploadButton                                                                                                                             |
| submit_button_props | dict                                            | None          | Submit button properties, same as gradio Button                                                                                                                                        |
| file_preview_props  | dict                                            | None          | File preview component properties, currently supports passing height (int)                                                                                                             |
