import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

items = [
    {
        "label": 'Write a report',
        "value": 'report'
    },
    {
        "label": 'Draw a picture',
        "value": 'draw'
    },
    {
        "label": 'Check some knowledge',
        "value": 'knowledge',
        "extra": 'Extra Info',
    },
]


def select_suggestion(e: gr.EventData):
    return gr.update(value=e._data["payload"][0])


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Typography.Paragraph(
                "Set `block` to display in a whole row. ``extra` can be used to configure additional information."
            )
            with antdx.Suggestion(
                    items=items,
                    block=True,
                    # onKeyDown Handler in Javascript
                    should_trigger="""(e, { onTrigger, onKeyDown }) => {
                      switch(e.key) {
                        case '/':
                          onTrigger()
                          break
                        case 'ArrowRight':
                        case 'ArrowLeft':
                        case 'ArrowUp':
                        case 'ArrowDown':
                          break;
                        default:
                          onTrigger(false)
                      }
                      onKeyDown(e)
                    }""") as suggestion:
                with ms.Slot("children"):
                    sender = antdx.Sender(
                        placeholder="Enter / to get suggestions")
            suggestion.select(fn=select_suggestion, outputs=[sender])

if __name__ == "__main__":
    demo.queue().launch()
