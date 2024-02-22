import gradio as gr

import modelscope_studio as mgr

with gr.Blocks() as demo:
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
(props, cc, { el, onMount }) => {
    // `onMount` will be called after the template rendered
    onMount(() => {
      // `el` is the container element
      console.log(el)
    })
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
