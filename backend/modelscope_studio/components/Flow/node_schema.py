from typing import List, Literal, Optional, TypedDict, Union


class NodeSchemaPortConnectionDict(TypedDict):
    attrs: Optional[List[str]]
    name: str


class NodeSchemaPortsDict(TypedDict):
    source: Optional[Literal['left', 'right', 'top', 'bottom']]
    target: Optional[Literal['left', 'right', 'top', 'bottom']]
    sourceConnections: Optional[Union[str,
                                      Union[dict,
                                            NodeSchemaPortConnectionDict]]]
    targetConnections: Optional[Union[str,
                                      Union[dict,
                                            NodeSchemaPortConnectionDict]]]


class NodeSchemaAttributeRequiredDict(TypedDict):
    message: Optional[str]


class NodeSchemaAttributeListDict(TypedDict):
    min: Optional[int]
    max: Optional[int]
    ports: Optional[NodeSchemaPortsDict]


class NodeSchemaAttributeDict(TypedDict):
    name: str
    title: Optional[str]
    description: Optional[str]
    disabled: Optional[bool]
    accordion: Optional[bool]
    required: Union[bool, dict, NodeSchemaAttributeRequiredDict]
    json_schema_validator: Optional[dict]
    type: Optional[Literal['input', 'textarea', 'radio', 'checkbox', 'number',
                           'select', 'switch', 'file']]
    props: Optional[dict]
    ports: Optional[NodeSchemaPortsDict]
    list: Optional[Union[NodeSchemaAttributeListDict, dict, str]]


class NodeSchemaTemplateDict(TypedDict):
    attrs: Optional[dict]


class NodeSchemaDict(TypedDict):
    name: str
    title: Optional[str]
    description: Optional[str]
    icon: Optional[str]
    width: Optional[int]
    height: Optional[int]
    max: Optional[int]
    min: Optional[int]
    addable: Optional[bool]
    show_toolbar: Optional[bool]
    deletable: Optional[bool]
    ports: Optional[Union[dict, NodeSchemaPortsDict]]
    attrs: Optional[List[Union[NodeSchemaAttributeDict, dict]]]
    template: Optional[Union[NodeSchemaTemplateDict, dict]]
