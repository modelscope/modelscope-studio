<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  import { initCDNLoader, initLocalLoader } from '../loader';

  const AwaitedMonacoDiffEditor = importComponent(
    () => import('./monaco-editor.diff-editor')
  );

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;
    _internal: {};
    value?: string | undefined;
    _loader?: {
      mode?: 'cdn' | 'local';
      cdn_url?: string;
    };
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      value,
      _loader,
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
      _loader,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const mode = $derived(proceedProps._loader?.mode);
  const cdn_url = $derived(proceedProps._loader?.cdn_url);

  const awaitedLoader = $derived(
    mode === 'local'
      ? initLocalLoader()
      : cdn_url
        ? initCDNLoader(cdn_url)
        : undefined
  );

  // Define this method outside of the $ block to avoid re-rendering
  const onValueChange = (v: string | undefined) => {
    updateProps({
      value: v,
    });
  };

  const editorProps = $derived({
    style: proceedProps.elem_style,
    className: cls(proceedProps.elem_classes, 'ms-gr-pro-monaco-diff-editor'),
    id: proceedProps.elem_id,
    ...proceedProps.restProps,
    ...proceedProps.additionalProps,
    onValueChange,
    value: proceedProps.value,
    slots: slots.value,
    themeMode: proceedProps.gradio.shared.theme,
  });
</script>

{#if proceedProps.visible}
  {#await awaitedLoader then}
    {#await AwaitedMonacoDiffEditor then MonacoDiffEditor}
      <MonacoDiffEditor {...editorProps}>
        {@render children?.()}
      </MonacoDiffEditor>
    {/await}
  {/await}
{/if}
