<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlots } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import { initCDNLoader, initLocalLoader } from './loader';

  const AwaitedMonacoEditor = importComponent(() => import('./monaco-editor'));

  export let value: string | undefined;
  export let _loader: {
    mode?: 'cdn' | 'local';
    cdn_url?: string;
  };
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    value,
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
    value,
    restProps: $$restProps,
  });
  // define this method outside of the $ block to avoid re-rendering
  const onValueChange = (v: string | undefined) => {
    value = v;
  };

  $: editorProps = {
    style: $mergedProps.elem_style,
    className: cls($mergedProps.elem_classes, 'ms-gr-pro-monaco-editor'),
    id: $mergedProps.elem_id,
    ...$mergedProps.restProps,
    ...$mergedProps.props,
    ...bindEvents($mergedProps),
    onValueChange,
    value: $mergedProps.value,
    slots: $slots,
    themeMode: gradio.theme,
  };

  $: mode = _loader?.mode;
  $: cdn_url = _loader?.cdn_url;

  $: awaitedLoader =
    mode === 'local'
      ? initLocalLoader()
      : cdn_url
        ? initCDNLoader(cdn_url)
        : undefined;
</script>

{#if $mergedProps.visible}
  {#await awaitedLoader then}
    {#await AwaitedMonacoEditor then MonacoEditor}
      <MonacoEditor {...editorProps}>
        <slot></slot>
      </MonacoEditor>
    {/await}
  {/await}
{/if}
