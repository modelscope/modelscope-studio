<svelte:options accessors={true} />

<script lang="ts">
  import { Block } from '@gradio/atoms';
  import type { LoadingStatus } from '@gradio/statustracker';
  import { StatusTracker } from '@gradio/statustracker';
  import type { Gradio } from '@gradio/utils';
  import {
    type CustomComponents,
    type FlowCustomData,
    type FlowProps,
  } from '@modelscope-studio/compiled';
  import { get_fetchable_url_or_file } from '@utils/upload';

  import Flow from './shared/Flow.svelte';
  import { type FlowData } from './shared/utils';

  export let gradio: Gradio<{
    change: FlowData;
    data_change: FlowData;
    custom: FlowCustomData;
  }>;
  export let root: string;
  export let proxy_url: string;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let visible = true;
  export let value: FlowData = {
    nodes: [],
    edges: [],
  };
  export let container = true;
  export let scale: number | null = null;
  export let min_width: number | undefined = undefined;
  export let loading_status: LoadingStatus | undefined = undefined;
  export let interactive: boolean;
  export let height: number | string = 600;
  export let schema: FlowProps['schema'] = {
    nodes: [],
  };
  export let show_sidebar: boolean;
  export let show_minimap: boolean;
  export let show_controls: boolean;
  export let min_zoom = 0.1;
  export let max_zoom = 2;
  export let sync_on_data_change = false;
  export let custom_components: CustomComponents = {};
  export let background_props: FlowProps['background_props'] = {};
  let _background_props: typeof background_props = {};
  $: _value = value;
  function update_background_props() {
    if (Array.isArray(background_props)) {
      _background_props = background_props;
      return;
    }
    if (Array.isArray(_background_props)) {
      _background_props = background_props;
    } else {
      _background_props = {
        ..._background_props,
        ...background_props,
      };
    }
  }
  $: background_props, update_background_props();
  // process schema
  $: _schema = {
    ...schema,
    nodes: schema.nodes.map((node) => ({
      ...node,
      icon: node.icon
        ? get_fetchable_url_or_file(node.icon, root, proxy_url)
        : undefined,
    })),
  };
</script>

<Block
  {visible}
  {elem_id}
  {elem_classes}
  {scale}
  {min_width}
  allow_overflow={false}
  padding={container}
>
  {#if loading_status}
    <StatusTracker
      autoscroll={gradio.autoscroll}
      i18n={gradio.i18n}
      {...loading_status}
    />
  {/if}
  <Flow
    {root}
    {gradio}
    value={_value}
    {interactive}
    {custom_components}
    background_props={_background_props}
    {height}
    schema={_schema}
    {show_sidebar}
    {show_minimap}
    {show_controls}
    {min_zoom}
    {max_zoom}
    theme={gradio.theme}
    on:custom={(e) => gradio.dispatch('custom', e.detail)}
    on:change={(e) => {
      const { value: newValue, data_changed } = e.detail;
      if (sync_on_data_change) {
        if (!data_changed) {
          _value = newValue;
        }
      } else {
        value = newValue;
      }
      gradio.dispatch('change', newValue);
      if (data_changed) {
        if (sync_on_data_change) {
          value = newValue;
        }
        gradio.dispatch('data_change', newValue);
      }
    }}
  />
</Block>
