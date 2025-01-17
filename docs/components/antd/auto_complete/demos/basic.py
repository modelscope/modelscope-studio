import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_search(e: gr.EventData):
    text = e._data["payload"][0]
    domains = ["gmail.com", "163.com", "qq.com"]
    if not text or "@" in text:
        return gr.update(options=[])
    return gr.update(options=[{
        "value": f"{text}@{domain}",
        "label": f"{text}@{domain}"
    } for domain in domains])


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            auto_complete = antd.AutoComplete(placeholder="Typing here...",
                                              elem_style=dict(width=200))
            antd.Divider("Customize Input   Component")
            with antd.AutoComplete() as customize_auto_complete:
                with ms.Slot("children"):
                    antd.Input.Textarea(placeholder="Typing here...")
            auto_complete.search(on_search, outputs=[auto_complete])
            customize_auto_complete.search(on_search,
                                           outputs=[customize_auto_complete])

if __name__ == "__main__":
    demo.queue().launch()
