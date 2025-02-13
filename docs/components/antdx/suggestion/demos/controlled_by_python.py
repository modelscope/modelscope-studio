import gradio as gr
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
    return gr.update(value=e._data["payload"][0]), gr.update(open=False)


def change_sender(sender_value: str):
    splitted_value = sender_value.split("/")
    command = sender_value.split("/")[-1]
    if len(splitted_value) > 1:
        filtered_items = [
            item for item in items
            if item["label"].upper().find(command.upper()) != -1
            and not command.startswith(item["value"])
        ]
        if len(filtered_items) > 0:
            return gr.update(open=True, items=filtered_items)
    return gr.update(open=False)


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antdx.Suggestion(open=False) as suggestion:
                with ms.Slot("children"):
                    sender = antdx.Sender(
                        placeholder="Enter / to get suggestions")
            sender.change(fn=change_sender,
                          inputs=[sender],
                          outputs=[suggestion])
            suggestion.select(fn=select_suggestion,
                              outputs=[sender, suggestion])

if __name__ == "__main__":
    demo.queue().launch()
