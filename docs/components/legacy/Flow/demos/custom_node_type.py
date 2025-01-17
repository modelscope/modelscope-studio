import gradio as gr
import modelscope_studio as mgr
import modelscope_studio.components.base as ms
from modelscope_studio.components.legacy.Flow import (FlowSchemaDict, Node,
                                                      NodeSchemaAttributeDict,
                                                      NodeSchemaDict)


def on_data_change(_flow):
    print(_flow)


def on_custom(data: gr.EventData):
    print(data._data)


custom_components = {
    "my-input": {
        "js":
        """
(props, cc, { el, theme, onMount, onUpdate }) => {
  onMount(() => {
    el.innerHTML = `<input />`
    const input = el.querySelector('input')
    input.style.color = theme === 'dark' ? 'white' : 'black'
    input.style.backgroundColor = theme === 'dark' ? 'black' : 'white'
    input.addEventListener('change', (e) => {
      cc.dispatch(e.target.value)
    })
  })
  // props update
  onUpdate(
    () => {
      const input = el.querySelector('input')
      input.setAttribute('value', props.value || '')
    },
    // By default, the callback will not be called when the component is being mounted. Set `callAfterMount` to true to enable it.
    { callAfterMount: true }
  )
}
"""
    }
}

schema = FlowSchemaDict(nodes=[
    NodeSchemaDict(name="my-input-node",
                   title="MyInputNode",
                   attrs=[NodeSchemaAttributeDict(name="a", type="my-input")])
])

data = {
    "nodes": [
        Node(name="my-input-node",
             position=dict(x=0, y=0),
             data=dict(a='Hello'))
    ]
}

with gr.Blocks() as demo, ms.Application():
    flow = mgr.Flow(value=data,
                    schema=schema,
                    custom_components=custom_components,
                    sync_on_data_change=True)
    flow.data_change(fn=on_data_change, inputs=[flow])
    # called when custom component dispatch event
    flow.custom(fn=on_custom)

if __name__ == "__main__":
    demo.queue().launch()
