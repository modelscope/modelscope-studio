import os
from typing import Literal

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
from helper.Docs import Docs
from helper.env import is_modelscope_studio
from helper.Site import Site
from legacy_app import legacy_demo


def get_text(text: str, cn_text: str):
    if is_modelscope_studio:
        return cn_text
    return text


def get_docs(type: Literal["antd", "antdx", "base"]):
    import importlib.util

    components = []
    components_dir = os.path.join(os.path.dirname(__file__), "components",
                                  type)
    for dir in os.listdir(components_dir):
        abs_dir = os.path.join(components_dir, dir)
        if os.path.isdir(abs_dir):
            app_file = os.path.join(abs_dir, "app.py")
            if os.path.exists(app_file):
                components.append(dir)

    docs = {}
    for component in components:
        spec = importlib.util.spec_from_file_location(
            "doc", os.path.join(components_dir, component, "app.py"))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        docs[component] = module.docs
    return docs


def get_layout_templates():
    import importlib.util

    templates = []
    templates_dir = os.path.join(os.path.dirname(__file__), "layout_templates")
    for dir in os.listdir(templates_dir):
        abs_dir = os.path.join(templates_dir, dir)
        if os.path.isdir(abs_dir):
            app_file = os.path.join(abs_dir, "app.py")
            if os.path.exists(app_file):
                templates.append(dir)

    docs = {}
    for template in templates:
        spec = importlib.util.spec_from_file_location(
            "doc", os.path.join(templates_dir, template, "app.py"))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        docs[template] = module.docs
    return docs


layout_templates = get_layout_templates()

index_docs = {"overview": Docs(__file__), **layout_templates}

base_docs = get_docs("base")
antd_docs = get_docs("antd")
# antdx_docs = get_docs("antdx")

default_active_tab = "index"
index_menu_items = [{
    "label": get_text("ModelScope-Studio", "ModelScope-Studio"),
    "key": "overview"
}, {
    "label":
    get_text("Layout Templates", "布局模板"),
    "type":
    "group",
    "children": [{
        "label": get_text("Coder-Artifacts", "Coder-Artifacts"),
        "key": "coder_artifacts"
    }]
}]

base_menu_items = [{
    "label":
    get_text("Core", "核心"),
    "type":
    "group",
    "children": [{
        "label": get_text("Application", "Application 应用"),
        "key": "application"
    }, {
        "label": get_text("AutoLoading", "AutoLoading 自动加载"),
        "key": "auto_loading"
    }, {
        "label": get_text("Slot", "Slot 插槽"),
        "key": "slot"
    }, {
        "label": get_text("Fragment", "Fragment 片段"),
        "key": "fragment"
    }]
}, {
    "label":
    get_text("Layout", "布局"),
    "type":
    "group",
    "children": [{
        "label": "Div",
        "key": "div"
    }, {
        "label": "Span",
        "key": "span"
    }, {
        "label": "Text",
        "key": "text"
    }, {
        "label": "Markdown",
        "key": "markdown"
    }]
}, {
    "label":
    get_text("Render", "渲染"),
    "type":
    "group",
    "children": [{
        "label": get_text("Each", "Each 循环"),
        "key": "each"
    }, {
        "label": get_text("Filter", "Filter 过滤"),
        "key": "filter"
    }]
}]

