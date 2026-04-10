<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedFolder = importComponent(() => import('./folder'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
    };
    tree_data?: any[];
    file_content_service_load_file_content?: any;
    selected_file_change?: any;
    expanded_paths_change?: any;
    file_click?: any;
    folder_click?: any;
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
        tree_data,
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
        treeData: tree_data,
      };
    },
    {
      file_content_service_load_file_content:
        'fileContentService_loadFileContent',
      expanded_paths_change: 'expandedPathsChange',
      selected_file_change: 'selectedFileChange',
      file_click: 'fileClick',
      folder_click: 'folderClick',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedFolder then Folder}
    <Folder
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antdx-folder')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      treeData={proceedProps.additionalProps.treeData || proceedProps.treeData}
      slots={slots.value}
    >
      {@render children?.()}
    </Folder>
  {/await}
{/if}
