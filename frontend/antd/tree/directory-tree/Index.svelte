<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedDirectoryTree = importComponent(() => import('../tree'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {};

    drag_end?: any;
    drag_enter?: any;
    drag_leave?: any;
    drag_over?: any;
    drag_start?: any;
    right_click?: any;
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
      drag_end: 'dragEnd',
      drag_enter: 'dragEnter',
      drag_leave: 'dragLeave',
      drag_over: 'dragOver',
      drag_start: 'dragStart',
      right_click: 'rightClick',
      load_data: 'loadData',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedDirectoryTree then DirectoryTree}
    <DirectoryTree
      style={proceedProps.elem_style}
      className={cls(
        proceedProps.elem_classes,
        'ms-gr-antd-tree-directory-tree'
      )}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      directory
    >
      {@render children?.()}
    </DirectoryTree>
  {/await}
{/if}
