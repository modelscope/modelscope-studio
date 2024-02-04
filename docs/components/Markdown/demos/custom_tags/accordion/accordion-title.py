import gradio as gr
import modelscope_studio as mgr

with gr.Blocks() as demo:
    mgr.Markdown(f"""
<accordion>

::accordion-title[Using `tool`]

```json
{{"text": "glorious weather", "resolution": "1024*1024"}}
```

</accordion>
""")

if __name__ == "__main__":
    demo.queue().launch()
