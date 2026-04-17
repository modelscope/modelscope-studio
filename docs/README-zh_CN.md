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

> 如果您正在 Hugging Face Space 中使用`modelscope_studio`，请在`demo.launch()`方法中添加`ssr_mode=False`参数：`demo.launch(ssr_mode=False)`，否则页面可能无法正常显示。

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

## 示例

<demo name="example"></demo>
