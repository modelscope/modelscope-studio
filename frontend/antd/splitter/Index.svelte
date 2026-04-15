<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedSplitter = importComponent(() => import('./splitter'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };

    resize_start?: any;
    resize_end?: any;
    dragger_double_click?: any;
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
      resize_start: 'resizeStart',
      resize_end: 'resizeEnd',
      dragger_double_click: 'draggerDoubleClick',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedSplitter then Splitter}
    <Splitter
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-splitter')}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
    >
      {@render children?.()}
    </Splitter>
  {/await}
{/if}
