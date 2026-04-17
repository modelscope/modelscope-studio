# Usage Examples

<cite>
**Files referenced in this document**
- [docs/components/antdx/conversations/demos/basic.py](file://docs/components/antdx/conversations/demos/basic.py)
- [docs/components/antdx/conversations/demos/operations.py](file://docs/components/antdx/conversations/demos/operations.py)
- [docs/components/antdx/conversations/demos/group.py](file://docs/components/antdx/conversations/demos/group.py)
</cite>

## Basic Usage

### Simple Conversation List

```python
import gradio as gr
import modelscope_studio as mgr

with gr.Blocks() as demo:
    mgr.antdx.Conversations(
        items=[
            {"key": "1", "label": "First conversation"},
            {"key": "2", "label": "Second conversation"},
            {"key": "3", "label": "Third conversation"},
        ]
    )
```

### With Icons and Labels

Use Slots to define `label`/`icon` slots for custom rendering:

```python
with gr.Blocks() as demo:
    with mgr.antdx.Conversations() as conv:
        with mgr.antdx.Conversations.Item(key="1"):
            with mgr.Slot("icon"):
                mgr.antdx.Icon(type="MessageOutlined")
            with mgr.Slot("label"):
                gr.Markdown("**Important Chat**")
```

## Menu Operations (Add, Delete, Rename)

```python
import gradio as gr
import modelscope_studio as mgr

with gr.Blocks() as demo:
    with mgr.antdx.Conversations() as conv:
        with mgr.antdx.Conversations.Item(key="chat-1", label="Chat 1"):
            with mgr.Slot("menu.items"):
                mgr.antdx.MenuItem(key="rename", label="Rename")
                mgr.antdx.MenuItem(key="delete", label="Delete", danger=True)

    def handle_menu_click(key, menu_info):
        print(f"Item: {key}, Menu: {menu_info}")

    conv.menu_click(handle_menu_click)
```

## Conversation Grouping with Collapsible

```python
with gr.Blocks() as demo:
    mgr.antdx.Conversations(
        groupable=True,
        items=[
            {"key": "1", "label": "Morning standup", "group": "Today"},
            {"key": "2", "label": "Code review", "group": "Today"},
            {"key": "3", "label": "Planning session", "group": "Yesterday"},
            {"key": "4", "label": "Bug discussion", "group": "Yesterday"},
        ]
    )
```

## Dynamic Conversation Management

```python
import gradio as gr
import modelscope_studio as mgr

def add_conversation(items, name):
    new_key = f"conv-{len(items) + 1}"
    return items + [{"key": new_key, "label": name}]

def delete_conversation(items, key):
    return [item for item in items if item["key"] != key]

with gr.Blocks() as demo:
    items_state = gr.State(value=[
        {"key": "1", "label": "Initial conversation"},
    ])

    with gr.Row():
        new_name = gr.Textbox(placeholder="Conversation name")
        add_btn = gr.Button("Add")

    conv = mgr.antdx.Conversations()

    add_btn.click(
        add_conversation,
        inputs=[items_state, new_name],
        outputs=[items_state]
    )

    items_state.change(
        lambda items: mgr.antdx.Conversations(items=items),
        inputs=[items_state],
        outputs=[conv]
    )
```

## Event Handling Examples

### Handling Active Selection Change

```python
def on_active_change(key):
    print(f"Selected conversation: {key}")
    # Load messages for selected conversation

conversations.active_change(
    on_active_change,
    inputs=[conversations]
)
```

### Handling Creation Button Click

```python
def on_creation_click():
    # Create new conversation
    new_id = generate_id()
    return [{"key": new_id, "label": "New Conversation"}]

conversations.creation_click(
    on_creation_click,
    outputs=[conversations]
)
```
