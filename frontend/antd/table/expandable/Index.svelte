<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import type { Gradio } from '@gradio/utils';

  const AwaitedExpandable = importComponent(
    () => import('./Expandable.svelte')
  );

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
</script>

{#await AwaitedExpandable then Expandable}
  <Expandable
    {...$$props}
    {gradio}
    {props}
    {as_item}
    {visible}
    {elem_id}
    {elem_classes}
    {elem_style}
  >
    <slot></slot>
  </Expandable>
{/await}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
