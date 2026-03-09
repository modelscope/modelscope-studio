<script lang="ts">
  import '@svelte-preprocess-react/inject';
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedApplication = importComponent(
    () => import('./Application.svelte')
  );

  const { children, ...props } = $props();
</script>

{#await AwaitedApplication then Application}
  <Application {...props}>
    {@render children?.()}
  </Application>
{/await}
