<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedWelcome = importComponent(() => import('./welcome'));

  const props = $props();
  const { getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    root: string;
    proxy_url: string;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      root,
      proxy_url,
      ...restProps
    } = getComponentProps();
    return {
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      root,
      proxy_url,
    };
  }, {});
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedWelcome then Welcome}
    <Welcome
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antdx-welcome')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      urlRoot={proceedProps.root}
      urlProxyUrl={proceedProps.proxy_url}
    >
      {@render children()}
    </Welcome>
  {/await}
{/if}
