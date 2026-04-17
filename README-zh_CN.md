# ModelScope Studio

<p align="center">
    <img src="https://modelscope.oss-cn-beijing.aliyuncs.com/modelscope.gif" height="60" style="vertical-align: middle;"/>
    <span style="font-size: 30px; vertical-align: middle;">
    ✖️
    </span>
    <img src="https://github.com/gradio-app/gradio/raw/main/readme_files/gradio.svg" height="60" style="vertical-align: middle;">
<p>

<p align="center">
<a href="https://github.com/modelscope/modelscope-studio">GitHub</a> | 🤖 <a href="https://modelscope.cn/studios/modelscope/modelscope-studio">ModelScope Studio</a> ｜ 🤗 <a href="https://huggingface.co/spaces/modelscope/modelscope-studio">Hugging Face Space</a>
<br>
    中文&nbsp ｜ &nbsp<a href="README.md">English</a>&nbsp ｜ &nbsp<a href="README-ja_JP.md">日本語</a>
</p>

`modelscope_studio`是一个基于 Gradio 的三方组件库，为开发者提供更定制化的界面搭建能力和更丰富的组件使用形式。

目前支持的 UI 库：

- [Ant Design](https://ant.design/)
- [Ant Design X](https://x.ant.design/)

![site](./resources/site.png)

## 何时使用

比起 Gradio 自身的组件，`modelscope_studio`更加注重页面布局和组件的灵活性，如果您想要构建更漂亮的用户界面，我们非常推荐您使用`modelscope_studio`。

然而，当您的应用需要 Gradio 在 Python 端更多地处理内置数据时，`modelscope_studio`的组件可能不是最好的选择，但是不用担心，它可以很好地与已有的 Gradio 组件相结合，您仍然可以使用`modelscope_studio`来优化您的应用。

> 如果您正在 Hugging Face Space 中使用`modelscope_studio`，请在`demo.launch()`中添加`ssr_mode=False`参数：`demo.launch(ssr_mode=False)`，否则页面可能无法正常显示。

## 依赖

- Gradio >= 6.0.0

> 注意：您的 Gradio 版本必须`<=6.8.0`，[为什么？](https://github.com/gradio-app/gradio/issues/13131)

## 安装

```sh
pip install modelscope_studio
```

如果您需要使用`4.43.0 <= Gradio < 6.0.0`，请使用 1.x 版本：

```sh
pip install modelscope_studio~=1.0
```

## 快速开始

```python
import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application(), antd.ConfigProvider(), ms.AutoLoading():
        antd.DatePicker()

demo.queue().launch()
```

## 文档与示例

- ModelScope: [中文](https://modelscope.cn/studios/modelscope/modelscope-studio)
- Hugging Face: [English](https://huggingface.co/spaces/modelscope/modelscope-studio)

## Wiki

[链接](./.wiki/zh)

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

运行 `gradio cc dev` 启动 demo：

```sh
gradio cc dev docs/app.py
```
