<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedTimePicker = importComponent(() => import('./time-picker'));

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
    value?: string | number;

    open_change?: any;
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
      open_change: 'openChange',
      calendar_change: 'calendarChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedTimePicker then TimePicker}
    <TimePicker
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-time-picker')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      value={proceedProps.additionalProps.value ?? proceedProps.value}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
    >
      {@render children?.()}
    </TimePicker>
  {/await}
{/if}
