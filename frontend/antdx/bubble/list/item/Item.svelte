<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import { createFunction } from '@utils/createFunction';
  import { renderSlot } from '@utils/renderSlot';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedBubbleListItem = importComponent(
    () => import('./bubble.list.item')
  );
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any> = {};
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
    restProps: $$restProps,
  });
  const setSlotParams = getSetSlotParamsFn();
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
    restProps: $$restProps,
  });

  let itemProps = {
    props: {},
    slots: {},
  };

  $: {
    let avatar = $mergedProps.props.avatar || $mergedProps.restProps.avatar;
    if ($slots.avatar) {
      avatar = renderSlot($slots.avatar);
    } else if ($slots['avatar.icon'] || $slots['avatar.src']) {
      avatar = {
        ...(avatar || {}),
        icon: $slots['avatar.icon']
          ? renderSlot($slots['avatar.icon'])
          : avatar?.icon,
        src: $slots['avatar.src']
          ? renderSlot($slots['avatar.src'])
          : avatar?.src,
      };
    }

    itemProps = {
      props: {
        style: $mergedProps.elem_style,
        className: cls(
          $mergedProps.elem_classes,
          'ms-gr-antdx-bubble-list-role'
        ),
        id: $mergedProps.elem_id,
        ...$mergedProps.restProps,
        ...$mergedProps.props,
        ...bindEvents($mergedProps, {
          typing_complete: 'typingComplete',
        }),
        avatar,
        loadingRender: createFunction(
          $mergedProps.props.loadingRender ||
            $mergedProps.restProps.loadingRender
        ),
        messageRender: createFunction(
          $mergedProps.props.messageRender ||
            $mergedProps.restProps.messageRender
        ),
      },
      slots: {
        ...$slots,
        avatar: undefined,
        'avatar.icon': undefined,
        'avatar.src': undefined,
        header: {
          el: $slots.header,
          callback: setSlotParams,
        },
        footer: {
          el: $slots.footer,
          callback: setSlotParams,
        },
        loadingRender: {
          el: $slots.loadingRender,
          callback: setSlotParams,
        },
        messageRender: {
          el: $slots.messageRender,
          callback: setSlotParams,
        },
      },
    };
  }
</script>

{#await AwaitedBubbleListItem then BubbleListItem}
  <BubbleListItem
    {...itemProps.props}
    slots={itemProps.slots}
    itemIndex={$mergedProps._internal.index || 0}
    itemSlotKey={$slotKey}
  >
    {#if $mergedProps.visible}
      <slot></slot>
    {/if}
  </BubbleListItem>
{/await}
