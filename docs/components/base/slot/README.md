# Application

应用的根组件，该组件包含了所有`modelscope_studio`的组件依赖，需要确保所有从`modelscope_studio`导出的组件都被其包裹，否则页面将会无法成功预览。

除此之外，该组件还可以监听用户页面的生命周期，并获取当前用户的环境信息。

- 获取当前用户的语言、页面主题、user agent 和屏幕状态。
- 监听页面行为并触发相应事件（页面加载、尺寸变化、页面关闭等）。

## Examples

<demo name="basic"></demo>

<demo name="language_adaptation" title="自动适配用户语言环境"></demo>

<demo name="theme_adaptation" title="根据用户界面主题返回不同权重内容"></demo>
