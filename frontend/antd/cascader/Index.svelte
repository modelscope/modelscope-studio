<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedCascader = importComponent(() => import('./cascader'));

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    value?: string[] | number[];
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    dropdown_visible_change?: any;
    popup_visible_change?: any;
    load_data?: any;
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
    },
    {
      dropdown_visible_change: 'dropdownVisibleChange',
      popup_visible_change: 'popupVisibleChange',
      load_data: 'loadData',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedCascader then Cascader}
    <Cascader
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-cascader')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
    >
      {@render children?.()}
    </Cascader>
  {/await}
{/if}
