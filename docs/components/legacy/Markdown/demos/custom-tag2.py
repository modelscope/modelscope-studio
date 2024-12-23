import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown(
        """
custom tag:<custom-tag value="aaa"></custom-tag>
""",
        custom_components={
            "custom-tag": {
                "props": ["value"],
                "template":
                "<button onclick='{onClick}'>{value}</button>",
                # The `js` property should be a string containing a JavaScript Function.
                "js":
                """
(props, cc, { el, onMount, onUpdate }) => {
    // `onMount` will be called after the template first rendered
    onMount(() => {
      // `el` is the container element
      console.log(el)

      // the return function will be called when the component is being unmounted
      return () => {
        console.log('unmount')
      }
    })

    // `onUpdate` will be called when the props changed
    onUpdate(() => {
      console.log(props)
    })
    onUpdate(
      () => {
        console.log(props, 'after mount')
      },
      // By default, the callback will not be called when the component is being mounted. Set `callAfterMount` to true to enable it.
      { callAfterMount: true }
    )
    console.log(props.children) // By default, `props` will be passed a property named `children`, which can get the content in the tag, such as 'xx' in '<tag>xx</tag>'.

    // The return value will be merged with `props` and passed to the template.
    return {
      value: 'Click Me: ' + props.value,
      onClick: () => {
          alert('hello')
      }
    }
}"""
            }
        })

if __name__ == "__main__":
    demo.queue().launch()
