<svelte:options accessors={true} />

<script lang="ts">
  import Base from '../Base.svelte';

  export let value = '';
</script>

<Base {...$$props} {value} component="link"><slot /></Base>

<style>
</style>
