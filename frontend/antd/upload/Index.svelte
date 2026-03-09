<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import { type FileData, prepare_files } from '@gradio/client';
  import cls from 'classnames';

  const AwaitedUpload = importComponent(() => import('./upload'));

  const props = $props();
  const {
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
    gradio,
  } = getProps<{
    additional_props?: Record<string, any>;

    _internal: {};
    value?: FileData[];
    form_name?: string;
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
      form_name: 'name',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedUpload then Upload}
    <Upload
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-upload')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      fileList={proceedProps.additionalProps.fileList ?? proceedProps.value}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
      upload={async (files) => {
        return (
          (await proceedProps.gradio.shared.client.upload(
            await prepare_files(files),
            proceedProps.gradio.shared.root
          )) || []
        ).map((file, i) => {
          if (!file) {
            return file;
          }
          return {
            ...file,
            uid: files[i].uid,
          };
        });
      }}
    >
      {@render children?.()}
    </Upload>
  {/await}
{/if}
