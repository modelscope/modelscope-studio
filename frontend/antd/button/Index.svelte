<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import type React from 'react';
  import cls from 'classnames';

  const AwaitedButton = importComponent(() => import('./button'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props: Record<string, any>;
    value: string | undefined;
    elem_style: React.CSSProperties;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    href_target?: string;
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
        additionalProps: getAdditionalProps(),
        gradio,
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
      href_target: 'target',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if proceedProps.visible}
  {#await AwaitedButton then Button}
    <Button
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-button')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      value={proceedProps.value}
    >
      {@render children()}
    </Button>
  {/await}
{/if}
