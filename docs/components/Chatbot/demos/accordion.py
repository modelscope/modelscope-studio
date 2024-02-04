import os

import gradio as gr
import modelscope_studio as mgr
from modelscope_studio.components.Chatbot.llm_thinking_presets import qwen


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../resources",
                        relative_path)


conversation = [
    [
        None, {
            "text": f"""
Use accordion tag:
<accordion title="Using tool">

```json
{{"text": "glorious weather", "resolution": "1024*1024"}}
```
</accordion>

Qwen preset:
Action: image_gen
Action Input: {{"text": "glorious weather", "resolution": "1024*1024"}}
Observation: <result>![IMAGEGEN]({resolve_assets("screen.jpeg")})</result> Based on your description"glorious weather",I generated a picture.![]({resolve_assets("screen.jpeg")})

Action: 「An arbitrary text representation that will be displayed as the name of the thought chain call」
Action Input: 「Any json or md content will be displayed in the drop-down box of the calling process」
Observation: <result>「Any md content will be displayed in the drop-down box when the call is completed」</result>
""",
            "flushing": False
        }
    ],
]

with gr.Blocks() as demo:
    mgr.Chatbot(
        value=conversation,
        llm_thinking_presets=[qwen()],
        height=600,
    )

if __name__ == "__main__":
    demo.queue().launch()
