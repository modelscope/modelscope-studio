<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import { setConfigType } from '@svelte-preprocess-react/provider';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import { XProvider as XXProvider } from '@ant-design/x';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedXProvider = importComponent(
    () => import('../../antd/config-provider/config-provider')
  );
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  export let _internal = {};

  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    visible,
    _internal,
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
    visible,
    _internal,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    restProps: $$restProps,
  });

  setConfigType('antd');
</script>

{#if $mergedProps.visible}
  {#await AwaitedXProvider then XProvider}
    <XProvider
      className={cls('ms-gr-antdx-x-provider', $mergedProps.elem_classes)}
      id={$mergedProps.elem_id}
      style={$mergedProps.elem_style}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      slots={$slots}
      component={XXProvider}
      themeMode={$mergedProps.gradio.theme}
      {setSlotParams}
    >
      <slot />
    </XProvider>
  {/await}
{/if}
