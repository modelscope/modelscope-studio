---
'@modelscope-studio/antd': patch
'modelscope_studio': patch
---

feat: sync antd APIs from 6.4.2 to 6.6.0

- New `clear` event on `DatePicker`, `DatePicker.RangePicker`, `TimePicker`, `TimePicker.RangePicker`
- New props: `Modal.scroll_lock` / `Modal.Static.scroll_lock`, `Steps.max_count`, `FloatButton.BackTop.show_progress`, `Mentions.popup_render`
- New slots: `Tabs` `more.popupRender`, `Pagination` / `Table` `components.sizeChanger`
- `Slider.disabled` accepts a list, `Watermark.content` accepts per-line font styles, `Select.token_separators` accepts a JS function string
- `Dropdown` / `Dropdown.Button` `placement` completed to the full set
- `ConfigProvider` new locale `sq_AL`
- Add `Input.Password.visibility_toggle` (with `visiable_toggle` kept as a compatibility alias)
- Fix a missing comma in `Table` `SLOTS` that dropped one slot
