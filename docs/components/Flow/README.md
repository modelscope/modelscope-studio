# Flow

A Flow component implemented based on [reactflow](https://reactflow.dev/).

- Supports customization of node rendering through a schema.
- Allows for custom node render components with interaction from Python.

## How to Use

### Defining Schema Nodes (Important)

See: <tab-link tab="define_schema">Define Schema</tab-link>

### Basic Usage

<demo name="basic" code-position="bottom"></demo>

### Component Options

<demo name="component_options" code-position="bottom"></demo>

### Custom Node Types (Advanced usage, requires frontend knowledge)

<demo name="custom_node_type" code-position="bottom"></demo>

## API and Parameter List

### value

Interface definition:

```python
class NodePosition(GradioModel):
    x: Optional[int] = 0
    y: Optional[int] = 0


class Node(GradioModel):
    id: Optional[str] = None
    name: str
    title: Optional[str] = None
    position: Optional[Union[NodePosition, dict]] = None
    data: Optional[dict] = None

class EdgePort(GradioModel):
    attr: Optional[str] = None
    attrItemIndex: Optional[int] = None
    handleIndex: Optional[int] = None

class Edge(GradioModel):
    id: Optional[str] = None
    source: str
    target: str
    sourcePort: Optional[Union[EdgePort, dict]] = None
    targetPort: Optional[Union[EdgePort, dict]] = None


class FlowData(GradioModel):
    nodes: Optional[List[Union[Node, dict]]] = []
    edges: Optional[List[Union[Edge, dict]]] = []
```

### props

| Attribute           | Type                                                                  | Default Value | Description                                                                                                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| height              | int \| str                                                            | 600           | Height of the Flow component.                                                                                                                                                                                                       |
| sync_on_data_change | bool                                                                  | None          | Whether to sync the Python value only on data change (e.g., node attributes, node count, edge count, connection ports, not including node positions). If you want better page performance without full data sync, set this to True. |
| schema              | FlowSchemaDict \| dict                                                | None          | Defines the nodes and edges of the Flow component.                                                                                                                                                                                  |
| show_sidebar        | bool                                                                  | True          | Whether to display the sidebar in the Flow component.                                                                                                                                                                               |
| show_minimap        | bool                                                                  | True          | Whether to display the minimap in the Flow component.                                                                                                                                                                               |
| show_controls       | bool                                                                  | True          | Whether to display the controls bar in the Flow component.                                                                                                                                                                          |
| background_props    | BackgroundPropsDict \| dict BackgroundPropsDict definition below      | None          | Modify the background of the Flow component, see the BackgroundPropsDict type.                                                                                                                                                      |
| min_zoom            | int                                                                   | 0.1           | Minimum zoom level for the Flow component.                                                                                                                                                                                          |
| max_zoom            | int                                                                   | 2             | Maximum zoom level for the Flow component.                                                                                                                                                                                          |
| custom_components   | dict\[str, CustomComponentDict\] CustomComponentDict definition below | None          | Supports user-defined custom tags and controls tag rendering styles and triggers Python events through js.                                                                                                                          |

**BackgroundPropsDict definition:**

```python
class BackgroundPropsDict(TypedDict):
    color: Optional[str]
    className: Optional[str]
    # The gap between patterns. Passing in a tuple allows you to control the x and y gap independently.
    gap: Optional[Union[int, Tuple[int, int]]]
    # The radius of each dot or the size of each rectangle if BackgroundVariant.Dots or BackgroundVariant.Cross is used. This defaults to 1 or 6 respectively, or ignored if BackgroundVariant.Lines is used.
    size: Optional[int]
    offset: Optional[int]
    lineWidth: Optional[int]
    variant: Optional[Literal['dots', 'lines', 'cross']]
```

**CustomComponentDict definition:**

```python
class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]
```

### Event Listeners

| Event                           | Description                                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mgr.Flow.change(fn, ...)`      | Triggers when the `value` updates. If `sync_on_data_change` is True, the actual data at this point might not be up-to-date; consider listening to the `data_change` event instead.                                                                                                                                                   |
| `mgr.Flow.data_change(fn, ...)` | Triggers when there's a data change (e.g., node attributes, node count, edge count, connection ports), but not node positions.                                                                                                                                                                                                       |
| `mgr.Flow.custom(fn, ...)`      | Triggers when a custom label event occurs. The `EventData` includes:<br/> - `id`: ID of the currently triggered node.<br/> - `node`: Type of the currently triggered node.<br/> - `attr`: Attributes of the currently triggered node.<br/> - `index`: Index of the attribute if it's a list.<br/> - `value`: Custom passed-in value. |
