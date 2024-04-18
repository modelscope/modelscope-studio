# Markdown

Upgraded gradio Markdown.

- Supports output of multimodal content (audio, video, image, text)
- Built-in tags (chart, select-box, accordion)
- Supports custom rendering components and interaction with Python events

## How to Use

### Basic Usage

<demo name="basic"></demo>

### Multimodal & Support for Local File Display

<demo name="multimodal"></demo>

### Support for Accordion Content Display

Include the `accordion` tag in the returned content. For more usage details, see <tab-link tab="custom_tags/accordion">accordion</tab-link>
<demo name="accordion"></demo>

### Support for User Selection Interaction

Include the `select-box` tag in the returned content. For more usage details, see <tab-link tab="custom_tags/select-box">select-box</tab-link>
<demo name="select-box"></demo>

### Support for Chart Display

Include the `chart` tag in the returned content. For more usage details, see <tab-link tab="custom_tags/chart">chart</tab-link>
<demo name="chart"></demo>

### Custom Tags (Advanced Usage, Requires Frontend Knowledge)

<demo name="custom-tag"></demo>

#### Import JS

<demo name="custom-tag2"></demo>
The template can only perform simple variable replacements. If you want to introduce more custom behaviors, such as conditional judgments, loop rendering, etc., please use js to control the element for processing. Here is a simple example:
<demo name="custom-tag3">
<demo-suffix>
custom_select.js

```js
<file src="../resources/custom_components/custom_select.js"></file>
```

</demo-suffix>
</demo>

#### Interaction with Python

In js, you can use `cc.dispatch` to trigger the `custom` event listened to on the Python side. Taking the previous custom_select.js as an example, when we call `cc.dispatch(options[i])` on the frontend, a notification will be sent to the Python side simultaneously.
<demo name="custom-tag4"></demo>

## API and Parameter List

The following APIs are additional extended parameters beyond the original gradio Markdown.

### props

| Attribute                     | Type                                                                | Default Value | Description                                                                                                |
| ----------------------------- | ------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| enable_base64                 | bool                                                                | False         | Whether to support rendering content as base64, since rendering base64 is unsafe, the default is False.    |
| preview                       | bool                                                                | True          | Whether to enable image preview functionality.                                                             |
| enable_latex                  | bool                                                                | True          | Whether to enable LaTeX rendering.                                                                         |
| latex_single_dollar_delimiter | bool                                                                | True          | Whe ther to enable single dollar delimiter `$` for LaTeX rendering.                                        |
| custom_components             | Dict[str, CustomComponentDict] CustomComponentDict definition below | None          | Supports user-defined custom tags and controls tag rendering styles and triggers Python events through js. |
|                               |

**CustomComponent definition is as follows:**

```python
class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]
```

### Built-in Custom Tags

- <tab-link tab="custom_tags/select-box">select-box</tab-link>
- <tab-link tab="custom_tags/accordion">accordion</tab-link>
- <tab-link tab="custom_tags/chart">chart</tab-link>

### Event Listeners

| Event                          | Description                                                                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mgr.Markdown.custom(fn, ···)` | Triggered when a custom tag event occurs. EventData is: <br/> - tag: The current tag that triggered the event.<br/> - tag_index: The index of the current triggered tag.<br/> - value: The custom value passed in. |
