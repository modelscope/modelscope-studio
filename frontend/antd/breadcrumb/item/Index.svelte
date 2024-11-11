<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import type { Gradio } from '@gradio/utils';

  const AwaitedBreadcrumbItem = importComponent(
    () => import('./BreadcrumbItem.svelte')
  );

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  export let title: string = '';
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
</script>

{#await AwaitedBreadcrumbItem then BreadcrumbItem}
  <BreadcrumbItem
    {...$$props}
    {gradio}
    {props}
    {as_item}
    {title}
    {visible}
    {elem_id}
    {elem_classes}
    {elem_style}
  >
    <slot></slot>
  </BreadcrumbItem>
{/await}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
