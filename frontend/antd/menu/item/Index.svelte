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

  const AwaitedMenuItem = importComponent(() => import('./menu.item'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    _internal: {
      layout?: boolean;
      index?: number;
    };
    title_click?: any;
    theme_value?: any;
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
        theme_value,
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
        theme: theme_value,
      };
    },
    {
      title_click: 'titleClick',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#await AwaitedMenuItem then MenuItem}
  <MenuItem
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-menu-item')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    theme={proceedProps.additionalProps.theme || proceedProps.theme}
    slots={{
      ...slots.value,
      icon: {
        el: slots.value.icon,
        clone: true,
      },
    }}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </MenuItem>
{/await}
