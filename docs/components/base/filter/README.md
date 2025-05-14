# Filter

An auxiliary rendering component that needs to be used in conjunction with the `Each` component to filter context information within the `Each` component.

The `as_item` parameter of this component behaves differently; it passes down the filtered context information as a base, making it suitable for use across multiple module components within an `Each` component iteration.

Additionally, you can pass the `params_mapping` parameter, which allows users to customize the filtering of context information through a JavaScript function.

If no parameters are provided, this component will block the context transmission of the `Each` component, making attribute overrides ineffective.

## Examples

<demo name="basic"></demo>
<demo name="use_as_item" title="Using the as_item Parameter"></demo>
<demo name="use_params_mapping" title="Using the params_mapping Parameter"></demo>

## API

| Property       | Type | Default Value | Description                                                                                                                                  |
| -------------- | ---- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| params_mapping | str  | None          | This value is a string of a Javascript function, allowing users to customize the filtering of context information via a JavaScript function. |
