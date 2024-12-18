# ModelScope Studio

<p align="center">
    <img src="https://modelscope.oss-cn-beijing.aliyuncs.com/modelscope.gif" height="60" style="vertical-align: middle;"/>
    <span style="font-size: 30px; vertical-align: middle;">
    ✖️
    </span>
    <img src="https://img.alicdn.com/imgextra/i1/O1CN01OmXst929933KJd7og_!!6000000008024-55-tps-2016-703.svg" height="60" style="vertical-align: middle;">
<p>

<p align="center">
<a href="https://github.com/modelscope/modelscope-studio">GitHub</a> | 🤖 <a href="https://modelscope.cn/studios/modelscope/modelscope-studio">ModelScope Studio</a> ｜ 🤗 <a href="https://huggingface.co/spaces/modelscope/modelscope-studio">Hugging Face Space</a>

`modelscope_studio`是一个基于 Gradio 的三方组件库，为开发者提供更定制化的界面搭建能力和更丰富的组件使用形式。

目前支持的 UI 库：

- [Ant Design](https://ant.design/)

## 何时使用

比起 Gradio 自身的组件，`modelscope_studio`更加注重页面布局和组件的灵活性，如果您想要构建更漂亮的用户界面，我们非常推荐您使用`modelscope_studio`。

然而，当您的应用需要 Gradio 在 Python 端更多地处理内置数据时，`modelscope_studio`的组件可能不是最好的选择，但是不用担心，它可以很好地与已有的 Gradio 组件相结合，您仍然可以使用`modelscope_studio`来优化您的应用。

## 依赖

- Gradio >= 4.0

## 安装

```sh
pip install modelscope_studio
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
