<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  import type { ChatbotMessages } from './type';

  const AwaitedChatbot = importComponent(() => import('./chatbot'));

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    value?: ChatbotMessages;
    suggestion_select?: any;
    welcome_prompt_select?: any;
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
        value,
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
        value,
        gradio,
      };
    },
    {
      suggestion_select: 'suggestionSelect',
      welcome_prompt_select: 'welcomePromptSelect',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedChatbot then Chatbot}
    <Chatbot
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-pro-chatbot')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      value={proceedProps.value || []}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
      rootUrl={proceedProps.gradio.shared.root}
      apiPrefix={proceedProps.gradio.shared.api_prefix}
      themeMode={proceedProps.gradio.shared.theme || 'light'}
      slots={slots.value}
    >
      {@render children?.()}
    </Chatbot>
  {/await}
{/if}
