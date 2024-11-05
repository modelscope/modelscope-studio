# Lifecycle

A Lifecycle component for getting the current user's environment information.

- Get the current user's language, page theme, user agent, and screen state.
- Listen to page actions and trigger corresponding events (page loading, size changes, page closing, etc.).

## How to Use

### Basic Usage

<demo name="basic"></demo>

### Automatically Adapt to User Language Environment

<demo name="language_adaptation"></demo>

### Return Different Weighted Content Based on UI Theme

<demo name="theme_adaptation"></demo>

## API and Parameter List

### Value

Interface definition:

```python
class LifecycleScreenData(GradioModel):
    width: float
    height: float
    scrollX: float
    scrollY: float


class LifecycleData(GradioModel):
    screen: LifecycleScreenData
    language: str
    theme: str
    userAgent: str
```

### Props

This component does not support passing in props.

### Event Listeners

| Event                            | Description                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `mgr.Lifecycle.mount(fn, ···)`   | Triggered when the user's page loads. The EventData is a dictionary type value of the current component's value.        |
| `mgr.Lifecycle.unmount(fn, ···)` | Triggered when the user's page closes. The EventData is a dictionary type value of the current component's value.       |
| `mgr.Lifecycle.resize(fn, ···)`  | Triggered when custom labels trigger events. The EventData is a dictionary type value of the current component's value. |
