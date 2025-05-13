import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro

with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    pro.WebSandbox(
        value={
            "./index.html":
            """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TODO List</title>
</head>
<body>
    <div class="todo-container">
        <h1>TODO List</h1>
        <input type="text" id="taskInput" placeholder="Add a new task...">
        <button id="addButton">Add Task</button>
        <ul id="taskList"></ul>
    </div>

    <script type="module">
        import "./index.css";
        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const taskText = taskInput.value.trim();
            if (taskText === '') return;

            const taskList = document.getElementById('taskList');
            const li = document.createElement('li');
            li.textContent = taskText;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                taskList.removeChild(li);
            };

            li.appendChild(deleteButton);
            taskList.appendChild(li);

            taskInput.value = '';
        }
        document.getElementById('addButton').onclick = addTask;
    </script>
</body>
</html>""",
            "./index.css":
            """body {
            font-family: Arial, sans-serif;
            background-color: #2c3e50;
            color: #ecf0f1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .todo-container {
            background-color: #34495e;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            width: 300px;
        }
        h1 {
            text-align: center;
            color: #ecf0f1;
        }
        input[type="text"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: none;
            border-radius: 3px;
            background-color: #ecf0f1;
            color: #2c3e50;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            background-color: #2c3e50;
            margin-bottom: 5px;
            padding: 10px;
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        button {
            background-color: #e74c3c;
            color: #ecf0f1;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        }
        button:hover {
            background-color: #c0392b;
        }"""
        },
        template="html",
        height=600,
    )

if __name__ == "__main__":
    demo.queue().launch()
