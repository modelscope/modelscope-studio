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

  const AwaitedCollapseItem = importComponent(() => import('./collapse.item'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    _internal: {
      layout?: boolean;
      index?: number;
    };
    item_click?: any;
  }>(() => props);
  const slotKey = getSlotKey();

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
      item_click: 'itemClick',
    }
  );
  const proceedProps = $derived(getProceedProps());

  let slot = $state<HTMLElement>();

  const slots = getSlots();
</script>

{#await AwaitedCollapseItem then CollapseItem}
  <CollapseItem
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-collapse-item')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    slots={{
      children: slot,
      ...slots.value,
      label: {
        el: slots.value.label,
        clone: true,
      },
      extra: {
        el: slots.value.extra,
        clone: true,
      },
    }}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
  >
    {#if proceedProps.visible}
      <svelte-slot bind:this={slot}>
        {@render children?.()}
      </svelte-slot>
    {/if}
  </CollapseItem>
{/await}

<style>
  svelte-slot {
    display: none;
  }
</style>