antd_menu_items = [{
    "label": get_text("Overview", "概览"),
    "key": "overview"
}, {
    "label":
    get_text("General", "通用"),
    "type":
    "group",
    "children": [{
        "label": get_text("Button", "Button 按钮"),
        "key": "button"
    }, {
        "label": get_text("FloatButton", "FloatButton 悬浮按钮"),
        "key": "float_button"
    }, {
        "label": get_text("Icon", "Icon 图标"),
        "key": "icon"
    }, {
        "label": get_text("Typography", "Typography 排版"),
        "key": "typography"
    }]
}, {
    "label":
    get_text("Layout", "布局"),
    "type":
    "group",
    "children": [{
        "label": get_text("Divider", "Divider 分割线"),
        "key": "divider"
    }, {
        "label": get_text("Flex", "Flex 弹性布局"),
        "key": "flex"
    }, {
        "label": get_text("Grid", "Grid 栅格"),
        "key": "grid"
    }, {
        "label": get_text("Layout", "Layout 布局"),
        "key": "layout"
    }, {
        "label": get_text("Space", "Space 间距"),
        "key": "space"
    }, {
        "label": get_text("Splitter", "Splitter 分割面板"),
        "key": "splitter"
    }]
}, {
    "label":
    get_text("Navigation", "导航"),
    "type":
    "group",
    "children": [{
        "label": get_text("Anchor", "Anchor 锚点"),
        "key": "anchor"
    }, {
        "label": get_text("Breadcrumb", "Breadcrumb 面包屑"),
        "key": "breadcrumb"
    }, {
        "label": get_text("Dropdown", "Dropdown 下拉菜单"),
        "key": "dropdown"
    }, {
        "label": get_text("Menu", "Menu 导航菜单"),
        "key": "menu"
    }, {
        "label": get_text("Pagination", "Pagination 分页"),
        "key": "pagination"
    }, {
        "label": get_text("Steps", "Steps 步骤条"),
        "key": "steps"
    }]
}, {
    "label":
    get_text("Data Entry", "数据录入"),
    "type":
    "group",
    "children": [{
        "label": get_text("AutoComplete", "AutoComplete 自动完成"),
        "key": "auto_complete"
    }, {
        "label": get_text("Cascader", "Cascader 级联选择"),
        "key": "cascader"
    }, {
        "label": get_text("Checkbox", "Checkbox 多选框"),
        "key": "checkbox"
    }, {
        "label": get_text("ColorPicker", "ColorPicker 颜色选择器"),
        "key": "color_picker"
    }, {
        "label": get_text("DatePicker", "DatePicker 日期选择框"),
        "key": "date_picker"
    }, {
        "label": get_text("Form", "Form 表单"),
        "key": "form"
    }, {
        "label": get_text("Input", "Input 输入框"),
        "key": "input"
    }, {
        "label": get_text("InputNumber", "InputNumber 数字输入框"),
        "key": "input_number"
    }, {
        "label": get_text("Mentions", "Mentions 提及"),
        "key": "mentions"
    }, {
        "label": get_text("Radio", "Radio 单选框"),
        "key": "radio"
    }, {
        "label": get_text("Rate", "Rate 评分"),
        "key": "rate"
    }, {
        "label": get_text("Select", "Select 选择器"),
        "key": "select"
    }, {
        "label": get_text("Slider", "Slider 滑动输入条"),
        "key": "slider"
    }, {
        "label": get_text("Switch", "Switch 开关"),
        "key": "switch"
    }, {
        "label": get_text("TimePicker", "TimePicker 时间选择器"),
        "key": "time_picker"
    }, {
        "label": get_text("Transfer", "Transfer 穿梭框"),
        "key": "transfer"
    }, {
        "label": get_text("TreeSelect", "TreeSelect 树选择"),
        "key": "tree_select"
    }, {
        "label": get_text("Upload", "Upload 上传"),
        "key": "upload"
    }]
}, {
    "label":
    get_text("Data Display", "数据展示"),
    "type":
    "group",
    "children": [{
        "label": get_text("Avatar", "Avatar 头像"),
        "key": "avatar"
    }, {
        "label": get_text("Badge", "Badge 徽标数"),
        "key": "badge"
    }, {
        "label": get_text("Calendar", "Calendar 日历"),
        "key": "calendar"
    }, {
        "label": get_text("Card", "Card 卡片"),
        "key": "card"
    }, {
        "label": get_text("Carousel", "Carousel 走马灯"),
        "key": "carousel"
    }, {
        "label": get_text("Collapse", "Collapse 折叠面板"),
        "key": "collapse"
    }, {
        "label": get_text("Descriptions", "Descriptions 描述列表"),
        "key": "descriptions"
    }, {
        "label": get_text("Empty", "Empty 空状态"),
        "key": "empty"
    }, {
        "label": get_text("Image", "Image 图片"),
        "key": "image"
    }, {
        "label": get_text("List", "List 列表"),
        "key": "list"
    }, {
        "label": get_text("Popover", "Popover 气泡卡片"),
        "key": "popover"
    }, {
        "label": get_text("QRCode", "QRCode 二维码"),
        "key": "qr_code"
    }, {
        "label": get_text("Segmented", "Segmented 分段控制器"),
        "key": "segmented"
    }, {
        "label": get_text("Statistic", "Statistic 统计数值"),
        "key": "statistic"
    }, {
        "label": get_text("Table", "Table 表格"),
        "key": "table"
    }, {
        "label": get_text("Tabs", "Tabs 标签页"),
        "key": "tabs"
    }, {
        "label": get_text("Tag", "Tag 标签"),
        "key": "tag"
    }, {
        "label": get_text("Timeline", "Timeline 时间轴"),
        "key": "timeline"
    }, {
        "label": get_text("Tooltip", "Tooltip 文字提示"),
        "key": "tooltip"
    }, {
        "label": get_text("Tour", "Tour 漫游式引导"),
        "key": "tour"
    }, {
        "label": get_text("Tree", "Tree 树形控件"),
        "key": "tree"
    }]
}, {
    "label":
    get_text("Feedback", "反馈"),
    "type":
    "group",
    "children": [{
        "label": get_text("Alert", "Alert 警告提示"),
        "key": "alert"
    }, {
        "label": get_text("Drawer", "Drawer 抽屉"),
        "key": "drawer"
    }, {
        "label": get_text("Message", "Message 全局提示"),
        "key": "message"
    }, {
        "label": get_text("Modal", "Modal 对话框"),
        "key": "modal"
    }, {
        "label": get_text("Notification", "Notification 通知提醒框"),
        "key": "notification"
    }, {
        "label": get_text("Popconfirm", "Popconfirm 气泡确认框"),
        "key": "popconfirm"
    }, {
        "label": get_text("Progress", "Progress 进度条"),
        "key": "progress"
    }, {
        "label": get_text("Result", "Result 结果"),
        "key": "result"
    }, {
        "label": get_text("Skeleton", "Skeleton 骨架屏"),
        "key": "skeleton"
    }, {
        "label": get_text("Spin", "Spin 加载中"),
        "key": "spin"
    }, {
        "label": get_text("Watermark", "Watermark 水印"),
        "key": "watermark"
    }]
}, {
    "label":
    get_text("Other", "其他"),
    "type":
    "group",
    "children": [{
        "label": get_text("Affix", "Affix 固钉"),
        "key": "affix"
    }, {
        "label": get_text("ConfigProvider", "ConfigProvider 全局化配置"),
        "key": "config_provider"
    }]
}]

