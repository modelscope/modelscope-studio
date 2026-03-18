<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedColorPicker = importComponent(() => import('./color-picker'));

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
    value?: string | { color: string; percent: number }[];
    value_format?: 'rgb' | 'hex' | 'hsb';

    change_complete?: any;
    open_change?: any;
    format_change?: any;
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
        value_format,
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
        value_format,
      };
    },
    {
      change_complete: 'changeComplete',
      open_change: 'openChange',
      format_change: 'formatChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const value_format = $derived(proceedProps.value_format || 'hex');
</script>

{#if proceedProps.visible}
  {#await AwaitedColorPicker then ColorPicker}
    <ColorPicker
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-color-picker')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      value={proceedProps.additionalProps.value ??
        proceedProps.value ??
        undefined}
      {value_format}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
    >
      {@render children?.()}
    </ColorPicker>
  {/await}
{/if}
