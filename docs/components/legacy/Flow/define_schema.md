# Define Schema

Before using the Flow component, need to create a Schema definition node in advance. The schema type is defined as follows:

```ts
export interface FlowSchema {
  nodes: FlowNodeSchema[];
}

export interface FlowNodeSchema {
  /**
   * As a unique identifier for the node. Mandatory.
   */
  name: string;

  /**
   * Display icon for the node.
   */
  icon?: string;

  /**
   * Display title for the node, defaults to the node name if not provided.
   */
  title?: string;

  /**
   * A short description of the node's purpose.
   */
  description?: string;

  /**
   * Width of the node.
   */
  width?: number;

  /**
   * Height of the node.
   */
  height?: number;

  /**
   * Shows/hides the toolbar (delete, copy, rename, etc.).
   * @default true
   */
  show_toolbar?: boolean;

  /**
   * Enables/disables adding more instances of this node.
   * @default true
   */
  addable?: boolean;

  /**
   * Enables/disables deleting existing instances of this node.
   * @default true
   */
  deletable?: boolean;

  /**
   * Maximum number of this node type that can exist simultaneously.
   */
  max?: number;

  /**
   * Minimum number of this node type that must exist simultaneously.
   */
  min?: number;

  /**
   * Configurations for the node's connection ports.
   */
  ports?: {
    /**
     * Source ports for the node as a connection.
     * @default ['right']
     */
    source?: Position[];

    /**
     * Allowed the source ports of this node to connect to other nodes or attributes. Defaults to all nodes and attributes
     */
    sourceConnections?: PortConnection[];

    /**
     * Target ports for the node as a connection
     * @default ['left']
     */
    target?: Position[];

    /**
     * Allowed other nodes or attributes allowed to connect to the target ports of this node. Defaults to all nodes and attributes
     *
     */
    targetConnections?: PortConnection[];
  };

  /**
   * Configuration of the node's attributes.
   */
  attrs?: FlowNodeAttrSchema[];

  /**
   * Initial values for the node's attributes when creating a new instance.
   */
  template?: {
    /**
     * Attribute values corresponding to their names in the `attrs` field, e.g., `{ "a": 1, "b": 2 }`.
     */
    attrs?: Attrs;
  };
}

export interface FlowNodeAttrSchema {
  /**
   * Unique attribute name used as a key in the node data. Mandatory.
   */
  name: string;

  /**
   * Display title for the attribute, defaults to the attribute name if not provided.
   */
  title?: string;

  /**
   * A brief explanation about the attribute purpose.
   */
  description?: string;

  /**
   * Disables user editing of the attribute value. By default, attributes are editable.
   * @default false
   */
  disabled?: boolean;

  /**
   * Attribute input type. Can be one of the built-in Ant Design components or a custom component. Defaults to 'input'.
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
    // custom
    | (string & {});

  /**
   * Configuration options specific to the chosen component type, supporting Ant Design ({@link https://ant.design/components/overview/}) or custom component properties.
   */
  props?: Record<string, any>;

  /**
   * Configurations for the node attribute ports.
   */
  ports?: {
    /**
     * Source ports for the attribute as a connection.
     * @default []
     */
    source?: Position[];

    /**
     * Allowed the source ports of this attribute to connect to other nodes or attributes. Defaults to all nodes and attributes
     */
    sourceConnections?: PortConnection[];

    /**
     * Target ports for the attribute as a connection
     * @default []
     */
    target?: Position[];

    /**
     * Allowed other nodes or attributes allowed to connect to the target ports of this attribute. Defaults to all nodes and attributes
     */
    targetConnections?: PortConnection[];
  };

  /**
   * Indicates whether the attribute is a list.
   * @default false
   */
  list?:
    | boolean
    | {
        /**
         * Port configurations for each item in the list.
         */
        ports?: {
          /**
           * Source ports for the list item as a connection.
           * @default []
           */
          source?: Position[];

          /**
           * Allowed the source ports of this list item to connect to other nodes or attributes. Defaults to all nodes and attributes
           */
          sourceConnections?: PortConnection[];

          /**
           * Target ports for the list item as a connection
           */
          target?: Position[];

          /**
           * Allowed other nodes or attributes allowed to connect to the target ports of this list item. Defaults to all nodes and attributes
           */
          targetConnections?: PortConnection[];
        };

        /**
         * Minimum number of items in the list.
         */
        min?: number;

        /**
         * Maximum number of items in the list.
         */
        max?: number;
      };

  /**
   * Enable/disable accordion UI.
   * @default true
   */
  accordion?: boolean;

  /**
   * Specifies if the attribute value is mandatory. By default, attributes are optional.
   * @default false
   */
  required?:
    | boolean
    | {
        message?: string;
      };

  /**
   * Validates attribute values using JSON schema.
   */
  json_schema_validator?: Record<string, any>;
}
```

You can define the schema by a json file (recommended) or directly on the Python by the exported types:

- Defined by json:

```json
<file src="./schema/agents_schema.json"></file>
```

- Defined by Python:

```python
<file src="./schema/agents_schema.py"></file>
```