antdx_menu_items = [{
    "label": get_text("Overview", "概览"),
    "key": "overview"
}, {
    "label":
    get_text("Common", "通用"),
    "type":
    "group",
    "children": [{
        "label": get_text("Bubble", "Bubble 对话气泡"),
        "key": "bubble"
    }, {
        "label": get_text("Conversations", "Conversations 管理对话"),
        "key": "conversations"
    }]
}, {
    "label":
    get_text("Wake", "唤醒"),
    "type":
    "group",
    "children": [{
        "label": get_text("Welcome", "Welcome 欢迎"),
        "key": "welcome"
    }, {
        "label": get_text("Prompts", "Prompts 提示集"),
        "key": "prompts"
    }]
}, {
    "label":
    get_text("Express", "表达"),
    "type":
    "group",
    "children": [{
        "label": get_text("Attachments", "Attachments 输入附件"),
        "key": "attachments"
    }]
}]


def logo():
    with antd.Flex(align='center', gap=8):
        antd.Image(os.path.join(os.path.dirname(__file__),
                                "./resources/modelscope.png"),
                   preview=False,
                   height=20,
                   elem_style=dict(width="auto"))
        ms.Span('✖️')
        antd.Image(os.path.join(os.path.dirname(__file__),
                                "./resources/gradio.png"),
                   preview=False,
                   height=40,
                   elem_style=dict(width="auto"))


def more_components():
    with antd.Button(type="link",
                     block=True,
                     href="https://ant.design/components/overview/",
                     href_target="_blank",
                     elem_style=dict(display="block",
                                     textAlign="left",
                                     whiteSpace="nowrap",
                                     textOverflow="ellipsis",
                                     overflow="hidden")):
        ms.Text(get_text("More Components", "更多组件"))

        with ms.Slot("icon"):
            antd.Icon("ExportOutlined", elem_style=dict(marginRight=4))


tabs = [
    {
        "label": get_text("Overview", "概览"),
        "key": "index",
        "default_active_key": "overview",
        "menus": index_menu_items
    },
    {
        "label": get_text("Base Components", "基础组件"),
        "key": "base",
        "default_active_key": "application",
        "menus": base_menu_items
    },
    {
        "label": get_text("Antd Components", "Antd 组件"),
        "key": "antd",
        "default_active_key": "overview",
        "menus": antd_menu_items,
        "extra_menu_footer": more_components
    },
    # {
    #     "label": get_text("Antdx Components", "Antdx 组件"),
    #     "key": "antdx",
    #     "default_active_key": "overview",
    #     "menus": antdx_menu_items,
    # },
    {
        "label": get_text("Version 0.x", "0.x 版本"),
        "key": "legacy",
        "content": legacy_demo
    },
]

site = Site(
    tabs=tabs,
    docs={
        # match the key of tabs
        "index": index_docs,
        "antd": antd_docs,
        # "antdx": antdx_docs,
        "base": base_docs
    },
    default_active_tab=default_active_tab,
    logo=logo)

demo = site.render()

if __name__ == "__main__":
    demo.queue().launch(ssr_mode=False)
