# Slot

A slot component that needs to be used with other components in `modelscope_studio`. You can pass in a specified slot name to insert this component into the specified position of the target component.

The slots of components in `modelscope_studio` can be viewed by getting the `SLOTS` property.

## Examples

<demo name="basic"></demo>

## API

| Attribute      | Type | Default Value | Description                                                                                                                                                                                                                    |
| -------------- | ---- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| value          | str  | None          | Slot name                                                                                                                                                                                                                      |
| params_mapping | str  | None          | This value is a string of a Javascript function. When the corresponding slot can accept parameters, the parameters can be mapped to the slot context through this parameter, please refer to the `Each` component for details. |
