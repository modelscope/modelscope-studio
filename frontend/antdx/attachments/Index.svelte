<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import { type FileData, prepare_files } from '@gradio/client';
  import cls from 'classnames';

  const AwaitedAttachments = importComponent(() => import('./attachments'));

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
    _internal: Record<string, any>;
    form_name?: string;
    value?: FileData[];
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
      form_name: 'name',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedAttachments then Attachments}
    <Attachments
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antdx-attachments')}
      id={proceedProps.elem_id}
      items={proceedProps.value || []}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
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
    </Attachments>
  {/await}
{/if}
