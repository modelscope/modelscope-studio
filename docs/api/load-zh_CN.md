# load

该特性与 [gr.load](https://www.gradio.app/docs/gradio/load) 类似。允许用户从已有创空间 [ModelScope Studio](https://modelscope.cn/studios) 仓库构造 demo。

## 如何使用

### 基本使用

```python
import modelscope_studio.components.legacy as mgr
demo = mgr.load("modelscope/modelscope-studio")
demo.launch()
```

### 使用访问令牌

使用访问令牌来加载私有创空间。在这里找到您的 sdk 令牌：https://modelscope.cn/my/myaccesstoken。

```python
import modelscope_studio.components.legacy as mgr
demo = mgr.load("modelscope/modelscope-studio", token="YOUR_ACCESS_TOKEN")
demo.launch()
```

## 初始化

| 属性  | 类型 | 默认值 | 描述                                                                                                 |
| ----- | ---- | ------ | ---------------------------------------------------------------------------------------------------- |
| name  | str  | None   | 必填。 创空间名称（如: "modelscope/modelscope-studio"）。                                            |
| token | str  | None   | 用于加载私有创空间的可选访问令牌。 在这里找到您的 sdk 令牌：https://modelscope.cn/my/myaccesstoken。 |
