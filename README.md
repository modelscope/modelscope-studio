> The current document version is `1.0 beta`. If you are using a previous version of `modelscope_studio`, please switch to the [legacy](https://github.com/modelscope/modelscope-studio/tree/legacy) branch for reference.

# ModelScope Studio

<p align="center">
    <img src="https://modelscope.oss-cn-beijing.aliyuncs.com/modelscope.gif" height="60" style="vertical-align: middle;"/>
    <span style="font-size: 30px; vertical-align: middle;">
    ✖️
    </span>
    <img src="https://github.com/gradio-app/gradio/raw/main/readme_files/gradio.svg" height="60" style="vertical-align: middle;">
<p>

<p align="center">
<a href="https://github.com/modelscope/modelscope-studio">GitHub</a> | 🤖 <a href="https://modelscope.cn/studios/modelscope/modelscope-studio-beta">ModelScope Studio</a> ｜ 🤗 <a href="https://huggingface.co/spaces/modelscope/modelscope-studio-beta">Hugging Face Space</a>
<br>
    <a href="README-zh_CN.md">中文</a>&nbsp ｜ &nbspEnglish&nbsp ｜ &nbsp<a href="README-ja_JP.md">日本語</a>
</p>

`modelscope_studio` is a third-party component library based on Gradio, extending more components and usage forms on top of the original Gradio components.

Currently supported UI libraries:

- [Ant Design](https://ant.design/)

## When to Use

Compared to Gradio's own components, `modelscope_studio` focuses more on page layout and component flexibility. If you want to build a more beautiful user interface, we highly recommend using `modelscope_studio`. However, when your application needs Gradio to handle more built-in data on the Python side, `modelscope_studio` may not be the best choice, but you can still use `modelscope_studio`'s layout and display components to help you build pages.

## Dependencies

- Gradio >= 4.0

## Installation

> Currently, `modelscope_studio` version 1.0 is still under development. You can use the `beta` version in advance.

```sh
pip install modelscope_studio~=1.0.0b
```

## Quick Start

```python
import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.DatePicker()

demo.queue().launch()
```

## Documentation and Examples

- ModelScope: [中文](https://modelscope.cn/studios/modelscope/modelscope-studio-beta)
- Hugging Face: [English](<(https://huggingface.co/spaces/modelscope/modelscope-studio-beta)>)

## Migration to 1.0

If you have previously used `modelscope_studio` components and want to continue using them in the new version, no modifications to the original components are needed. You just need to introduce `ms.Application` in the outer layer.

```python
import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr

with gr.Blocks() as demo:
    with ms.Application():
        mgr.Chatbot()

demo.launch()
```

## Development

Clone this repo locally:

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

Run `gradio cc dev` to start demo:

```sh
gradio cc dev docs/app.py
```
