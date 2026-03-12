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
  import { createFunction } from '@utils/createFunction';
  import cls from 'classnames';

  const AwaitedTourStep = importComponent(() => import('./tour.step'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    _internal: {};
    get_target?: string;
    next_button_click?: any;
    prev_button_click?: any;
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
        get_target,
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
        target: get_target,
      };
    },
    {
      next_button_click: 'nextButtonProps_click',
      prev_button_click: 'prevButtonProps_click',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#await AwaitedTourStep then TourStep}
  <TourStep
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-tour-step')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    slots={slots.value}
    target={createFunction(
      proceedProps.additionalProps.target || proceedProps.target
    ) ||
      proceedProps.additionalProps.target ||
      proceedProps.target}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </TourStep>
{/await}
