<script lang="ts">
  import { Block } from '@gradio/atoms';
  import type { LoadingStatus } from '@gradio/statustracker';
  import { StatusTracker } from '@gradio/statustracker';
  import type { Gradio } from '@gradio/utils';
  import type {
    CustomComponents,
    MarkdownCustomData,
    MarkdownProps,
  } from '@modelscope-studio/legacy-compiled';
  import { gradio_version } from '@utils/upload';

  import Markdown from './shared/Markdown.svelte';

  export let label: string;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let visible = true;
  export let value = '';
  export let loading_status: LoadingStatus;
  export let rtl = false;
  export let sanitize_html = true;
  export let line_breaks = false;
  export let root: string;
  export let proxy_url: null | string;
  export let gradio: Gradio<{
    change: never;
    custom: MarkdownCustomData;
  }>;
  export let header_links = false;

  // custom
  export let enable_latex: boolean;
  export let latex_single_dollar_delimiter: boolean;
  export let latex_delimiters: MarkdownProps['latex_delimiters'] = [];
  export let enable_base64 = false;
  export let preview = true;
  export let custom_components: CustomComponents = {};
  const redirect_src_url = (src: string): string => {
    const replaceStr = `${root}${proxy_url ? `/proxy=${proxy_url.endsWith('/') ? proxy_url.slice(0, -1) : proxy_url}` : ''}${gradio_version >= 5 ? '/gradio_api' : ''}/file=`;
    return src?.includes(replaceStr)
      ? src
      : src.replaceAll('/file=', replaceStr);
  };
  $: _value = redirect_src_url(value);
  $: (label, gradio.dispatch('change'));
</script>

<Block
  {visible}
  {elem_id}
  {elem_classes}
  container={false}
  allow_overflow={true}
>
  <StatusTracker
    autoscroll={gradio.autoscroll}
    i18n={gradio.i18n}
    {...loading_status}
    variant="center"
  />
  <div class:pending={loading_status?.status === 'pending'}>
    <Markdown
      min_height={loading_status && loading_status.status !== 'complete'}
      value={_value}
      {preview}
      {enable_base64}
      {custom_components}
      {elem_classes}
      {visible}
      theme={gradio.theme}
      {rtl}
      on:change={() => gradio.dispatch('change')}
      on:custom={(e) => gradio.dispatch('custom', e.detail)}
      {enable_latex}
      {latex_single_dollar_delimiter}
      {latex_delimiters}
      {sanitize_html}
      {line_breaks}
      {header_links}
    />
  </div>
</Block>

<style>
  div {
    transition: 150ms;
  }

  .pending {
    opacity: 0.2;
  }
</style>
