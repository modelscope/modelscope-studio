import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

python_code = """import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antdx.CodeHighlighter(
                value="print('Hello, World!')",
                lang="python",
                header=True
            )

if __name__ == "__main__":
    demo.queue().launch()
"""

javascript_code = """function greet(name) {
  return `Hello, ${name}!`;
}

const result = greet('World');
console.log(result);
"""

typescript_code = """interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.random(),
    name,
    email,
  };
}
"""

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Divider("Python Code")
            antdx.CodeHighlighter(value=python_code,
                                  lang="python",
                                  header=True)

            antd.Divider("JavaScript Code")
            antdx.CodeHighlighter(value=javascript_code,
                                  lang="javascript",
                                  header=True)

            antd.Divider("TypeScript Code")
            antdx.CodeHighlighter(value=typescript_code,
                                  lang="typescript",
                                  header=True)

            antd.Divider("Custom Header Slot")
            with antdx.CodeHighlighter(value=python_code, lang="python"):
                with ms.Slot("header"):
                    with antd.Flex(justify="space-between", align="center"):
                        ms.Span("Python Example")
                        with antd.Button(value=None, size="small",
                                         type="text"):
                            with ms.Slot("icon"):
                                antd.Icon("CopyOutlined")

if __name__ == "__main__":
    demo.queue().launch()
