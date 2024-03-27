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

  import Flow from './shared/Flow.svelte';
  import { type FlowData } from './shared/utils';

  export let gradio: Gradio<{
    change: FlowData;
    data_change: FlowData;
    custom: FlowCustomData;
  }>;
  export let root: string;
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
  export let height = 600;
  export let schema: FlowProps['schema'] = {
    nodes: [],
  };
  export let show_sidebar = true;
  export let show_minimap = true;
  export let show_controls = true;
  export let min_zoom = 0.1;
  export let max_zoom = 2;
  export let hide_attribution = false;
  export let custom_components: CustomComponents = {};
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
    {value}
    {interactive}
    {custom_components}
    {height}
    {schema}
    {hide_attribution}
    {show_sidebar}
    {show_minimap}
    {show_controls}
    {min_zoom}
    {max_zoom}
    theme={gradio.theme}
    on:custom={(e) => gradio.dispatch('custom', e.detail)}
    on:change={(e) => {
      const { value: newValue, data_changed } = e.detail;
      value = newValue;
      gradio.dispatch('change', newValue);
      if (data_changed) {
        gradio.dispatch('data_change', newValue);
      }
    }}
  />
</Block>
