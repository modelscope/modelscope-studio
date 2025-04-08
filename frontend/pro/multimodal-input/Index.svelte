<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import { type FileData, prepare_files } from '@gradio/client';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import type { MultimodalInputValue } from './multimodal-input';

  const AwaitedMultimodalInput = importComponent(
    () => import('./multimodal-input')
  );

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};
  export let root: string;
  export let value: MultimodalInputValue;
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
    value,
    restProps: $$restProps,
  });
  const upload = async (files: File[]) => {
    return (
      ((await gradio.client.upload(
        await prepare_files(files),
        root
      )) as FileData[]) || []
    );
  };
</script>

{#if $mergedProps.visible}
  {#await AwaitedMultimodalInput then MultimodalInput}
    <MultimodalInput
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-pro-multimodal-input')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        key_press: 'keyPress',
        paste_file: 'pasteFile',
        key_down: 'keyDown',
      })}
      slots={$slots}
      value={$mergedProps.props.value ?? $mergedProps.value}
      {setSlotParams}
      onValueChange={(v) => {
        value = v;
      }}
      {upload}
    >
      <slot></slot>
    </MultimodalInput>
  {/await}
{/if}
