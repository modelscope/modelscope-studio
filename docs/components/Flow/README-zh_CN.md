# Flow

基于 [reactflow](https://reactflow.dev/) 实现的 Flow 组件。

- 支持通过 schema 自定义渲染节点
- 支持自定义节点的渲染组件，并与 Python 事件交互

## 如何使用

### 定义 schema 节点 (重要)

详见：<tab-link tab="define_schema">Define Schema</tab-link>

### 基本使用

<demo name="basic" code-position="bottom"></demo>

### 组件配置项

<demo name="component_options" code-position="bottom"></demo>

### 自定义节点类型（高阶用法，需要了解前端知识）

<demo name="custom_node_type" code-position="bottom"></demo>

## API 及参数列表

### value

接口定义：

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

| 属性                | 类型                                                            | 默认值 | 描述                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| height              | int \| str                                                      | 600    | Flow 组件高度。                                                                                                                                                        |
| sync_on_data_change | bool                                                            | None   | 是否仅在数据更改时同步 Python 值（例如：节点属性、节点计数、边缘计数、连接端口等，不包括节点位置）。 如果您想要更好的页面性能而不是完整数据同步，则应将其设置为 True。 |
| schema              | FlowSchemaDict \| dict                                          | None   | 定义 Flow 组件的 nodes 与 edges。                                                                                                                                      |
| show_sidebar        | bool                                                            | True   | 是否展示侧 Flow 组件侧边栏。                                                                                                                                           |
| show_minimap        | bool                                                            | True   | 是否展示侧 Flow 组件小地图。                                                                                                                                           |
| show_controls       | bool                                                            | True   | 是否展示侧Flow 组件控制栏。                                                                                                                                            |
| background_props    | BackgroundPropsDict \| dict CustomComponentDict 定义见下方      | None   | 修改 Flow组件背景，详见 BackgroundPropsDict 类型。                                                                                                                     |
| min_zoom            | int                                                             | 0.1    | Flow 组件最小缩放倍率。                                                                                                                                                |
| max_zoom            | int                                                             | 2      | Flow 组件最大缩放倍率。                                                                                                                                                |
| custom_components   | dict\[str, CustomComponentDict\] CustomComponentDict 定义见下方 | None   | 支持用户自定义节点类型，并通过 js 控制渲染样式与触发 python 事件。                                                                                                     |

**BackgroundPropsDict 定义如下**

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

**CustomComponentDict 定义如下**

```python
class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]
```

### event listeners

| 事件                            | 描述                                                                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mgr.Flow.change(fn, ···)`      | 当 value 更新时触发，如果 sync_on_data_change 值为 True 时，此时 flow 的实际数据可能并不是实时的，建议监听 data_change 事件。                                                                                                        |
| `mgr.Flow.data_change(fn, ···)` | 当在数据更改时触发（例如：节点属性、节点计数、边缘计数、连接端口等，不包括节点位置）                                                                                                                                                 |
| `mgr.Flow.custom(fn, ···)`      | 自定义标签触发事件时触发，EventData 为：<br/> - id：当前触发节点 id。<br/> - node：当前触发节点类型。 <br/> - attr：当前触发节点属性。<br/> - index：当前触发节点属性索引，当节点属性为 list 时有值。<br/> - value：自定义传入的值。 |
