<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedRangePicker = importComponent(
    () => import('./date-picker.range-picker')
  );

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;
    value?: [string | number | null, string | number | null];
    _internal: {
      layout?: boolean;
    };
    calendar_change?: any;
  }>(() => props);

  const getProceedProps = processProps(
    () => {
      const {
        visible,
        _internal,
        as_item,
        elem_classes,
        elem_id,
        elem_style,
        value,
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
      };
    },
    {
      calendar_change: 'calendarChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedRangePicker then RangePicker}
    <RangePicker
      style={proceedProps.elem_style}
      className={cls(
        proceedProps.elem_classes,
        'ms-gr-antd-date-picker-range-picker'
      )}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      value={proceedProps.additionalProps.value || proceedProps.value}
      slots={slots.value}
      onValueChange={(val) => {
        updateProps({ value: val });
      }}
    >
      {@render children?.()}
    </RangePicker>
  {/await}
{/if}
