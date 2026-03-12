<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedMarkdown = importComponent(() => import('./markdown'));
  const props = $props();

  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    value: string;
  }>(() => props);

  const slots = getSlots();

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      value,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      ...restProps
    } = getComponentProps();
    return {
      gradio,
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      value,
      visible,
      elem_id,
      elem_classes,
      elem_style,
    };
  });

  const proceedProps = $derived(getProceedProps());
</script>

{#if proceedProps.visible}
  {#await AwaitedMarkdown then Markdown}
    <Markdown
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes)}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      rootUrl={proceedProps.gradio.shared.root}
      themeMode={proceedProps.gradio.shared.theme || 'light'}
      value={proceedProps.value}
      slots={slots.value}
    >
      {@render children?.()}
    </Markdown>
  {/await}
{/if}
