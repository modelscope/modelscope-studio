import gradio as gr

import modelscope_studio as mgr


def mount(e: gr.EventData):
    # current page state
    print("onMount", e._data)


def resize(e: gr.EventData):
    print("onResize", e._data)


def onUnmount(e: gr.EventData):
    print("onUnmount", e._data)


with gr.Blocks() as demo:
    gr.Markdown("The Lifecycle component will not be rendered on the page.")
    lifecycle = mgr.Lifecycle()
    # listen to the page lifecycle
    lifecycle.mount(fn=mount)
    lifecycle.resize(fn=resize)
    lifecycle.unmount(fn=onUnmount)

if __name__ == "__main__":
    demo.queue().launch()
