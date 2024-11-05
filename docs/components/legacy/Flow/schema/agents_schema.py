import os

from modelscope_studio.components.legacy.Flow import (
    FlowSchemaDict, NodeSchemaAttributeDict, NodeSchemaAttributeListDict,
    NodeSchemaAttributeRequiredDict, NodeSchemaDict, NodeSchemaPortsDict,
    NodeSchemaTemplateDict)


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../../resources",
                        relative_path)


schema = FlowSchemaDict(nodes=[
    NodeSchemaDict(max=1,
                   min=1,
                   addable=False,
                   show_toolbar=False,
                   name="start",
                   title="Start",
                   ports=NodeSchemaPortsDict(source=['right'], target=[])),
    NodeSchemaDict(
        icon=resolve_assets('./bot.jpeg'),
        name="agent",
        title="Agent Node",
        description="Agent Flow Node",
        ports=NodeSchemaPortsDict(source=[], target=['left']),
        attrs=[
            NodeSchemaAttributeDict(name="prompt",
                                    title="Agent Prompt",
                                    type='textarea',
                                    required=NodeSchemaAttributeRequiredDict(
                                        message="Agent Prompt is required")),
            NodeSchemaAttributeDict(name="tool",
                                    title="Tools",
                                    type="select",
                                    props={
                                        "mode":
                                        "multiple",
                                        "options": [{
                                            "label": "Wanx Image Generation",
                                            "value": "image_gen"
                                        }, {
                                            "label": "Code Interpreter",
                                            "value": "code_interpreter"
                                        }, {
                                            "label": "Web Browsing",
                                            "value": "web_browser"
                                        }]
                                    }),
            NodeSchemaAttributeDict(
                name="condition",
                title="Jump Condition",
                list=NodeSchemaAttributeListDict(
                    min=1, ports=NodeSchemaPortsDict(source=['right'])),
                accordion=False)
        ],
        template=NodeSchemaTemplateDict(attrs=dict(condition=[''])))
])
