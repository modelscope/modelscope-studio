import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro

with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    antd.Divider("Render Error")
    pro.WebSandbox(value={
        "index.tsx":
        """
export default function App() {
  return <button onClick={() => {
    throw new Error('Test Error');
  } }>Click to throw error</button>;
}
"""
    },
                   template="react")
    antd.Divider("Compile Error")
    pro.WebSandbox(value={}, template="react")
    antd.Divider("Custom Compile Error Render")
    with pro.WebSandbox(value={}, template="react"):
        with ms.Slot("compileErrorRender",
                     params_mapping="(message) => ({ sub_title: message })"):
            antd.Result(status="error", title="Compile Error")

if __name__ == "__main__":
    demo.queue().launch()
