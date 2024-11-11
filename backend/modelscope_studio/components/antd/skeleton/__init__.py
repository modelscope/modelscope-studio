from __future__ import annotations

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .avatar import AntdSkeletonAvatar
from .button import AntdSkeletonButton
from .image import AntdSkeletonImage
from .input import AntdSkeletonInput
from .node import AntdSkeletonNode


class AntdSkeleton(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/skeleton
    """
    Node = AntdSkeletonNode
    Avatar = AntdSkeletonAvatar
    Button = AntdSkeletonButton
    Image = AntdSkeletonImage
    Input = AntdSkeletonInput
    EVENTS = []

    def __init__(
            self,
            props: dict | None = None,
            *,
            active: bool | None = None,
            avatar: bool | dict | None = None,
            loading: bool | None = None,
            paragraph: bool | dict | None = None,
            round: bool | None = None,
            title: bool | dict | None = None,
            root_class_name: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.active = active
        self.avatar = avatar
        self.loading = loading
        self.paragraph = paragraph
        self.round = round
        self.title = title
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("skeleton")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
