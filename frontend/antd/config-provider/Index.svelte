<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import type React from 'react';
  import cls from 'classnames';
  import { setConfigType } from '@svelte-preprocess-react/svelte-contexts/config.svelte';

  const AwaitedConfigProvider = importComponent(
    () => import('./config-provider')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props: Record<string, any>;
    elem_style: React.CSSProperties;
    as_item?: string | undefined;
  }>(() => props);

  const getProceedProps = processProps(() => {
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
      additionalProps: getAdditionalProps(),
      gradio,
      _internal,
      as_item,
      restProps,
      visible,
      elem_id,
      elem_classes,
      elem_style,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
  setConfigType(() => 'antd');
</script>

{#if proceedProps.visible}
  {#await AwaitedConfigProvider then ConfigProvider}
    <ConfigProvider
      className={cls('ms-gr-antd-config-provider', proceedProps.elem_classes)}
      id={proceedProps.elem_id}
      style={proceedProps.elem_style}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      themeMode={proceedProps.gradio.shared.theme}
    >
      {@render children()}
    </ConfigProvider>
  {/await}
{/if}
