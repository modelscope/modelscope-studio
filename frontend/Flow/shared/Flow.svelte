<script lang="ts">
  import { prepare_files, upload, upload_files } from '@gradio/client';
  import {
    type CustomComponents,
    Flow,
    type FlowCustomData,
    type FlowProps,
    type UploadFile,
  } from '@modelscope-studio/compiled';
  import { createEventDispatcher, getContext } from 'svelte';

  import { type FlowData } from './utils';

  export let root: string;
  export let value: FlowData;
  export let interactive: boolean;
  export let height: number | string;
  export let theme: string = 'light';
  export let show_sidebar: boolean;
  export let show_minimap: boolean;
  export let show_controls: boolean;
  export let min_zoom: number;
  export let max_zoom: number;
  export let schema: FlowProps['schema'];
  export let custom_components: CustomComponents;
  export let background_props: FlowProps['background_props'];

  const upload_fn = getContext<typeof upload_files>('upload_files');

  const dispatch = createEventDispatcher<{
    change: {
      value: FlowData;
      data_changed: boolean;
    };
    custom: FlowCustomData;
  }>();
  function on_change(v: FlowData, data_changed?: boolean) {
    dispatch('change', {
      value: v,
      data_changed: data_changed || false,
    });
  }

  function on_custom(data: FlowCustomData) {
    dispatch('custom', data);
  }

  const on_upload = async (files: File[]): Promise<UploadFile[]> => {
    try {
      const val = await upload(
        await prepare_files(files),
        root,
        undefined,
        upload_fn
      );
      return (
        val?.filter(Boolean).map((v) => ({
          name: v?.orig_name || '',
          url: v?.url || '',
          path: v?.path || '',
        })) || []
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  };
</script>

<Flow
  disabled={!interactive}
  elem_style={`height: ${typeof height === 'number' ? height + 'px' : height}`}
  nodes={value.nodes}
  {on_change}
  {on_upload}
  {on_custom}
  edges={value.edges}
  {schema}
  {theme}
  {custom_components}
  {background_props}
  {show_sidebar}
  {show_minimap}
  {show_controls}
  {min_zoom}
  {max_zoom}
/>
