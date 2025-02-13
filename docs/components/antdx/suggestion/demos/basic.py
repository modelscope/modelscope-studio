import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def select_suggestion(e: gr.EventData):
    return gr.update(value=e._data["payload"][0])


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antdx.Suggestion(
                    # onKeyDown Handler in Javascript
                    should_trigger="""(e, { onTrigger, onKeyDown }) => {
                      const value = e.target.value
                      if (value === '/') {
                          onTrigger()
                      } else if (!value) {
                          onTrigger(false);
                      }
                      onKeyDown(e)
                    }""") as suggestion:
                with ms.Slot("items"):
                    antdx.Suggestion.Item(label="Write a report",
                                          value="report")
                    antdx.Suggestion.Item(label="Draw a picture", value="draw")
                    with antdx.Suggestion.Item(label="Check some knowledge",
                                               value="knowledge"):
                        with ms.Slot("icon"):
                            antd.Icon("OpenAIFilled")
                        antdx.Suggestion.Item(label="About React",
                                              value="react")
                        antdx.Suggestion.Item(label="About Ant Design",
                                              value="antd")
                with ms.Slot("children"):
                    sender = antdx.Sender(
                        placeholder="Enter / to get suggestions")
            suggestion.select(fn=select_suggestion, outputs=[sender])

if __name__ == "__main__":
    demo.queue().launch()
