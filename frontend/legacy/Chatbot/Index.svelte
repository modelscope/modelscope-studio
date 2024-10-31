<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const awaitedChatbot = importComponent(() => import('./Awaited.svelte'));
  $: args = $$props as any;
</script>

{#await awaitedChatbot then Chatbot}
  <Chatbot {...args}>
    <slot></slot>
  </Chatbot>
{/await}
