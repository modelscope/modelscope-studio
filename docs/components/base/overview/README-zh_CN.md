# ModelScope Studio

<p align="center">
    <img src="https://modelscope.oss-cn-beijing.aliyuncs.com/modelscope.gif" height="60" style="vertical-align: middle;"/>
    <span style="font-size: 30px; vertical-align: middle;">
    ✖️
    </span>
    <img src="https://github.com/gradio-app/gradio/raw/main/readme_files/gradio.svg" height="60" style="vertical-align: middle;">
<p>

<p align="center">
<a href="https://github.com/modelscope/modelscope-studio">GitHub</a> | 🤖 <a href="https://modelscope.cn/studios/modelscope/modelscope-studio/summary">ModelScope Studio</a> ｜ 🤗 <a href="https://huggingface.co/spaces/modelscope/modelscope-studio">Hugging Face Space</a>

`modelscope_studio`是一个基于 Gradio 的三方组件库，在原有 Gradio 组件的基础上延伸了更多的组件和使用形式。

目前支持的 UI 库：

- [Ant Design](https://ant.design/)

## 何时使用

比起 Gradio 自身的组件，`modelscope_studio`更加注重页面布局和组件的灵活性，如果您想要构建更漂亮的用户界面，我们非常推荐您使用`modelscope_studio`。然而，当您的应用需要 Gradio 在 Python 端更多地处理内置数据时，`modelscope_studio`可能不是最好的选择，但仍然可以使用`modelscope_studio`的布局和展示组件来帮助您构建页面。

## 依赖

- Gradio >= 4.0

## 安装

> 目前`modelscope_studio` 1.0 版本仍在开发中，您可以通过安装`beta`版本提前使用。

```sh
pip install modelscope_studio~=1.0.0b
```

## 示例

<demo name="example"></demo>

## 迁移到 1.0

如果您在之前使用了`modelscope_studio`的组件，并且想要在新版本中继续使用。不需要对原有组件做任何修改，只需要在外层引入`ms.Application`即可。

```python
import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr

with gr.Blocks() as demo:
    with ms.Application():
        mgr.Chatbot()

demo.launch()
```
