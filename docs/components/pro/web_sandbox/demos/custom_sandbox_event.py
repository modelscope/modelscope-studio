import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro


def on_custom(e: gr.EventData):
    print(e._data)


with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    sandbox = pro.WebSandbox(value={
        "index.tsx":
        """
export default function App() {
  return <button onClick={() => {
    window.dispatch({ type: 'custom', payload: { value: 'test' } })
  } }>Click to emit custom event to Python</button>;
}
"""
    },
                             template="react")
    sandbox.custom(fn=on_custom)

if __name__ == "__main__":
    demo.queue().launch()
