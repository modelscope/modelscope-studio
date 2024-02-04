<script lang="ts">
  import {
    type CustomComponents,
    type CustomData,
    Markdown,
  } from '@modelscope-studio/compiled';
  import { createEventDispatcher } from 'svelte';

  export let elem_classes: string[] = [];
  export let visible = true;
  export let value: string;
  export let min_height = false;
  export let rtl = false;
  export let theme: string = 'light';
  export let sanitize_html = true;
  export let line_breaks = false;
  export let latex_delimiters: {
    left: string;
    right: string;
    display: boolean;
  }[];
  export let header_links = false;
  export let preview = true;
  export let enable_base64 = false;
  export let custom_components: CustomComponents = {};

  const dispatch = createEventDispatcher<{
    change: undefined;
    custom: CustomData;
  }>();

  function on_custom(tag: string, tag_index: number, v?: any) {
    dispatch('custom', { tag, tag_index, value: v });
  }

  $: value, dispatch('change');
</script>

<div
  class:min={min_height}
  class={elem_classes.join(' ')}
  class:hide={!visible}
  dir={rtl ? 'rtl' : 'ltr'}
>
  <Markdown
    {custom_components}
    {enable_base64}
    {preview}
    text={value}
    {latex_delimiters}
    {sanitize_html}
    {line_breaks}
    {header_links}
    {theme}
    {on_custom}
  />
</div>

<style>
  div :global(.math.inline) {
    fill: var(--body-text-color);
    display: inline-block;
    vertical-align: middle;
    padding: var(--size-1-5) -var(--size-1);
    color: var(--body-text-color);
  }

  div :global(.math.inline svg) {
    display: inline;
    margin-bottom: 0.22em;
  }

  div {
    max-width: 100%;
  }

  .min {
    min-height: var(--size-24);
  }
  .hide {
    display: none;
  }
</style>
