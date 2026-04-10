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

  const AwaitedBubbleListRole = importComponent(
    () => import('./bubble.list.role')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      index?: boolean;
    };
    typing_complete?: any;
    edit_confirm?: any;
    edit_cancel?: any;
    editable?: any;
    content?: string;
    loadingRender?: string;
    contentRender?: string;
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
      typing_complete: 'typingComplete',
      edit_confirm: 'editConfirm',
      edit_cancel: 'editCancel',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
  const itemProps = $derived.by(() => {
    const editable =
      proceedProps.additionalProps.editable || proceedProps.restProps.editable;
    return {
      props: {
        style: proceedProps.elem_style,
        className: cls(
          proceedProps.elem_classes,
          'ms-gr-antdx-bubble-list-role'
        ),
        id: proceedProps.elem_id,
        ...proceedProps.restProps,
        ...proceedProps.additionalProps,
        editable:
          typeof editable === 'boolean'
            ? {
                editing: editable,
              }
            : editable,
        content:
          proceedProps.additionalProps.content ||
          proceedProps.restProps.content ||
          '',
        loadingRender: createFunction(
          proceedProps.additionalProps.loadingRender ||
            proceedProps.restProps.loadingRender
        ),
        contentRender: createFunction(
          proceedProps.additionalProps.contentRender ||
            proceedProps.restProps.contentRender
        ),
      },
      slots: {
        ...slots.value,
        loadingRender: {
          el: slots.value.loadingRender,
          clone: true,
          withParams: true,
        },
        avatar: {
          el: slots.value.avatar,
          clone: true,
          withParams: true,
        },
        header: {
          el: slots.value.header,
          clone: true,
          withParams: true,
        },
        footer: {
          el: slots.value.footer,
          clone: true,
          withParams: true,
        },
        extra: {
          el: slots.value.extra,
          clone: true,
          withParams: true,
        },
        contentRender: {
          el: slots.value.contentRender,
          clone: true,
          withParams: true,
        },
      },
    };
  });
</script>

{#await AwaitedBubbleListRole then BubbleListRole}
  <BubbleListRole
    {...itemProps.props}
    slots={itemProps.slots}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </BubbleListRole>
{/await}
