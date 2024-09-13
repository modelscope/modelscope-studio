<svelte:options accessors={true} />

<script lang="ts">
  import Base from '../Base.svelte';
</script>

<Base {...$$props} component="content"><slot /></Base>

<style>
</style>
