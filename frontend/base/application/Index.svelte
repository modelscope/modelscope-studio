<svelte:options accessors={true} />

<script lang="ts">
  import '@svelte-preprocess-react/inject';
  import { importComponent } from '@svelte-preprocess-react/component';

  const awaitedApplication = importComponent(
    () => import('./Application.svelte')
  );
  $: application_props = $$props as any;
</script>

{#await awaitedApplication then Application}
  <Application {...application_props}>
    <slot></slot>
  </Application>
{/await}
