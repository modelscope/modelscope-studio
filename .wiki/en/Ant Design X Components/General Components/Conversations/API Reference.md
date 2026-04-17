# API Reference

<cite>
**Files referenced in this document**
- [backend/modelscope_studio/components/antdx/conversations/__init__.py](file://backend/modelscope_studio/components/antdx/conversations/__init__.py)
- [backend/modelscope_studio/components/antdx/conversations/item/__init__.py](file://backend/modelscope_studio/components/antdx/conversations/item/__init__.py)
</cite>

## Conversations Component API

### Properties

| Property       | Type | Default | Description                       |
| -------------- | ---- | ------- | --------------------------------- |
| `items`        | list | `[]`    | Conversation items array          |
| `active_key`   | str  | `None`  | Currently active conversation key |
| `groupable`    | bool | `False` | Whether to enable grouping        |
| `menu`         | dict | `None`  | Context menu configuration        |
| `visible`      | bool | `True`  | Whether to render the component   |
| `elem_id`      | str  | `None`  | Element ID                        |
| `elem_classes` | list | `None`  | Element CSS class names           |
| `elem_style`   | dict | `None`  | Element inline styles             |

### Events

| Event              | Description                                |
| ------------------ | ------------------------------------------ |
| `active_change`    | Fired when the active conversation changes |
| `menu_click`       | Fired when a menu item is clicked          |
| `menu_select`      | Fired when a menu item is selected         |
| `menu_deselect`    | Fired when a menu item is deselected       |
| `menu_open_change` | Fired when menu open state changes         |
| `groupable_expand` | Fired when a group expands or collapses    |
| `creation_click`   | Fired when the creation button is clicked  |

### Slots

| Slot                       | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `items`                    | Slot for injecting Conversations.Item child components |
| `menu.items`               | Slot for injecting context menu items                  |
| `menu.trigger`             | Slot for customizing menu trigger                      |
| `menu.expandIcon`          | Slot for customizing menu expand icon                  |
| `menu.overflowedIndicator` | Slot for customizing overflow indicator                |
| `groupable.label`          | Slot for customizing group label                       |
| `creation.icon`            | Slot for customizing creation button icon              |
| `creation.label`           | Slot for customizing creation button label             |

## Conversations.Item Component API

### Properties

| Property   | Type | Default  | Description                                 |
| ---------- | ---- | -------- | ------------------------------------------- |
| `key`      | str  | required | Unique identifier for the conversation item |
| `label`    | str  | `None`   | Display label (overridden by label slot)    |
| `icon`     | any  | `None`   | Icon (overridden by icon slot)              |
| `disabled` | bool | `False`  | Whether the item is disabled                |
| `group`    | str  | `None`   | Group label (required when groupable=True)  |

### Slots

| Slot    | Description                               |
| ------- | ----------------------------------------- |
| `label` | Slot for customizing item label rendering |
| `icon`  | Slot for customizing item icon rendering  |

## Items Array Format

Each item in the `items` array can contain:

```python
{
    "key": "unique-key",       # Required: unique identifier
    "label": "Display Name",   # Display label
    "icon": None,              # Icon configuration
    "disabled": False,         # Whether disabled
    "group": "Group Name",     # Group label (for groupable mode)
}
```

## Usage Example

```python
import gradio as gr
import modelscope_studio as mgr

with gr.Blocks() as demo:
    state = gr.State(value=None)

    conversations = mgr.antdx.Conversations(
        groupable=True,
        items=[
            {"key": "1", "label": "Chat about Python", "group": "Today"},
            {"key": "2", "label": "ML model discussion", "group": "Today"},
            {"key": "3", "label": "Old conversation", "group": "Yesterday"},
        ]
    )

    conversations.active_change(
        lambda key: print(f"Selected: {key}"),
        inputs=[conversations],
        outputs=[state]
    )
```
