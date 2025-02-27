from typing import Literal, Union


def resolve_frontend_dir(component: str,
                         sub_component: Union[str, list, tuple] = None,
                         type: Literal['antd', 'antdx', 'base',
                                       "pro"] = 'antd'):
    if isinstance(sub_component, list) or isinstance(sub_component, tuple):
        dir = ''
        for c in sub_component:
            dir = dir + f"/{c}"
        return f"{'../' * len(sub_component)}../../../../../frontend/{type}/{component}{dir}"

    if (sub_component):
        return f"../../../../../../frontend/{type}/{component}/{sub_component}"
    return f"../../../../../frontend/{type}/{component}"
