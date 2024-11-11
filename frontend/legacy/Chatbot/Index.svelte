<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedChatbot = importComponent(() => import('./Awaited.svelte'));
  export let value: any;
  $: args = $$props as any;
</script>

{#await AwaitedChatbot then Chatbot}
  <Chatbot {...args} {value}>
    <slot></slot>
  </Chatbot>
{/await}
