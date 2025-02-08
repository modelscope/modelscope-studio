import base64
import os
import re
from http import HTTPStatus

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

# =========== Configuration

# API KEY
YOUR_API_TOKEN = os.getenv('YOUR_API_TOKEN')

# =========== Configuration

DEFAULT_SYSTEM_PROMPT = """You are a web development engineer, writing web pages according to the instructions below. You are a powerful code editing assistant capable of writing code and creating artifacts in conversations with users, or modifying and updating existing artifacts as requested by users.
All code is written in a single code block to form a complete code file for display, without separating HTML and JavaScript code. An artifact refers to a runnable complete code snippet, you prefer to integrate and output such complete runnable code rather than breaking it down into several code blocks. For certain types of code, they can render graphical interfaces in a UI window. After generation, please check the code execution again to ensure there are no errors in the output.
Output only the HTML, without any additional descriptive text."""

EXAMPLES = [
    {
        "title":
        "Qwen，Start！",
        "description":
        "Help me design an interface with a purple button that says 'Qwen, Start!'. When the button is clicked, display a countdown from 5 in a very large font for 5 seconds.",
    },
    {
        "title":
        "Spam with emojis!",
        "description":
        "Write code in a single HTML file: Capture the click event, place a random number of emojis at the click position, and add gravity and collision effects to each emoji."
    },
    {
        "title":
        "TODO list",
        "description":
        "I want a TODO list that allows me to add tasks, delete tasks, and I would like the overall color theme to be purple."
    },
]

DEFAULT_LOCALE = 'en_US'

DEFAULT_THEME = {
    "token": {
        "colorPrimary": "#6A57FF",
    }
}


class GradioEvents:

    @staticmethod
    def generate_code(input_value, system_prompt_input_value, state_value):
        # Define your code here
        import dashscope
        from dashscope import Generation
        from dashscope.api_entities.dashscope_response import Role

        dashscope.api_key = YOUR_API_TOKEN

        def remove_code_block(text):
            pattern = r'```html\n(.+?)\n```'
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()
            else:
                return text.strip()

        def send_to_sandbox(code):
            encoded_html = base64.b64encode(
                code.encode('utf-8')).decode('utf-8')
            data_uri = f"data:text/html;charset=utf-8;base64,{encoded_html}"
            return f"<iframe src=\"{data_uri}\" width=\"100%\" height=\"100%\"></iframe>"

        yield {
            output_loading: gr.update(spinning=True),
            state_tab: gr.update(active_key="loading"),
            output: gr.update(value=None)
        }

        if input_value is None:
            input_value = ''

        messages = [{
            'role': Role.SYSTEM,
            'content': system_prompt_input_value
        }] + state_value["history"]

        messages.append({'role': Role.USER, 'content': input_value})

        generator = Generation.call(model="qwen2.5-coder-32b-instruct",
                                    messages=messages,
                                    result_format='message',
                                    stream=True)
        for response in generator:
            if response.status_code == HTTPStatus.OK:
                role = response.output.choices[0].message.role
                content = response.output.choices[0].message.content
                if response.output.choices[0].finish_reason == 'stop':
                    state_value["history"] = messages + [{
                        'role': role,
                        'content': content
                    }]
                    # Completed
                    yield {
                        output:
                        gr.update(value=content),
                        download_content:
                        gr.update(value=remove_code_block(content)),
                        state_tab:
                        gr.update(active_key="render"),
                        output_loading:
                        gr.update(spinning=False),
                        sandbox:
                        gr.update(
                            value=send_to_sandbox(remove_code_block(content))),
                        state:
                        gr.update(value=state_value)
                    }

                else:
                    # Generating
                    yield {
                        output: gr.update(value=content),
                        output_loading: gr.update(spinning=False),
                    }
            else:
                raise ValueError(
                    'Request id: %s, Status code: %s, error code: %s, error message: %s'
                    % (response.request_id, response.status_code,
                       response.code, response.message))

    @staticmethod
    def select_example(example: dict):
        return lambda: gr.update(value=example["description"])

    @staticmethod
    def close_modal():
        return gr.update(open=False)

    @staticmethod
    def open_modal():
        return gr.update(open=True)

    @staticmethod
    def disable_btns(btns: list):
        return lambda: [gr.update(disabled=True) for _ in btns]

    @staticmethod
    def enable_btns(btns: list):
        return lambda: [gr.update(disabled=False) for _ in btns]

    @staticmethod
    def update_system_prompt(system_prompt_input_value, state_value):
        state_value["system_prompt"] = system_prompt_input_value
        return gr.update(value=state_value)

    @staticmethod
    def reset_system_prompt(state_value):
        return gr.update(value=state_value["system_prompt"])

    @staticmethod
    def render_history(state):
        return gr.update(value=state["history"])

    @staticmethod
    def clear_history(e: gr.EventData, state_value):
        item = e._data["payload"][0]["key"]
        if item == "clear":
            gr.Success("History Cleared.")
            state_value["history"] = []
            return gr.update(value=state_value)
        return gr.skip()


