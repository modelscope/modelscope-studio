<svelte:options accessors={true} />

<script lang="ts">
  import { getSlotContext } from '@svelte-preprocess-react/slot';
  import { writable } from 'svelte/store';

  import { setIconfontContext } from './context';

  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any> = {};

  export let script_url: string | string[] = '';
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;

  const [mergedProps, update] = getSlotContext({
    props: $updatedProps,
    _internal,
    script_url,
    visible,
    as_item,
  });
  $: update({
    props: $updatedProps,
    _internal,
    script_url,
    visible,
    as_item,
  });
  const options = setIconfontContext();
  $: {
    const newOptions = {
      scriptUrl: $mergedProps.script_url,
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
