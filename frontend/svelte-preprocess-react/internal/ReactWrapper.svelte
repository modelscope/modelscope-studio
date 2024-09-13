<script lang="ts">
  import { beforeUpdate, getContext, onDestroy, setContext } from 'svelte';
  import { type Writable, writable } from 'svelte/store';

  import { getComponentSlotContext } from '../slot';

  import type { SvelteInit, TreeNode } from './types';

  export let svelteInit: (options: SvelteInit) => TreeNode;

  const props = writable<Record<string, any>>(extractProps($$props));
  const target: Writable<HTMLElement | undefined> = writable();
  const slot: Writable<HTMLElement | undefined> = writable<
    HTMLElement | undefined
  >();

  const listeners: Array<() => void> = [];

  const parent = getContext<TreeNode | undefined>('$$ms-gr-antd-react-wrapper');
  const { slotKey, slotIndex, subSlotIndex } = getComponentSlotContext() || {};
  const node = svelteInit({
    parent,
    props,
    target,
    slot,
    slotKey,
    slotIndex,
    subSlotIndex,
    onDestroy(callback) {
      listeners.push(callback);
    },
  });
  setContext('$$ms-gr-antd-react-wrapper', node);
  beforeUpdate(() => {
    props.set(extractProps($$props));
  });
  onDestroy(() => {
    listeners.forEach((callback) => callback());
  });
  function extractProps(values: Record<string, any>) {
    const { svelteInit: _excluded, ...rest } = values;
    return rest;
  }
</script>

<react-portal-target bind:this={$target} />

{#if $$slots.default}
  <svelte-slot bind:this={$slot}><slot /></svelte-slot>
{/if}

<style>
  react-portal-target {
    display: contents;
  }
  svelte-slot {
    display: none;
  }
</style>
