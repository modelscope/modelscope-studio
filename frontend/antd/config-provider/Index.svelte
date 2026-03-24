<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { setConfigType } from '@svelte-preprocess-react/svelte-contexts/config.svelte';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedConfigProvider = importComponent(
    () => import('./config-provider')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    theme_config?: any;
    theme?: any;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      theme_config,
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
      themeConfig: theme_config,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  setConfigType(() => 'antd');
</script>

{#if proceedProps.visible}
  {#await AwaitedConfigProvider then ConfigProvider}
    <ConfigProvider
      className={cls('ms-gr-antd-config-provider', proceedProps.elem_classes)}
      id={proceedProps.elem_id}
      style={proceedProps.elem_style}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      theme={proceedProps.additionalProps.theme ||
        proceedProps.restProps.theme ||
        proceedProps.themeConfig}
      themeMode={proceedProps.gradio.shared.theme || 'light'}
    >
      {@render children?.()}
    </ConfigProvider>
  {/await}
{/if}
