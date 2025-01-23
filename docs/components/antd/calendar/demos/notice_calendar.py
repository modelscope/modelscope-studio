import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Calendar(cell_render="""(current, info) => {
  if (info.type === 'date') {
    if (current.date() === 8) {
      const React = window.ms_globals.React;
      const antd = window.ms_globals.antd;
      const events = [
        {
          type: 'warning',
          content: 'This is warning event.',
        },
        {
          type: 'success',
          content: 'This is usual event.',
        },
      ];
      return React.createElement(
        'ul',
        {
          style: {
            margin: 0,
            padding: 0,
            listStyle: 'none'
          }
        },
        events.map((event) => {
          return React.createElement(
            'li',
            {
              style: {
                marginBottom: 8,
              },
            },
            [
              React.createElement(antd.Badge, {
                status: event.type,
                text: event.content,
              }),
            ]
          );
        })
      );
    }
  }
  return info.originNode;
}""")

if __name__ == "__main__":
    demo.queue().launch()
