<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type { Gradio } from '@gradio/utils';
  import { createFunction } from '@utils/createFunction';
  import { renderItems } from '@utils/renderItems';
  import { renderParamsSlot } from '@utils/renderParamsSlot';
  import { renderSlot } from '@utils/renderSlot';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import { getItems as getMenuItems } from '../../menu/context';
  import { getSetItemFn } from '../context';

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
    index?: number;
  } = {};
  export let title: string = '';
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  const slotKey = getSlotKey();

  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    title,
    restProps: $$restProps,
  });
  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    title,
    restProps: $$restProps,
  });
  const setItem = getSetItemFn();
  const setSlotParams = getSetSlotParamsFn();
  const {
    'menu.items': menuItems,
    'dropdownProps.menu.items': dropdownMenuItems,
  } = getMenuItems(['menu.items', 'dropdownProps.menu.items']);
  $: {
    const menu = {
      ...($mergedProps.props.menu || {}),
      items:
        $mergedProps.props.menu?.items || $menuItems.length > 0
          ? renderItems($menuItems)
          : undefined,
      expandIcon:
        renderParamsSlot(
          {
            setSlotParams,
            slots: $slots,
            key: 'menu.expandIcon',
          },
          {
            clone: true,
          }
        ) || $mergedProps.props.menu?.expandIcon,
      overflowedIndicator:
        renderSlot($slots['menu.overflowedIndicator']) ||
        $mergedProps.props.menu?.overflowedIndicator,
    };
    const dropdownMenu = {
      ...($mergedProps.props.dropdownProps?.menu || {}),
      items:
        $mergedProps.props.dropdownProps?.menu?.items ||
        $dropdownMenuItems.length > 0
          ? renderItems($dropdownMenuItems)
          : undefined,
      expandIcon:
        renderParamsSlot(
          {
            setSlotParams,
            slots: $slots,
            key: 'dropdownProps.menu.expandIcon',
          },
          {
            clone: true,
          }
        ) || $mergedProps.props.dropdownProps?.menu?.expandIcon,
      overflowedIndicator:
        renderSlot($slots['dropdownProps.menu.overflowedIndicator']) ||
        $mergedProps.props.dropdownProps?.menu?.overflowedIndicator,
    };

    const dropdownProps = {
      ...($mergedProps.props.dropdownProps || {}),
      dropdownRender: $slots['dropdownProps.dropdownRender']
        ? renderParamsSlot(
            {
              setSlotParams,
              slots: $slots,
              key: 'dropdownProps.dropdownRender',
            },
            {
              clone: true,
            }
          )
        : createFunction($mergedProps.props.dropdownProps?.dropdownRender),
      menu:
        Object.values(dropdownMenu).filter(Boolean).length > 0
          ? dropdownMenu
          : undefined,
    };
    const currentMergedProps = {
      ...$mergedProps,
      props: {
        ...$mergedProps.restProps,
        ...$mergedProps.props,
        title: $mergedProps.props.title || title,
        menu: Object.values(menu).filter(Boolean).length > 0 ? menu : undefined,
        dropdownProps:
          Object.values(dropdownProps).filter(Boolean).length > 0
            ? dropdownProps
            : undefined,
      },
    };

    setItem($slotKey, $mergedProps._internal.index || 0, {
      props: {
        style: $mergedProps.elem_style,
        className: cls($mergedProps.elem_classes, 'ms-gr-antd-breadcrumb-item'),
        id: $mergedProps.elem_id,
        ...currentMergedProps.props,
        ...bindEvents(currentMergedProps),
      },
      slots: {
        title: $slots.title,
      },
    });
  }
</script>

{#if $mergedProps.visible}
  <slot></slot>
{/if}

<style>
</style>
