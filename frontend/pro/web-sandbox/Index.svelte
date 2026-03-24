<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  import type { WebSandboxProps } from './web-sandbox';

  const AwaitedWebSandbox = importComponent(() => import('./web-sandbox'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    _internal: {};
    value?: WebSandboxProps['value'];
    compile_error?: any;
    compile_success?: any;
    render_error?: any;
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
        gradio,
        additionalProps: getAdditionalProps(),
        _internal,
        as_item,
        restProps,
        visible,
        elem_id,
        elem_classes,
        elem_style,
        value,
      };
    },
    {
      compile_error: 'compileError',
      compile_success: 'compileSuccess',
      render_error: 'renderError',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedWebSandbox then WebSandbox}
    <WebSandbox
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-pro-web-sandbox')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      value={proceedProps.value}
      slots={slots.value}
      themeMode={proceedProps.gradio.shared.theme || 'light'}
    >
      {@render children?.()}
    </WebSandbox>
  {/await}
{/if}
