<svelte:options accessors={true} />

<script lang="ts">
  import Fragment from './Index.svelte';

  export let show: boolean | undefined = false;
</script>

{#if show}
  <Fragment {...$$restProps}>
    <slot />
  </Fragment>
{:else}
  <slot />
{/if}
