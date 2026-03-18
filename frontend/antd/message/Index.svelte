<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedMessage = importComponent(() => import('./message'));

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;

    _internal: {
      layout?: boolean;
    };
    key?: string;
    content?: string;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      content,
      ...restProps
    } = getComponentProps();
    return {
      gradio,
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      content,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#await AwaitedMessage then Message}
  <Message
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-message')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    content={proceedProps.additionalProps.content || proceedProps.content}
    slots={slots.value}
    messageKey={proceedProps.additionalProps.key || proceedProps.restProps.key}
    visible={proceedProps.visible as boolean}
    onVisible={(v) => {
      updateProps({
        visible: v,
      });
    }}
  >
    {@render children?.()}
  </Message>
{/await}
