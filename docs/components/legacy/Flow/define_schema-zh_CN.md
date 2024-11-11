# Define Schema

在使用 Flow 组件前，需要预先创建 Schema 定义 node 节点，schema 类型定义如下：

```ts
export interface FlowSchema {
  nodes: FlowNodeSchema[];
}

export interface FlowNodeSchema {
  /**
   * 作为节点的唯一标识。必填。
   */
  name: string;

  /**
   * 节点显示图标。
   */
  icon?: string;

  /**
   * 节点标题，如果没有提供则默认使用 name。
   */
  title?: string;

  /**
   * 节点的简短描述。
   */
  description?: string;

  /**
   * 节点宽度。
   */
  width?: number;

  /**
   * 节点高度。
   */
  height?: number;

  /**
   * 显示/隐藏工具栏（删除、复制、重命名等）。
   * @default true
   */
  show_toolbar?: boolean;

  /**
   * 启用/禁止添加更多此类节点实例。
   * @default true
   */
  addable?: boolean;

  /**
   * 启用/禁止删除现有此类节点实例。
   * @default true
   */
  deletable?: boolean;

  /**
   * 可以同时存在的此类节点的最大数量。
   */
  max?: number;

  /**
   * 可以同时存在的此类节点的最小数量。
   */
  min?: number;

  /**
   * 节点连接端口的配置。
   */
  ports?: {
    /**
     * 节点作为连接的源端口。
     * @default ['right']
     */
    source?: Position[];

    /**
     * 允许此节点 source 端口连接到的其他节点或属性。默认为所有节点和属性。
     * @default []
     */
    sourceConnections?: PortConnection[];

    /**
     * 节点作为连接的目标端口。
     * @default ['left']
     */
    target?: Position[];

    /**
     * 其他允许连接到此节点 target 端口的节点或属性。默认为所有节点和属性
     * @default []
     */
    targetConnections?: PortConnection[];
  };

  /**
   * 节点的属性配置。
   */
  attrs?: FlowNodeAttrSchema[];

  /**
   * 创建新实例时节点属性的初始值。
   */
  template?: {
    /**
     * 在`attrs`字段中与其名称相对应的属性值，例如 { "a": 1, "b": 2 }。
     */
    attrs?: Attrs;
  };
}

export interface FlowNodeAttrSchema {
  /**
   * 唯一的属性名称，在 node data 中用作 key。必填。
   */
  name: string;

  /**
   * 属性标题，如果没有提供则默认使用 name。
   */
  title?: string;

  /**
   * 属性的简短描述
   */
  description?: string;

  /**
   * 禁用用户编辑属性值。默认情况下，属性是可编辑的。
   * @default false
   */
  disabled?: boolean;

  /**
   * 属性输入类型。可以是内置的 Ant Design 组件或自定义组件之一。默认为'input'。
   * @default 'input'
   */
  type?:
    | 'input'
    | 'textarea'
    | 'radio'
    | 'checkbox'
    | 'number'
    | 'select'
    | 'switch'
    | 'upload'
    // 自定义
    | (string & {});

  /**
   * 针对所选组件类型的特定配置选项，支持 Ant Design 组件({@link https://ant.design/components/overview/})或自定义组件的属性。
   */
  props?: Record<string, any>;

  /**
   * 节点属性连接端口的配置。
   */
  ports?: {
    /**
     * 节点属性作为连接的源端口。
     * @default []
     */
    source?: Position[];

    /**
     * 允许此节点属性 source 端口连接到的其他节点或属性。
     * @default []
     */
    sourceConnections?: PortConnection[];

    /**
     * 节点属性作为连接的目标端口。
     * @default []
     */
    target?: Position[];

    /**
     * 其他允许连接到此节点属性 target 端口的节点或属性。
     * @default []
     */
    targetConnections?: PortConnection[];
  };

  /**
   * 表示该属性是否为列表值。
   * @default false
   */
  list?:
    | boolean
    | {
        /**
         * 列表中每个 item 的端口配置。
         */
        ports?: {
          /**
           * 列表 item 作为连接的源端口。
           * @default []
           */
          source?: Position[];

          /**
           * 允许此列表 item source 端口连接到的其他节点或属性。
           * @default []
           */
          sourceConnections?: PortConnection[];

          /**
           * 列表 item 作为连接的目标端口。
           */
          target?: Position[];

          /**
           * 其他允许连接到此列表 item target 端口的节点或属性。
           */
          targetConnections?: PortConnection[];
        };

        /**
         * 列表中的最小 item 数量。
         */
        min?: number;

        /**
         * 列表中的最大 item 数量。
         */
        max?: number;
      };

  /**
   * 启用/禁用手风琴 UI。
   * @default true
   */
  accordion?: boolean;

  /**
   * 指定该属性值是否为必填项。默认情况为非必填项。
   * @default false
   */
  required?:
    | boolean
    | {
        message?: string;
      };

  /**
   * 使用 JSON schema 验证属性值。
   */
  json_schema_validator?: Record<string, any>;
}
```

你可以通过 json 文件（推荐）或直接在 Python 端通过导出类型定义：

- 通过 json 定义：

```json
<file src="./schema/agents_schema.json"></file>
```

- 通过 Python 定义：

```python
<file src="./schema/agents_schema.py"></file>
```
