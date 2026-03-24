<script lang="ts">
  import type { Snippet } from 'svelte';

  import Base from '../Base.svelte';

  const { children, ...restProps }: { children?: Snippet } = $props();
</script>

<Base {...restProps} component="text">
  {@render children?.()}
</Base>
