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

  const AwaitedAttachments = importComponent(() => import('./attachments'));
  export let gradio: Gradio;

  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any>;
  export let root: string;
  export let value: FileData[] = [];
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const [mergedProps, update] = getSlotContext(
    {
      gradio,
      props: $updatedProps,
      _internal,
      value,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      as_item,
      restProps: $$restProps,
    },
    {
      form_name: 'name',
    }
  );
  const setSlotParams = getSetSlotParamsFn();
  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    value,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    restProps: $$restProps,
  });
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedAttachments then Attachments}
    <Attachments
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antdx-attachments')}
      id={$mergedProps.elem_id}
      items={$mergedProps.value}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      onValueChange={(v) => {
        value = v;
      }}
      upload={async (files) => {
        return (
          (await gradio.client.upload(await prepare_files(files), root)) || []
        ).map((file, i) => {
          if (!file) {
            return file;
          }
          return {
            ...file,
            uid: files[i].uid,
          };
        });
      }}
      {setSlotParams}
    >
      <slot></slot>
    </Attachments>
  {/await}
{/if}

<style>
</style>
