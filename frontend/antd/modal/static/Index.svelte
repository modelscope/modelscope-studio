<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedModalStatic = importComponent(() => import('./modal.static'));

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
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
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#await AwaitedModalStatic then ModalStatic}
  <ModalStatic
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-modal-static')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    slots={slots.value}
    visible={proceedProps.visible as boolean}
    onVisible={(v) => {
      updateProps({ visible: v });
    }}
  >
    {@render children?.()}
  </ModalStatic>
{/await}
