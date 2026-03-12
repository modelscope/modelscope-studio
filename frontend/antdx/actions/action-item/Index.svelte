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

  const AwaitedActionsActionItem = importComponent(
    () => import('./actions.action-item')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
      index?: number;
    };
    actionRender?: string;
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

  const slots = getSlots();
  const itemProps = $derived({
    props: {
      style: proceedProps.elem_style,
      className: cls(
        proceedProps.elem_classes,
        'ms-gr-antdx-actions-action-item'
      ),
      id: proceedProps.elem_id,
      ...proceedProps.restProps,
      ...proceedProps.additionalProps,
      actionRender: createFunction(
        proceedProps.additionalProps.actionRender ||
          proceedProps.restProps.actionRender
      ),
    },
    slots: {
      ...slots.value,
      actionRender: {
        el: slots.value.actionRender,
        withParams: true,
        clone: true,
      },
    },
  });
</script>

{#if proceedProps.visible}
  {#await AwaitedActionsActionItem then ActionsActionItem}
    <ActionsActionItem
      {...itemProps.props}
      slots={itemProps.slots}
      itemIndex={proceedProps._internal.index || 0}
      itemSlotKey={slotKey?.value}
    >
      {@render children?.()}
    </ActionsActionItem>
  {/await}
{/if}
