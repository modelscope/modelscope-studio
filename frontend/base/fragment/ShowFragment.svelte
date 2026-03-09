<script lang="ts">
  import type { Snippet } from 'svelte';

  import Fragment from './Index.svelte';

  const {
    show = false,
    children,
    ...restProps
  }: {
    show?: boolean;
    children?: Snippet;
  } = $props();
</script>

{#if show}
  <Fragment {...restProps}>
    {@render children?.()}
  </Fragment>
{:else}
  {@render children?.()}
{/if}
