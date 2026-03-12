<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';
  import type { Snippet } from 'svelte';

  const AwaitedTypographyBase = importComponent(
    () => import('./typography.base')
  );

  const props: {
    component: 'text' | 'title' | 'paragraph' | 'link';
    children?: Snippet;
  } = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    value?: string;
    href_target?: string;
    ellipsis_tooltip_open_change?: any;
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
        value,
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
        value,
      };
    },
    {
      href_target: 'target',
      ellipsis_tooltip_open_change: 'ellipsis_tooltip_openChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedTypographyBase then TypographyBase}
    <TypographyBase
      component={props.component}
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes)}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      value={proceedProps.additionalProps.value ?? proceedProps.value}
      slots={slots.value}
    >
      {#if proceedProps._internal.layout}
        {@render children?.()}
      {:else}
        {proceedProps.value}
      {/if}
    </TypographyBase>
  {/await}
{/if}
