<svelte:options accessors={true} />

<script lang="ts">
  import Base from '../Base.svelte';

  export let value = '';
</script>

<Base {...$$props} {value} component="title"><slot /></Base>

<style>
</style>
