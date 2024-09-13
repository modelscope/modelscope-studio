<svelte:options accessors={true} />

<script lang="ts">
  import '@svelte-preprocess-react/inject';
  import type { Gradio } from '@gradio/utils';
  import { onMount } from 'svelte';

  export let gradio: Gradio<{
    custom: any;
  }>;
  export let visible = true;

  onMount(() => {
    window.ms_globals.dispatch = (...args) => {
      gradio.dispatch('custom', args);
    };
  });
</script>

{#if visible}
  <div class="ms-gr-antd-container">
    <slot />
  </div>
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
