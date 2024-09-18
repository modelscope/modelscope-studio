<script lang="ts">
  import { Check, Copy } from '@gradio/icons';
  import { onDestroy } from 'svelte';

  import { copy_to_clipboard } from './utils';

  let copied = false;
  export let value: string;
  let timer: ReturnType<typeof setTimeout>;

  function copy_feedback(): void {
    copied = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      copied = false;
    }, 2000);
  }
  async function handle_copy(): Promise<void> {
    try {
      await copy_to_clipboard(value);
      copy_feedback();
    } catch {
      //
    }
  }

  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });
</script>

<button
  on:click={handle_copy}
  title="copy"
  aria-label={copied ? 'Copied message' : 'Copy message'}
>
  {#if !copied}
    <Copy />
  {/if}
  {#if copied}
    <Check />
  {/if}
</button>

<style>
  button {
    position: relative;
    top: 0;
    right: 0;
    cursor: pointer;
    width: 17px;
    height: 17px;
    color: var(--body-text-color-subdued);
    margin-right: 5px;
  }

  button:hover {
    color: var(--body-text-color);
  }
</style>
