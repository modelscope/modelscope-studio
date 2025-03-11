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

  import type { ChatbotMessages } from './type';

  const AwaitedChatbot = importComponent(() => import('./chatbot'));
  export let value: ChatbotMessages = [];
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let as_item: string | undefined;
  export let root: string;
  export let proxy_url: string;
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
</script>

{#if $mergedProps.visible}
  {#await AwaitedChatbot then Chatbot}
    <Chatbot
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes)}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        suggestion_select: 'suggestionSelect',
        welcome_prompt_select: 'welcomePromptSelect',
      })}
      value={$mergedProps.value}
      onValueChange={(v) => {
        value = v;
      }}
      urlRoot={root}
      urlProxyUrl={proxy_url}
      themeMode={gradio.theme}
      slots={$slots}
    >
      <slot></slot>
    </Chatbot>
  {/await}
{/if}

<style>
</style>
