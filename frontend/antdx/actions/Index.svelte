<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedActions = importComponent(() => import('./actions'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    dropdown_open_change?: any;
    dropdown_menu_click?: any;
    dropdown_menu_deselect?: any;
    dropdown_menu_open_change?: any;
    dropdown_menu_select?: any;
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
      dropdown_open_change: 'dropdownProps_openChange',
      dropdown_menu_click: 'dropdownProps_menu_click',
      dropdown_menu_deselect: 'dropdownProps_menu_deselect',
      dropdown_menu_open_change: 'dropdownProps_menu_openChange',
      dropdown_menu_select: 'dropdownProps_menu_select',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedActions then Actions}
    <Actions
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antdx-actions')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
    >
      {@render children?.()}
    </Actions>
  {/await}
{/if}
