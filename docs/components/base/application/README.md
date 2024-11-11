# Application

The root component of the application, this component contains all the component dependencies of `modelscope_studio`. It is necessary to ensure that all components exported from `modelscope_studio` are wrapped by it, otherwise the page will not be successfully previewed.

In addition, this component can also listen to the lifecycle of the user's page and obtain the current user's environment information, you can:

- Obtain the current user's language, page theme, user agent, and screen status.
- Listen to page behaviors and trigger corresponding events (page loading, size changes, page closing, etc.).

In addition, this component provides the `custom` event, you can send events to the Python side by calling `window.ms_globals.dispatch` in any Javascript function, and receive the events on the Python side through the `ms.Application.custom` event.

## Examples

<demo name="basic"></demo>

<demo name="language_adaptation" title="Automatically adapt to user language environment"></demo>

<demo name="theme_adaptation" title="Return different weighted content based on user interface theme"></demo>

<demo name="custom_event" title="Send custom events"></demo>
