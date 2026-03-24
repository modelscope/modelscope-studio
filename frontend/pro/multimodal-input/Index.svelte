<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import { type FileData, prepare_files } from '@gradio/client';
  import cls from 'classnames';

  import type { MultimodalInputValue } from './multimodal-input';

  const AwaitedMultimodalInput = importComponent(
    () => import('./multimodal-input')
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
    value?: MultimodalInputValue;
    key_press?: any;
    paste_file?: any;
    key_down?: any;
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
      key_press: 'keyPress',
      paste_file: 'pasteFile',
      key_down: 'keyDown',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const upload = async (files: File[]) => {
    return (
      ((await proceedProps.gradio.shared.client.upload(
        await prepare_files(files),
        proceedProps.gradio.shared.root
      )) as FileData[]) || []
    );
  };
</script>

{#if proceedProps.visible}
  {#await AwaitedMultimodalInput then MultimodalInput}
    <MultimodalInput
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-pro-multimodal-input')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      value={proceedProps.additionalProps.value ?? proceedProps.value}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
      {upload}
    >
      {@render children?.()}
    </MultimodalInput>
  {/await}
{/if}
