# load

This feature is similar to [gr.load](https://www.gradio.app/docs/gradio/load). Allow users to Construct a demo from a [ModelScope Studio](https://modelscope.cn/studios) repo.

## How to Use

### Basic Usage

```python
import modelscope_studio as mgr
demo = mgr.load("modelscope/modelscope-studio")
demo.launch()
```

### With Access Token

Use the access token to load a private ModelScope Studio repo. Find your sdk token here: https://modelscope.cn/my/myaccesstoken.

```python
import modelscope_studio as mgr
demo = mgr.load("modelscope/modelscope-studio", token="YOUR_ACCESS_TOKEN")
demo.launch()
```

## Initialization

| Parameter | Type | Default Value | Description                                                                                                                         |
| --------- | ---- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| name      | str  | None          | required. the name of the ModelScope Studio repo (e.g. "modelscope/modelscope-studio").                                             |
| token     | str  | None          | optional access token for loading private ModelScope Studio repo. Find your sdk token here: https://modelscope.cn/my/myaccesstoken. |
