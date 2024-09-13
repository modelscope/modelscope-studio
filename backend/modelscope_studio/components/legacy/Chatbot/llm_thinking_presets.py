def qwen(action_input_title: str = "Using <Action>",
         action_output_title: str = "Completed",
         auto_end: bool = True):
    return {
        "type": "qwen",
        "action_input_title": action_input_title,
        "action_output_title": action_output_title,
        "auto_end": auto_end
    }
