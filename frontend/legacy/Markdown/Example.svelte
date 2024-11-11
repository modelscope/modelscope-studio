<script lang="ts">
  import {
    type CustomComponents,
    Markdown,
  } from '@modelscope-studio/legacy-compiled';

  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  export let value: string;
  export let type: 'gallery' | 'table';
  export let selected = false;
  export let preview: boolean;
  export let enable_base64 = false;
  export let custom_components: CustomComponents = {};
  export let sanitize_html: boolean;
  export let line_breaks: boolean;
  export let enable_latex: boolean;
  export let latex_single_dollar_delimiter: boolean;
</script>

<div
  class:table={type === 'table'}
  class:gallery={type === 'gallery'}
  class:selected
>
  <Markdown
    {preview}
    {enable_base64}
    {custom_components}
    text={value}
    {theme}
    disabled={true}
    {enable_latex}
    {latex_single_dollar_delimiter}
    {sanitize_html}
    {line_breaks}
  />
</div>

<style>
  .gallery {
    padding: var(--size-1) var(--size-2);
  }
</style>
