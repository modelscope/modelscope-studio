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
  export let height: number;
  export let theme: string = 'light';
  export let show_sidebar: boolean;
  export let show_minimap: boolean;
  export let show_controls: boolean;
  export let hide_attribution: boolean;
  export let min_zoom: number;
  export let max_zoom: number;
  export let schema: FlowProps['schema'];
  export let custom_components: CustomComponents;

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
        val
          ?.filter(Boolean)
          .map((v) => ({ name: v?.orig_name || '', url: v?.url || '' })) || []
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  // resolve ports
  $: _value = {
    nodes: value.nodes?.map((v) => {
      return {
        ...v,
        type: 'ms-node',
      };
    }),
    edges: value.edges?.map((v) => {
      return {
        ...v,
        type: 'ms-edge',
      };
    }),
  };
</script>

<Flow
  disabled={!interactive}
  elem_style={`height: ${height}px`}
  nodes={_value.nodes}
  {on_change}
  {on_upload}
  {on_custom}
  edges={_value.edges}
  {schema}
  {theme}
  {hide_attribution}
  {custom_components}
  {show_sidebar}
  {show_minimap}
  {show_controls}
  {min_zoom}
  {max_zoom}
/>
