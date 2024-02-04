# select-box

在 markdown 文本中添加选择交互框。

## 如何使用

### 基本使用

<demo name="custom_tags/select-box/basic"></demo>

### Card 样式

<demo name="custom_tags/select-box/card_shape"></demo>

### Card 自适应内部元素宽度

<demo name="custom_tags/select-box/card_shape_width_auto"></demo>

### 监听 Python 事件

<demo name="custom_tags/select-box/python_events"></demo>

## API 及参数列表

### value

custom 事件中 custom_data value 对应值， 返回值为用户 options 传入的对应 value ，如果type="checkbox"，则返回一个 list。

### props

| 属性         | 类型                                                                                        | 默认值                          | 描述                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type         | 'checkbox' \| 'radio'                                                                       | 'radio'                         | 选择框类型，'radio' 为单选框、'checkbox'为多选框。                                                                                                                                                                                                                                                                                                                                    |
| disabled     | boolean                                                                                     |                                 | 禁用选择，通常在需要读取历史信息二次渲染时会用到。                                                                                                                                                                                                                                                                                                                                    |
| value        | string                                                                                      |                                 | 默认选中值，通常适用于`type="checkbox"`时提前为用户选择部分选项和设置`disabled`后的默认值渲染。                                                                                                                                                                                                                                                                                       |
| direction    |  'horizontal' \| 'vertical'                                                                 | 'horizontal'                    | 横向或竖向排列选择框                                                                                                                                                                                                                                                                                                                                                                  |
| shape        | 'card' \| 'default'                                                                         | 'default'                       | 选择框样式                                                                                                                                                                                                                                                                                                                                                                            |
| options      | (string\| { label?: string, value?: string, imgSrc?: string})\[\]                           |                                 | 为用户提供的选项值，每一项可以为 string 或 object。 当值为 object 时可以接收更多自定义值，其中imgSrc只有当shape="card"时才生效。                                                                                                                                                                                                                                                      |
| select-once  | boolean                                                                                     | false                           | 是否只允许用户选择一次                                                                                                                                                                                                                                                                                                                                                                |
| submit-text  | string                                                                                      |                                 | 提交按钮的展示值，当该属性有值时，会展示提交按钮，此时用户只有点击提交按钮后才会触发选择事件。                                                                                                                                                                                                                                                                                        |
| columns      | number \| { xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number } | { xs: 1, sm:  2, md: 2, lg:  4} | 当shape="card"时才生效。每一行选项占用列数，值的范围为1 - 24，建议此项取值可以被 24 整除，否则可能列数会不符合预期。 当此项传入值为对象时，可以响应式控制每一行渲染列数，响应阈值如下：<br/> - xs：屏幕 < 576px <br/> - sm：屏幕 ≥ 576px <br/> - md：屏幕 ≥ 768px <br/> - lg：屏幕 ≥ 992px <br/> - xl：屏幕 ≥ 1200px <br/> - xxl：屏幕 ≥ 1600px 当direction为vertical时此配置不生效。 |
| item-width   | string                                                                                      |                                 | 当shape="card"时才生效。每个选项的宽度，如：'auto'、'100px'，默认使用 columns 自动分配的宽度。                                                                                                                                                                                                                                                                                        |
| item-height  | string                                                                                      |                                 | 当shape="card"时才生效。每个选项的高度，默认自适应元素高度。                                                                                                                                                                                                                                                                                                                          |
| img-height   | string                                                                                      | '160px'                         | 当shape="card"时才生效。每个选项中图片的高度。                                                                                                                                                                                                                                                                                                                                        |
| equal-height | boolean                                                                                     | false                           | 当shape="card"时才生效。是否每一行的选项高度都相等，会使用高度最高的选项。                                                                                                                                                                                                                                                                                                            |
