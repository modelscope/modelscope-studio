<svelte:options accessors={true} />

<script lang="ts">
  import { getSlotContext } from '@svelte-preprocess-react/slot';
  import { writable } from 'svelte/store';

  import { setIconfontContext } from './context';

  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any> = {};

  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;

  const [mergedProps, update] = getSlotContext({
    props: $updatedProps,
    _internal,
    visible,
    as_item,
    restProps: $$restProps,
  });
  $: update({
    props: $updatedProps,
    _internal,
    visible,
    as_item,
    restProps: $$restProps,
  });
  const options = setIconfontContext();
  $: {
    const newOptions = {
      ...$mergedProps.restProps,
      ...$mergedProps.props,
    };
    options.update((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newOptions)) {
        return newOptions;
      }
      return prev;
    });
  }
</script>

{#if $mergedProps.visible}
  <slot></slot>
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
