# WaterfallGallery

瀑布流形式的 gradio Gallery。

- 支持瀑布流展示图片
- 增加点赞按钮，支持图片额外绑定`like`事件
- 增加 action 按钮，支持图片额外绑定`click`事件
- 响应式 columns

## 如何使用

### 基本使用

<demo name="basic"></demo>

### 响应式 columns

<demo name="responsive_columns"></demo>

### 加载更多

<demo name="load_more"></demo>

### 点赞/点击反馈

<demo name="like_click_feedback"></demo>

## API 及参数列表

以下 API 均为在原有 gradio Gallery 外的额外拓展参数。

### value

接口定义：

```python
GalleryImageType = Union[np.ndarray, _Image.Image, FileData, Path, str]
CaptionedGalleryImageType = Tuple[GalleryImageType, str]


class GalleryImage(GradioModel):
    image: Union[FileData, Path, str]
    caption: Optional[str] = None
    liked: Optional[bool] = None
    # custom meta data
    meta: Optional[Any] = None


class GalleryData(GradioRootModel):
    root: List[GalleryImage]
```

### props

| 属性                   | 类型                 | 默认值  | 描述                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| has_more               | bool                 | None    | 如果为 True，会显示 "加载更多" 按钮                                                                                                                                                                                                                                                                                                         |
| load_more_button_props | dict                 | None    | ”加载更多“按钮属性，同 gradio Button                                                                                                                                                                                                                                                                                                        |
| columns                | int \| tuple \| dict | 2       | 展示在以下尺寸屏幕（<576px(xs)、<768px(sm)、<992px(md)、<1200px(lg)、<1600px(xl)、>1600px(xll)）中在一行显示的图像数量。 <br/> - 如果传入 int, 则应用于所有尺寸屏幕；<br/> - 如果传入 tuple, 当给出的断点少于 6 个, 则最后一个断点将用于所有后续断点；<br/> - 如果传入 dict, 则可以以 [xs,sm,md,lg,xl,xll] 为键表示每个尺寸屏幕的图像数量。 |
| gap                    | tuple \| int         | 8       | 图片之间的间隙 (px)。 如果传递一个元组，则第一个值是宽度的间隙，第二个值是高度的间隙。如果传递数字，则宽度和高度的间隙相同                                                                                                                                                                                                                  |
| action_label           | str                  | 'Click' | action 按钮的文案。当 `clickable`为 True 时才展示                                                                                                                                                                                                                                                                                           |
| likeable               | bool                 | None    | 是否显示喜欢或不喜欢按钮。 可以通过显示绑定 `.like` 方法自动设置。                                                                                                                                                                                                                                                                          |
| clickable              | bool                 | None    | 是否显示 action 按钮。 可以通过显示绑定 `.click` 方法自动设置。                                                                                                                                                                                                                                                                             |

### event listeners

| 事件                                      | 描述                                                                                                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mgr.WaterfallGallery.load_more(fn, ···)` | “加载更多”按钮被点击时触发。                                                                                                                                                    |
| `mgr.WaterfallGallery.like(fn, ···)`      | 当点赞/点踩按钮被点击时触发，EventData 为：<br/> - index：当前图片索引。<br/> - value：当前图片信息。 <br/> - liked：当前图片的喜欢/不喜欢状态，可以为 None，代表用户取消操作。 |
| `mgr.WaterfallGallery.click(fn, ···)`     | action 按钮被点击时触发，EventData 为：<br/> - index：当前图片索引。<br/> - value：当前图片信息。                                                                               |
