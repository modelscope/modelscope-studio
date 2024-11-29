# AutoLoading

Automatically adds loading animations to the wrapped content when requests are sent from the `Gradio` frontend. This component will automatically collect the loading states of child components, it's recommended to use this component at least once globally to provide fallback loading feedback.

> **Note:** If there are multiple nested `AutoLoading` components, only the innermost `AutoLoading` can collect the loading states of child components and display the loading animation.

In `Gradio`, there are 4 states for requests from the frontend to the backend:

- `pending`: The frontend has sent a request but has not yet received a response from the backend.
- `generating`: The frontend has received a response, but the backend has not completed sending all content (this state does not necessarily occur and only exists when the backend's processing function uses `yield` to return values).
- `completed`: The backend has returned all content, and the request has ended.
- `error`: An error occurred during the request.

By default, the `AutoLoading` component will:

- Add a loading animation when the request status is `pending`.
- End the loading animation when the request status is `generating`. At this point, users can manually control the application's loading effect, or you can set `generating=True` to continue displaying the animation.
- End the loading animation when the request status is `completed`.
- End the loading animation when the request status is `error`. You can set `show_error=True` to display error information to the user (this information will be centered on the page).

## Examples

<demo name="basic"></demo>

<demo name="nested" title="Nested AutoLoading"></demo>

## API

| Attribute    | Type | Default Value | Description                                                                                                                                  |
| ------------ | ---- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| generating   | bool | False         | Whether to include handling of the `generating` state                                                                                        |
| show_error   | bool | True          | Whether to display error information                                                                                                         |
| show_mask    | bool | True          | Whether to display the mask                                                                                                                  |
| show_timer   | bool | True          | Whether to display the timer                                                                                                                 |
| loading_text | str  | None          | Loading text, if not filled, it will use the loading text provided by `Gradio` (including loading time, current user's queue position, etc.) |
