<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import type { SuggestionItem } from '@ant-design/x/es/suggestion';
  import cls from 'classnames';

  const AwaitedSuggestion = importComponent(() => import('./suggestion'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    items: SuggestionItem[];

    open_change?: any;
  }>(() => props);

  const getProceedProps = processProps(
    () => {
      const {
        visible,
        _internal,
        as_item,
        elem_classes,
        elem_id,
        elem_style,
        items,
        ...restProps
      } = getComponentProps();
      return {
        gradio,
        additionalProps: getAdditionalProps(),
        _internal,
        as_item,
        restProps,
        visible,
        elem_id,
        elem_classes,
        elem_style,
        items,
      };
    },
    {
      open_change: 'openChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedSuggestion then Suggestion}
    <Suggestion
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antdx-suggestion')}
      id={proceedProps.elem_id}
      items={proceedProps.items}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
    >
      {@render children?.()}
    </Suggestion>
  {/await}
{/if}
