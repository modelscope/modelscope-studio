<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import { getSlotContext } from '@svelte-preprocess-react/slot';
  import { writable } from 'svelte/store';

  const AwaitIconFontProvider = importComponent(
    () => import('./iconfont-provider')
  );
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
</script>

{#if $mergedProps.visible}
  {#await AwaitIconFontProvider then IconFontProvider}
    <IconFontProvider
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      slots={{}}
    >
      <slot></slot>
    </IconFontProvider>
  {/await}
{/if}
