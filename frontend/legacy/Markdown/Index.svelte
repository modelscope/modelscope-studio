<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedMarkdown = importComponent(() => import('./Awaited.svelte'));
  $: args = $$props as any;
  export let value: any;
</script>

{#await AwaitedMarkdown then Markdown}
  <Markdown {...args} {value}>
    <slot></slot>
  </Markdown>
{/await}
