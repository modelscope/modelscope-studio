<script lang="ts">
  import { getComponentSlotValue } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import { createContext } from '@svelte-preprocess-react/svelte-contexts/utils.svelte';
  import { onDestroy, type Snippet } from 'svelte';

  import type { SvelteInit, TreeNode } from './types';

  const {
    svelteInit,
    componentProps,
  }: {
    svelteInit: (options: SvelteInit) => TreeNode;
    componentProps: {
      children?: Snippet;
    };
  } = $props();
  const { children, ...rest } = $derived(componentProps);

  const [getReactWrapperContext, setReactWrapperContext] = createContext<
    TreeNode | undefined
  >('$$context/react-wrapper');

  let portalTarget = $state<HTMLElement | undefined>();
  let childrenSource = $state<HTMLElement | undefined>();

  const parentReactWrapper = getReactWrapperContext();
  const componentSlotValue = getComponentSlotValue();

  // only run once when the component initialized
  // svelte-ignore state_referenced_locally
  const node = svelteInit({
    get parent() {
      return parentReactWrapper;
    },
    get props() {
      return rest;
    },
    get portalTarget() {
      return portalTarget;
    },
    get childrenSource() {
      return childrenSource;
    },
    get svelteChildren() {
      return children;
    },
    get slotKey() {
      return componentSlotValue?.value.slotKey;
    },
    get slotIndex() {
      return componentSlotValue?.value.slotIndex;
    },
    get subSlotIndex() {
      return componentSlotValue?.value.subSlotIndex;
    },
  });

  setReactWrapperContext(node);

  onDestroy(() => {
    if (node.parent) {
      node.parent.nodes = node.parent.nodes.filter((n: any) => n !== node);
      // => node.parent.rerender
      node.rerender?.();
    }
  });
</script>

<react-portal-target bind:this={portalTarget}></react-portal-target>
{#if children}
  <svelte-slot bind:this={childrenSource}>{@render children?.()}</svelte-slot>
{/if}

<style>
  react-portal-target {
    display: contents;
  }
  svelte-slot {
    display: none;
  }
</style>
