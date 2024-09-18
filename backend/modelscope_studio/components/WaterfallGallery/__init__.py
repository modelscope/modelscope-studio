from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any, Callable, List, Literal, Optional, Tuple, Union
from urllib.parse import urlparse

import numpy as np
from gradio import processing_utils, utils
from gradio.components.base import Component
from gradio.data_classes import FileData, GradioModel, GradioRootModel
from gradio.events import EventListener, Events
from gradio_client.documentation import document, set_documentation_group
from gradio_client.utils import is_http_url_like
from PIL import Image as _Image  # using _ to minimize namespace pollution

from ...utils import resolve_frontend_dir

set_documentation_group("component")

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


@document()
class ModelScopeWaterfallGallery(Component):
    """
    Used to display a list of images as a gallery that can be scrolled through.
    Preprocessing: this component does *not* accept input.
    Postprocessing: expects a list of images in any format, {List[numpy.array | PIL.Image | str | pathlib.Path]}, or a {List} of (image, {str} caption) tuples and displays them.

    Demos: fake_gan
    """

    EVENTS = [
        Events.select, Events.change, Events.like,
        EventListener(
            "click",
            config_data=lambda: {"clickable": False},
            callback=lambda block: setattr(block, "clickable", True),
            doc="Triggered when the image action button is clicked."),
        "load_more"
    ]
    FRONTEND_DIR = resolve_frontend_dir("WaterfallGallery")
    data_model = GalleryData

    def __init__(self,
                 value: (List[GalleryImageType | CaptionedGalleryImageType
                              | GalleryImage] | Callable
                         | None) = None,
                 *,
                 label: str | None = None,
                 every: float | None = None,
                 show_label: bool | None = None,
                 container: bool = True,
                 scale: int | None = None,
                 min_width: int = 160,
                 visible: bool = True,
                 elem_id: str | None = None,
                 elem_classes: List[str] | str | None = None,
                 render: bool = True,
                 columns: int | tuple | dict | None = 2,
                 height: int | float | None = None,
                 allow_preview: bool = True,
                 preview: bool | None = None,
                 object_fit: Literal["contain", "cover", "fill", "none",
                                     "scale-down"]
                 | None = None,
                 selected_index: int | None = None,
                 show_share_button: bool | None = None,
                 show_download_button: bool | None = True,
                 interactive: bool | None = None,
                 type: Literal["numpy", "pil", "filepath"] = "filepath",
                 action_label: str | None = "Click",
                 has_more: bool = False,
                 load_more_button_props: dict | None = None,
                 gap: int | tuple[int, int] | None = 8,
                 clickable: bool | None = None,
                 likeable: bool | None = None):
        """
        Parameters:
            value: List of images to display in the gallery by default. If callable, the function will be called whenever the app loads to set the initial value of the component.
            label: The label for this component. Appears above the component and is also used as the header if there are a table of examples for this component. If None and used in a `gr.Interface`, the label will be the name of the parameter this component is assigned to.
            every: If `value` is a callable, run the function 'every' number of seconds while the client connection is open. Has no effect otherwise. The event can be accessed (e.g. to cancel it) via this component's .load_event attribute.
            show_label: If True, will display label.
            container: If True, will place the component in a container - providing some extra padding around the border.
            scale: relative size compared to adjacent Components. For example if Components A and B are in a Row, and A has scale=2, and B has scale=1, A will be twice as wide as B. Should be an integer. scale applies in Rows, and to top-level Components in Blocks where fill_height=True.
            min_width: minimum pixel width, will wrap if not sufficient screen space to satisfy this value. If a certain scale value results in this Component being narrower than min_width, the min_width parameter will be respected first.
            visible: If False, component will be hidden.
            elem_id: An optional string that is assigned as the id of this component in the HTML DOM. Can be used for targeting CSS styles.
            elem_classes: An optional list of strings that are assigned as the classes of this component in the HTML DOM. Can be used for targeting CSS styles.
            render: If False, component will not render be rendered in the Blocks context. Should be used if the intention is to assign event listeners now but render the component later.
            columns: Represents the number of images that should be shown in one row, for each of the six standard screen sizes (<576px(xs), <768px(sm), <992px(md), <1200px(lg), <1600px(xl), >1600px(xll)). If fewer than 6 are given then the last will be used for all subsequent breakpoints. If a dict is passed in, you can represents the number of images for each size screen with [xs,sm,md,lg,xl,xll] as the key.
            height: The height of the gallery component, specified in pixels if a number is passed, or in CSS units if a string is passed. If more images are displayed than can fit in the height, a scrollbar will appear.
            allow_preview: If True, images in the gallery will be enlarged when they are clicked. Default is True.
            preview: If True, Gallery will start in preview mode, which shows all of the images as thumbnails and allows the user to click on them to view them in full size. Only works if allow_preview is True.
            selected_index: The index of the image that should be initially selected. If None, no image will be selected at start. If provided, will set Gallery to preview mode unless allow_preview is set to False.
            object_fit: CSS object-fit property for the thumbnail images in the gallery. Can be "contain", "cover", "fill", "none", or "scale-down".
            show_share_button: If True, will show a share icon in the corner of the component that allows user to share outputs. If False, icon does not appear.
            show_download_button: If True, will show a download button in the corner of the selected image. If False, the icon does not appear. Default is True.
            interactive: If True, the gallery will be interactive, allowing the user to upload images. If False, the gallery will be static. Default is True.
            type: The format the image is converted to before being passed into the prediction function. "numpy" converts the image to a numpy array with shape (height, width, 3) and values from 0 to 255, "pil" converts the image to a PIL image object, "filepath" passes a str path to a temporary file containing the image. If the image is SVG, the `type` is ignored and the filepath of the SVG is returned.
            action_label: The label for the action button. Only displayed if `clickable` is set to True.
            has_more: If True, will show the "Load More" button.
            load_more_button_props: gradio Button props.
            gap: The gap (px) between images. If a tuple is passed, the first value is the gap for width and the second value is the gap for height.If a number is passed, the gap will be the same for width and height.
            likeable: Whether the gallery image display a like or dislike button. Set automatically by the .like method but has to be present in the signature for it to show up in the config.
            clickable: Whether the gallery image display an action button. Set automatically by the .click method but has to be present in the signature for it to show up in the config.
        """
        self.columns = columns
        self.height = height
        self.gap = gap
        self.preview = preview
        self.allow_preview = allow_preview
        self.has_more = has_more
        self.load_more_button_props = load_more_button_props
        self.likeable = likeable
        self.clickable = clickable
        self.show_download_button = ((utils.get_space() is not None)
                                     if show_download_button is None else
                                     show_download_button)
        self.selected_index = selected_index
        self.type = type
        self.object_fit = object_fit
        self.action_label = action_label
        self.show_share_button = show_share_button
        self.empty_input = {
            "data": [[]],
            "append_list": [[]],
        }
        super().__init__(label=label,
                         every=every,
                         show_label=show_label,
                         container=container,
                         scale=scale,
                         min_width=min_width,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         value=value,
                         interactive=interactive)

    def postprocess(
        self,
        value: List[GalleryImageType | CaptionedGalleryImageType
                    | GalleryImage | dict] | None,
        # **kwargs
    ) -> GalleryData:
        """
        Parameters:
            value: list of images, or list of (image, caption) tuples
        Returns:
            list of string file paths to images in temp directory
        """

        if value is None:
            return GalleryData(root=[])
        output = []

        def _save(img):
            url = None
            caption = None
            orig_name = None
            meta = None
            liked = None

            if isinstance(img, (tuple, list)):
                img, caption = img
            if isinstance(img, dict):
                img = GalleryImage(**img)
            if isinstance(img, GalleryImage):
                liked = img.liked
                caption = img.caption
                meta = img.meta
                img = img.image
            if isinstance(img, np.ndarray):
                file = processing_utils.save_img_array_to_cache(
                    img, cache_dir=self.GRADIO_CACHE)
                file_path = str(utils.abspath(file))
            elif isinstance(img, _Image.Image):
                file = processing_utils.save_pil_to_cache(
                    img, cache_dir=self.GRADIO_CACHE)
                file_path = str(utils.abspath(file))
            elif isinstance(img, FileData):
                file_path = img.path
                orig_name = img.orig_name
            elif isinstance(img, str):
                file_path = img
                if is_http_url_like(img):
                    url = img
                    orig_name = Path(urlparse(img).path).name
                else:
                    url = None
                    orig_name = Path(img).name
            elif isinstance(img, Path):
                file_path = str(img)
                orig_name = img.name
            else:
                raise ValueError(f"Cannot process type as image: {type(img)}")

            return GalleryImage(image=FileData(path=file_path,
                                               url=url,
                                               orig_name=orig_name),
                                caption=caption,
                                meta=meta,
                                liked=liked)

        with ThreadPoolExecutor() as executor:
            for o in executor.map(_save, value):
                output.append(o)
        return GalleryData(root=output)

    def preprocess(self,
                   payload: GalleryData | None) -> List[GalleryImage] | None:
        if payload is None or not payload.root:
            return None
        for gallery_element in payload.root:
            image = self.convert_to_type(gallery_element.image.path,
                                         self.type)  # type: ignore
            if (not isinstance(image, str)):
                gallery_element.image = image
        return payload.root

    @staticmethod
    def convert_to_type(img: str, type: Literal["filepath", "numpy", "pil"]):
        if type == "filepath":
            return img
        else:
            converted_image = _Image.Image.open(img)
            if type == "numpy":
                converted_image = np.array(converted_image)
            return converted_image

    def example_inputs(self) -> Any:
        return [
            [
                "https://gradio-builds.s3.amazonaws.com/demo-files/cheetah_running.avif",
                "A fast cheetahA fast cheetahA fast cheetahA fast cheetahA fast cheetahA fast cheetahA fast cheetahA fast cheetahA fast cheetahA fast cheetahA fast cheetah",
            ],
            [
                "https://gradio-builds.s3.amazonaws.com/demo-files/cheetah-002.jpg",
                "A fast cheetah",
            ],
            [
                "https://gradio-builds.s3.amazonaws.com/demo-files/cheetah-003.jpg",
                "A fast cheetah",
            ],
            [
                "https://gradio-builds.s3.amazonaws.com/demo-files/cheetah3.webp",
                "A fast cheetah2",
            ],
        ]
