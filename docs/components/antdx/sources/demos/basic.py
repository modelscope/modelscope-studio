import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def on_click(e: gr.EventData):
    item = e._data["payload"][0]
    gr.Info("Clicked: " + str(item.get("title", "")))


def on_expand(e: gr.EventData):
    expanded = e._data["payload"][0]
    gr.Info("Expanded: " + str(expanded))


source_items = [
    {
        "title": "Ant Design X",
        "description": "The AI-Native UI solution of Ant Design",
        "href": "https://x.ant.design",
    },
    {
        "title": "Ant Design",
        "description": "An enterprise-class UI design language",
        "href": "https://ant.design",
    },
    {
        "title": "GitHub",
        "description": "Where the world builds software",
        "href": "https://github.com",
    },
]

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Divider("Basic Sources")
            sources1 = antdx.Sources(title="References",
                                     items=source_items,
                                     default_expanded=True)

            antd.Divider("Inline Sources")
            sources2 = antdx.Sources(title="References",
                                     items=source_items,
                                     inline=True)

            antd.Divider("Sources with Slot Items")
            with antdx.Sources(title="Sources") as sources3:
                with ms.Slot("items"):
                    antdx.Sources.Item(title="Ant Design X",
                                       description="The AI-Native UI solution",
                                       url="https://x.ant.design")
                    antdx.Sources.Item(
                        title="ModelScope Studio",
                        description="Gradio component library",
                        url="https://github.com/modelscope/modelscope-studio")

    sources1.click(fn=on_click)
    sources2.click(fn=on_click)
    sources1.expand(fn=on_expand)

if __name__ == "__main__":
    demo.queue().launch()
