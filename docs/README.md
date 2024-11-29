---
tags:
  - gradio-custom-component
  - component library
  - Ant Design
  - modelscope-studio
title: modelscope-studio
colorFrom: blue
colorTo: gray
short_description: A third-party component library based on Gradio.
sdk: gradio
pinned: false
header: mini
app_file: app.py
license: apache-2.0
---

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

`modelscope_studio` is a third-party component library based on Gradio, extending more components and usage forms on top of the original Gradio components.

Currently supported UI libraries:

- [Ant Design](https://ant.design/)

## When to Use

Compared to Gradio's own components, `modelscope_studio` focuses more on page layout and component flexibility. If you want to build a more beautiful user interface, we highly recommend using `modelscope_studio`.

However, when your application needs Gradio to handle more built-in data on the Python side, `modelscope_studio` may not be the best choice, but you can still use `modelscope_studio`'s layout and display components to help build your app.

## Dependencies

- Gradio >= 4.0

## Installation

> Currently, `modelscope_studio` version 1.0 is still under development. You can use the `beta` version in advance.

```sh
pip install modelscope_studio~=1.0.0b
```

## Examples

<demo name="example"></demo>

## Migration to 1.0

If you have used the `modelscope_studio` component before and want to continue using it in the new version, you do not need to make any changes to the original component, just import `ms.Application` in the outer layer.

```python
import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr

with gr.Blocks() as demo:
    with ms.Application():
        mgr.Chatbot()

demo.launch()
```
