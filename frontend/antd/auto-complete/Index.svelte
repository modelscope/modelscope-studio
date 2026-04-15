<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedAutoComplete = importComponent(() => import('./auto-complete'));

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;
    value: string;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    dropdown_visible_change?: any;
    popup_visible_change?: any;
    show_search_search?: any;
  }>(() => props);

  const getProceedProps = processProps(
    () => {
      const {
        visible,
        _internal,
        as_item,
        value,
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
        value,
        visible,
        elem_id,
        elem_classes,
        elem_style,
      };
    },
    {
      dropdown_visible_change: 'dropdownVisibleChange',
      popup_visible_change: 'popupVisibleChange',
      show_search_search: 'showSearch_search',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedAutoComplete then AutoComplete}
    <AutoComplete
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-auto-complete')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      value={proceedProps.additionalProps.value ?? proceedProps.value}
      slots={slots.value}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
    >
      {@render children?.()}
    </AutoComplete>
  {/await}
{/if}

<style>
</style>
