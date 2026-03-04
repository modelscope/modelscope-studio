<script lang="ts">
  import '@svelte-preprocess-react/inject';
  import { importComponent } from '@svelte-preprocess-react/component';

  const awaitedApplication = importComponent(
    () => import('./Application.svelte')
  );

  const { children, ...props } = $props();
</script>

{#await awaitedApplication then Application}
  <Application {...props}>
    {@render children()}
  </Application>
{/await}
