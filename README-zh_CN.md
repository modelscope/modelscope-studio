<h1>ModelScope Studio</h1>

<p align="center">
    <img src="https://modelscope.oss-cn-beijing.aliyuncs.com/modelscope.gif" height="60" style="vertical-align: middle;"/>
    <span style="font-size: 30px; vertical-align: middle;">
    ✖️
    </span>
    <img src="https://www.gradio.app/_app/immutable/assets/gradio.8a5e8876.svg" height="60" style="vertical-align: middle;">
<p>

<p align="center">
<a href="https://github.com/modelscope/modelscope-studio">GitHub</a> | 🤖 <a href="https://modelscope.cn/studios/modelscope/modelscope-studio/summary">ModelScope Studio</a> ｜ 🤗 <a href="https://huggingface.co/spaces/modelscope/modelscope-studio">Hugging Face Space</a>
<br>
    中文&nbsp ｜ &nbsp<a href="README.md">English</a>&nbsp ｜ &nbsp<a href="README-ja_JP.md">日本語</a>
</p>

`modelscope_studio` 是一套基于 gradio 4.x 的扩展组件库，致力于服务于 ModelScope 创空间中对于 gradio 应用的各类扩展需求，目前主要聚集在对话场景增强、多模态场景以及一些其他垂直场景支持。

## 安装

```sh
pip install modelscope_studio
```

## 快速开始

```python
import time
import gradio as gr
import modelscope_studio as mgr

def submit(_input, _chatbot):
    print('text：', _input.text)
    print('files: ', _input.files)
    _chatbot.append([_input, None])
    yield _chatbot
    time.sleep(1)
    _chatbot[-1][1] = [{
        "flushing": False,
        "text": 'bot1: ' + _input.text + '!'
    }, {
        "text": 'bot2: ' + _input.text + '!'
    }]
    yield {
        chatbot: _chatbot,
    }

with gr.Blocks() as demo:
    chatbot = mgr.Chatbot(height=400)

    input = mgr.MultimodalInput()
    input.submit(fn=submit, inputs=[input, chatbot], outputs=[chatbot])

demo.queue().launch()
```

![quickstart](./resources/quickstart.png)

## 组件文档

目前已支持的组件包括：

- Chatbot: gradio Chatbot 扩展组件，支持输出多模态内容、支持多 bot 场景、支持对话内容内的自定义渲染组件及事件交互。
- MultimodalInput: 多模态输入框，支持上传文件、录音、照相等功能。
- Markdown: gradio Markdown 扩展组件，支持输出多模态内容（音频、视频、语音、文件、文本）。
- WaterfallGallery: gradio Gallery 扩展组件，支持瀑布流的图像展示。
- 更多组件...

详细使用参见 [文档与示例](https://modelscope.cn/studios/modelscope/modelscope-studio/summary)

## 开发

将仓库克隆到本地：

```sh
git clone git@github.com:modelscope/modelscope-studio.git
cd modelscope-studio
# for backend
pip install -e '.'
# for frontend
npm install pnpm -g

pnpm install
pnpm build
```

运行 Demo!

```sh
gradio docs/app.py
```

或者像下面这样运行单个 Demo:

```sh
gradio docs/components/Chatbot/demos/basic.py
```
