from timeit import Timer
from typing import Any, Callable, List, Set, Union

from gradio.component_meta import ComponentMeta
from gradio.components.base import BlockContext, Component


class ModelScopeLayoutComponent(BlockContext, metaclass=ComponentMeta):
    """
    """

    EVENTS = []

    # supported slots
    SLOTS = []

    def __exit__(self, *args, **kwargs):
        self._internal.update(layout=True)
        super().__exit__(*args, **kwargs)

    def __init__(
            self,
            *,
            as_item: Union[str, None] = None,
            # gradio properties
            visible: bool = True,
            elem_id: Union[str, None] = None,
            elem_classes: Union[List[str], str, None] = None,
            elem_style: Union[dict, None] = None,
            render: bool = True):
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render)
        self.as_item = as_item
        if self.parent:
            self._internal = dict(index=len(self.parent.children) - 1)
        else:
            self._internal = dict()

        self.elem_style = elem_style

    @property
    def skip_api(self):
        return True


class ModelScopeComponent(Component):
    """
    """

    def __init__(
            self,
            value: Any = None,
            *,
            as_item: Union[str, None] = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: Union[str, None] = None,
            elem_classes: Union[List[str], str, None] = None,
            elem_style: Union[dict, None] = None,
            key: Union[int, str, None] = None,
            every: Union[Timer, float, None] = None,
            inputs: Union[Component, List[Component], Set[Component],
                          None] = None,
            load_fn: Union[Callable, None] = None,
            render: bool = True):
        super().__init__(visible=visible,
                         value=value,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         key=key,
                         every=every,
                         inputs=inputs,
                         load_fn=load_fn,
                         render=render)
        if self.parent:
            self._internal = dict(index=len(self.parent.children) - 1)
        else:
            self._internal = dict()
        self.as_item = as_item
        self.elem_style = elem_style


class ModelScopeDataLayoutComponent(Component,
                                    BlockContext,
                                    metaclass=ComponentMeta):
    """
    """
    EVENTS = []
    # supported slots
    SLOTS = []

    # fix gradio's bug
    @property
    def component_class_id(self):
        return self.get_component_class_id()

    @component_class_id.setter
    def component_class_id(self, value):
        pass

    @property
    def skip_api(self):
        return False

    def __exit__(self, *args, **kwargs):
        self._internal.update(layout=True)
        super().__exit__(*args, **kwargs)

    def __init__(
            self,
            value: Any = None,
            *,
            as_item: Union[str, None] = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: Union[str, None] = None,
            elem_classes: Union[List[str], str, None] = None,
            elem_style: Union[dict, None] = None,
            key: Union[int, str, None] = None,
            every: Union[Timer, float, None] = None,
            inputs: Union[Component, List[Component], Set[Component],
                          None] = None,
            load_fn: Union[Callable, None] = None,
            render: bool = True):
        super().__init__(
            visible=visible,
            value=value,
            elem_id=elem_id,
            elem_classes=elem_classes,
            key=key,
            every=every,
            inputs=inputs,
            load_fn=load_fn,
            # disable render twice
            render=False)
        BlockContext.__init__(self,
                              visible=visible,
                              elem_id=elem_id,
                              elem_classes=elem_classes,
                              render=render)
        if self.parent:
            self._internal = dict(index=len(self.parent.children) - 1)
        else:
            self._internal = dict()
        self.as_item = as_item
        self.elem_style = elem_style
