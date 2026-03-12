<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import {
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedRadioGroupOption = importComponent(
    () => import('./radio.group.option')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    value?: string;
    label?: string;
    disabled?: boolean;
    title?: string;
    required?: boolean;
    as_item?: string;
    _internal: {
      layout?: boolean;
      index?: number;
    };
  }>(() => props);
  const slotKey = getSlotKey();

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      value,
      label,
      disabled,
      title,
      required,
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
      value,
      label,
      disabled,
      title,
      required,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const itemProps = $derived({
    props: {
      style: proceedProps.elem_style,
      className: cls(
        proceedProps.elem_classes,
        'ms-gr-antd-radio-group-option'
      ),
      id: proceedProps.elem_id,
      value: proceedProps.value,
      label: proceedProps.label,
      disabled: proceedProps.disabled,
      title: proceedProps.title,
      required: proceedProps.required,
      ...proceedProps.restProps,
      ...proceedProps.additionalProps,
    },
    slots: slots.value,
  });
</script>

{#await AwaitedRadioGroupOption then RadioGroupOption}
  <RadioGroupOption
    {...itemProps.props}
    slots={itemProps.slots}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </RadioGroupOption>
{/await}
