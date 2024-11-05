# WaterfallGallery

gradio Gallery with waterfall flow.

- Support waterfall flow display images
- Added a like button, support additional binding of `like` events to images
- Added an action button, support additional binding of `click` event to images
- Responsive columns

## How to Use

### Basic Usage

<demo name="basic"></demo>

### Responsive columns

<demo name="responsive_columns"></demo>

### Load More

<demo name="load_more"></demo>

### Like/Click Feedback

<demo name="like_click_feedback"></demo>

## API and Parameter List

The following APIs are additional extended parameters beyond the original gradio Gallery.

### value

Interface definition:

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

| Attribute              | Type                 | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------- | -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| has_more               | bool                 | None          | If True, will show the "Load More" button.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| lode_more_button_props | dict                 | None          | “Load More” button properties, same as gradio Button                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| columns                | int \| tuple \| dict | 2             | Displays the number of images displayed in a row on the following screen sizes (<576px(xs), <768px(sm), <992px(md), <1200px(lg), <1600px(xl), >1600px(xll)). <br/> - If int is passed in, it will apply to all screen sizes; <br/> - If tuple is passed in, when less than 6 breakpoints are given, the last breakpoint will be used for all subsequent breakpoints ;<br/> - If a dict is passed in, you can represents the number of images for each size screen with [xs,sm,md,lg,xl,xll] as the key. |
| gap                    | tuple \| int         | 8             | The gap (px) between images. If a tuple is passed, the first value is the gap for width and the second value is the gap for height.If a number is passed, the gap will be the same for width and height.                                                                                                                                                                                                                                                                                                |
| action_label           | str                  | 'Click'       | The label for the action button. Only displayed if `clickable` is set to True.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| likeable               | bool                 | None          | Whether the gallery image display a like or dislike button. Set automatically by the .like method but has to be present in the signature for it to show up in the config.                                                                                                                                                                                                                                                                                                                               |
| clickable              | bool                 | None          | Whether the gallery image display an action button. Set automatically by the .click method but has to be present in the signature for it to show up in the config.                                                                                                                                                                                                                                                                                                                                      |

### Event Listeners

| Event                                     | Description                                                                                                                                                                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mgr.WaterfallGallery.load_more(fn, ···)` | Triggered when the "Load More" button is clicked.                                                                                                                                                                                                                   |
| `mgr.WaterfallGallery.like(fn, ···)`      | Triggered when the Like/Dislike button is clicked. EventData is: <br/> - index: current image index. <br/> - value: current image info. <br/> - liked: like/dislike status of the current image, which can be None, indicating that the user cancels the operation. |
| `mgr.WaterfallGallery.click(fn, ···)`     | Triggered when the action button is clicked, EventData is: <br/> - index: current image index. <br/> - value: current image info.                                                                                                                                   |
