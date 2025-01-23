import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown("""
<accordion title="Using tool">

```json
{"text": "glorious weather", "resolution": "1024*1024"}
```

</accordion>

Use `::accordion-title` to support markdown:

<accordion>

::accordion-title[Using `tool`]

```json
{"text": "glorious weather", "resolution": "1024*1024"}
```
</accordion>
""")

if __name__ == "__main__":
    demo.queue().launch()
