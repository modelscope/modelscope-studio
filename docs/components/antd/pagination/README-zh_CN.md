# Pagination

A long list can be divided into several pages, and only one page will be loaded at a time. See [Ant Design](https://ant.design/components/pagination/) for more information.

## Examples

<demo name="basic"></demo>

### Data Changes

The `Pagination` component is not designed as a data component and cannot be placed in the inputs of other events, but you can get the changed value of the pagination through the pagination change event. If you need to persist the page data, you can save it to `gr.State`

<demo name="data_changes">
