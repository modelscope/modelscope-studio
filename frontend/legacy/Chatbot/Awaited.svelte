<script context="module" lang="ts">
  export { default as BaseChatBot } from './shared/ChatBot.svelte';
</script>

<script lang="ts">
  import { Block, BlockLabel } from '@gradio/atoms';
  import { type FileData } from '@gradio/client';
  import { Chat } from '@gradio/icons';
  import type { LoadingStatus } from '@gradio/statustracker';
  import { StatusTracker } from '@gradio/statustracker';
  import type { Gradio, ShareData } from '@gradio/utils';
  import type {
    CustomComponents,
    MarkdownCustomData,
    MarkdownProps,
  } from '@modelscope-studio/legacy-compiled';
  import { normalise_file } from '@utils/upload';

  import ChatBot from './shared/ChatBot.svelte';
  import {
    type AvatarImage,
    type AvatarImageItem,
    ensureArray,
    type FileMessage,
    type FlushData,
    type LikeData,
    type LLMThinkingPreset,
    type MultimodalMessage,
    type MultimodalMessageItem,
    resolve_llm_thinking_presets,
    type SelectData,
  } from './shared/utils';

  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let visible = true;
  export let scale: number | null = null;
  export let min_width: number | undefined = undefined;
  export let label: string;
  export let show_label = true;
  export let root: string;
  export let proxy_url: null | string;
  export let value: [
    MultimodalMessageItem | null,
    MultimodalMessageItem | null,
  ][] = [];
  //  passed by gradio, will be true when user listen the select event.
  export let _selectable = false;
  export let likeable = false;
  export let show_share_button = false;
  export let rtl = false;
  export let show_copy_button = false;
  export let sanitize_html = true;
  export let bubble_full_width = true;
  export let layout: 'bubble' | 'panel' = 'bubble';
  export let render_markdown = true;
  export let line_breaks = true;
  export let enable_latex: boolean;
  export let latex_single_dollar_delimiter: boolean;
  export let latex_delimiters: MarkdownProps['latex_delimiters'];

  export let gradio: Gradio<{
    change: typeof value;
    select: SelectData;
    share: ShareData;
    error: string;
    like: LikeData;
    flushed: FlushData;
    custom: MarkdownCustomData & {
      index: [number, number, number];
    };
  }>;

  export let avatar_images: [AvatarImageItem, AvatarImageItem] = [null, null];
  export let avatar_image_align: 'top' | 'middle' | 'bottom' = 'bottom';
  export let avatar_image_width: number;
  // custom
  export let enable_base64 = false;
  export let preview = true;
  export let flushing = false;
  export let flushing_speed = 3;
  export let llm_thinking_presets: LLMThinkingPreset[] = [];
  export let custom_components: CustomComponents = {};
  let _value: [
    (MultimodalMessage | null)[] | null,
    (MultimodalMessage | null)[] | null,
  ][];
  let _avatar_images: [AvatarImage[], AvatarImage[]];

  const redirect_src_url = (src: string): string => {
    const replaceStr = `${root}${proxy_url ? `/proxy=${proxy_url.endsWith('/') ? proxy_url.slice(0, -1) : proxy_url}` : ''}/file=`;
    return src.includes(replaceStr)
      ? src
      : src.replaceAll('/file=', replaceStr);
  };

  function normalize_messages(message: FileMessage | null): FileMessage | null {
    if (message === null) {
      return message;
    }
    return {
      file: normalise_file(message?.file, root, proxy_url) as FileData,
      alt_text: message?.alt_text,
    };
  }

  function process_message(
    item: MultimodalMessageItem | null
  ): (MultimodalMessage | null)[] | null {
    if (!item) {
      return null;
    }
    return ensureArray(item).map((msg) => {
      if (!msg) {
        return null;
      }
      msg.text = redirect_src_url(msg.text);
      msg.text = resolve_llm_thinking_presets(msg.text, llm_thinking_presets);
      msg.files = (msg.files || []).map(
        normalize_messages
      ) as MultimodalMessage['files'];
      return msg;
    });
  }
  $: _avatar_images = (
    avatar_images
      ? avatar_images.map((avatar_image) => {
          if (!avatar_image) {
            return [];
          }
          return ensureArray(avatar_image);
        })
      : [[], []]
  ) as typeof _avatar_images;
  $: _value = (
    value
      ? value.map(([user_msg, bot_msg]) => [
          process_message(user_msg),
          process_message(bot_msg),
        ])
      : []
  ) as typeof _value;

  export let loading_status: LoadingStatus | undefined = undefined;
  export let height = 400;
</script>

<Block
  {elem_id}
  {elem_classes}
  {visible}
  padding={false}
  {scale}
  {min_width}
  {height}
  allow_overflow={false}
>
  {#if loading_status}
    <StatusTracker
      autoscroll={gradio.autoscroll}
      i18n={gradio.i18n}
      {...loading_status}
      show_progress={loading_status.show_progress === 'hidden'
        ? 'hidden'
        : 'minimal'}
    />
  {/if}
  <div class="wrapper">
    {#if show_label}
      <BlockLabel
        {show_label}
        Icon={Chat}
        float={false}
        label={label || 'Chatbot'}
      />
    {/if}
    <ChatBot
      i18n={gradio.i18n}
      selectable={_selectable}
      {likeable}
      {flushing}
      {flushing_speed}
      {show_share_button}
      value={_value}
      {enable_latex}
      {latex_single_dollar_delimiter}
      {latex_delimiters}
      {render_markdown}
      complete_message={!loading_status ||
        loading_status?.status === 'complete'}
      pending_message={loading_status?.status === 'pending'}
      {rtl}
      {show_copy_button}
      on:change={() => gradio.dispatch('change', value)}
      on:select={(e) => gradio.dispatch('select', e.detail)}
      on:like={(e) => gradio.dispatch('like', e.detail)}
      on:share={(e) => gradio.dispatch('share', e.detail)}
      on:error={(e) => gradio.dispatch('error', e.detail)}
      on:custom={(e) => gradio.dispatch('custom', e.detail)}
      on:flushed={(e) => gradio.dispatch('flushed', e.detail)}
      avatar_images={_avatar_images}
      {avatar_image_align}
      {avatar_image_width}
      {sanitize_html}
      {enable_base64}
      {preview}
      {bubble_full_width}
      {line_breaks}
      {layout}
      {proxy_url}
      {root}
      {custom_components}
      theme={gradio.theme}
    />
  </div>
</Block>

<style>
  .wrapper {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: start;
    width: 100%;
    height: 100%;
  }
</style>