css = """
#coder-artifacts .output-empty,.output-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 680px;
}

#coder-artifacts .output-html {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 680px;
}

#coder-artifacts .output-html > iframe {
  flex: 1;
}

#code-artifacts-code-drawer .output-code {
  flex:1;
}
#code-artifacts-code-drawer .output-code .ms-gr-ant-spin-nested-loading {
  min-height: 100%;
}
"""

with gr.Blocks(css=css) as demo:
    # Global State
    state = gr.State({"system_prompt": DEFAULT_SYSTEM_PROMPT, "history": []})
    with ms.Application(elem_id="coder-artifacts") as app:
        with antd.ConfigProvider(theme=DEFAULT_THEME, locale=DEFAULT_LOCALE):
            #  Header
            with antd.Flex(justify="center", align="center", gap="middle"):
                antd.Typography.Title("Coder-Artifacts",
                                      level=1,
                                      elem_style=dict(fontSize=24))
            with ms.AutoLoading():
                with antd.Row(gutter=[32, 12],
                              elem_style=dict(marginTop=20),
                              align="stretch"):
                    # Left Column
                    with antd.Col(span=24, md=8):
                        with antd.Flex(vertical=True, gap="middle", wrap=True):
                            # Input
                            input = antd.Input.Textarea(
                                size="large",
                                allow_clear=True,
                                auto_size=dict(minRows=2, maxRows=6),
                                placeholder=
                                "Describe the web application you want to create",
                                elem_id="input-container")
                            # Input Notes
                            with antd.Flex(align="center",
                                           justify="space-between"):
                                antd.Typography.Text(
                                    "Note: The model supports multi-round dialogue.",
                                    strong=True,
                                    type="warning")

                                tour_btn = antd.Button("Usage Tour",
                                                       variant="filled",
                                                       color="default")
                            # Submit Button
                            submit_btn = antd.Button("Submit",
                                                     type="primary",
                                                     block=True,
                                                     size="large",
                                                     elem_id="submit-btn")

                            antd.Divider("Settings")

                            # Settings Area
                            with antd.Space(size="small",
                                            wrap=True,
                                            elem_id="settings-area"):
                                system_prompt_btn = antd.Button(
                                    "⚙️ Set System Prompt", type="default")
                                history_btn = antd.Dropdown.Button(
                                    "📜 History",
                                    type="default",
                                    elem_id="history-btn",
                                    menu=dict(items=[{
                                        "key": "clear",
                                        "label": "Clear History",
                                        "danger": True
                                    }]))

                            antd.Divider("Examples")

                            # Examples
                            with antd.Flex(gap="small", wrap=True):
                                for example in EXAMPLES:
                                    with antd.Card(
                                            hoverable=True) as example_card:
                                        antd.Card.Meta(
                                            title=example['title'],
                                            description=example['description'])

                                    example_card.click(
                                        fn=GradioEvents.select_example(
                                            example),
                                        outputs=[input])

                    # Right Column
                    with antd.Col(span=24, md=16):
                        with antd.Card(title="Output",
                                       elem_style=dict(height="100%"),
                                       styles=dict(body=dict(height="100%")),
                                       elem_id="output-container"):
                            # Output Container Extra
                            with ms.Slot("extra"):
                                with ms.Div(elem_id="output-container-extra"):
                                    with antd.Button(
                                            "Download HTML",
                                            type="link",
                                            href_target="_blank",
                                            disabled=True,
                                    ) as download_btn:
                                        with ms.Slot("icon"):
                                            antd.Icon("DownloadOutlined")
                                    download_content = gr.Text(visible=False)

                                    view_code_btn = antd.Button(
                                        "🧑‍💻 View Code", type="primary")
                            # Output Content
                            with antd.Tabs(
                                    active_key="empty",
                                    render_tab_bar="() => null") as state_tab:
                                with antd.Tabs.Item(key="empty"):
                                    antd.Empty(
                                        description=
                                        "Enter your request to generate code",
                                        elem_classes="output-empty")
                                with antd.Tabs.Item(key="loading"):
                                    with antd.Spin(
                                            tip="Generating code...",
                                            size="large",
                                            elem_classes="output-loading"):
                                        # placeholder
                                        ms.Div()
                                with antd.Tabs.Item(key="render"):
                                    sandbox = gr.HTML(
                                        elem_classes="output-html")

                    # Modals and Drawers
                    with antd.Modal(open=False,
                                    title="System Prompt",
                                    width="800px") as system_prompt_modal:
                        system_prompt_input = antd.Input.Textarea(
                            DEFAULT_SYSTEM_PROMPT,
                            size="large",
                            placeholder="Enter your system prompt here",
                            allow_clear=True,
                            auto_size=dict(minRows=4, maxRows=14))

                    with antd.Drawer(
                            open=False,
                            title="Output Code",
                            placement="right",
                            get_container=
                            "() => document.querySelector('.gradio-container')",
                            elem_id="code-artifacts-code-drawer",
                            styles=dict(
                                body=dict(display="flex",
                                          flexDirection="column-reverse")),
                            width="750px") as output_code_drawer:
                        with ms.Div(elem_classes="output-code"):
                            with antd.Spin(spinning=False) as output_loading:
                                output = ms.Markdown()

                    with antd.Drawer(
                            open=False,
                            title="Chat History",
                            placement="left",
                            get_container=
                            "() => document.querySelector('.gradio-container')",
                            width="750px") as history_drawer:
                        history_output = gr.Chatbot(
                            show_label=False,
                            type="messages",
                            height='100%',
                            elem_classes="history_chatbot")
                    # Tour
                    with antd.Tour(open=False) as usage_tour:
                        antd.Tour.Step(
                            title="Step 1",
                            description=
                            "Describe the web application you want to create.",
                            get_target=
                            "() => document.querySelector('#input-container')")
                        antd.Tour.Step(
                            title="Step 2",
                            description="Click the submit button.",
                            get_target=
                            "() => document.querySelector('#submit-btn')")
                        antd.Tour.Step(
                            title="Step 3",
                            description="Wait for the result.",
                            get_target=
                            "() => document.querySelector('#output-container')"
                        )
                        antd.Tour.Step(
                            title="Step 4",
                            description=
                            "Download the generated HTML here or view the code.",
                            get_target=
                            "() => document.querySelector('#output-container-extra')"
                        )
                        antd.Tour.Step(
                            title="Additional Settings",
                            description=
                            "You can change the system prompt or chat history here.",
                            get_target=
                            "() => document.querySelector('#settings-area')")
    # Event Handler
    gr.on(fn=GradioEvents.close_modal,
          triggers=[usage_tour.close, usage_tour.finish],
          outputs=[usage_tour])
    tour_btn.click(fn=GradioEvents.open_modal, outputs=[usage_tour])

    system_prompt_btn.click(fn=GradioEvents.open_modal,
                            outputs=[system_prompt_modal])

    system_prompt_modal.ok(GradioEvents.update_system_prompt,
                           inputs=[system_prompt_input, state],
                           outputs=[state]).then(fn=GradioEvents.close_modal,
                                                 outputs=[system_prompt_modal])

    system_prompt_modal.cancel(GradioEvents.close_modal,
                               outputs=[system_prompt_modal]).then(
                                   fn=GradioEvents.reset_system_prompt,
                                   inputs=[state],
                                   outputs=[system_prompt_input])
    output_code_drawer.close(fn=GradioEvents.close_modal,
                             outputs=[output_code_drawer])
    history_btn.menu_click(fn=GradioEvents.clear_history,
                           inputs=[state],
                           outputs=[state])
    history_btn.click(fn=GradioEvents.open_modal,
                      outputs=[history_drawer
                               ]).then(fn=GradioEvents.render_history,
                                       inputs=[state],
                                       outputs=[history_output])
    history_drawer.close(fn=GradioEvents.close_modal, outputs=[history_drawer])

    download_btn.click(fn=None,
                       inputs=[download_content],
                       js="""(content) => {
        const blob = new Blob([content], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'output.html'
        a.click()
}""")
    view_code_btn.click(fn=GradioEvents.open_modal,
                        outputs=[output_code_drawer])
    submit_btn.click(
        fn=GradioEvents.open_modal,
        outputs=[output_code_drawer],
    ).then(fn=GradioEvents.disable_btns([submit_btn, download_btn]),
           outputs=[submit_btn, download_btn]).then(
               fn=GradioEvents.generate_code,
               inputs=[input, system_prompt_input, state],
               outputs=[
                   output, state_tab, sandbox, download_content,
                   output_loading, state
               ]).then(fn=GradioEvents.enable_btns([submit_btn, download_btn]),
                       outputs=[submit_btn, download_btn
                                ]).then(fn=GradioEvents.close_modal,
                                        outputs=[output_code_drawer])

if __name__ == "__main__":
    demo.queue().launch(ssr_mode=False)
