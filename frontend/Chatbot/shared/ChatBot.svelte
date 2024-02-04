<script lang="ts">
  import { ShareButton } from '@gradio/atoms';
  import { get_fetchable_url_or_file } from '@gradio/client';
  import type { I18nFormatter } from '@gradio/utils';
  import { copy } from '@gradio/utils';
  import {
    type CustomComponents,
    type CustomData,
    FileView,
  } from '@modelscope-studio/compiled';
  import { dequal } from 'dequal/lite';
  import { afterUpdate, createEventDispatcher } from 'svelte';

  import Copy from './Copy.svelte';
  import FlushingMarkdown from './FlushingMarkdown.svelte';
  import LikeDislike from './LikeDislike.svelte';
  import Pending from './Pending.svelte';
  import type {
    AvatarImage,
    FlushData,
    LikeData,
    MultimodalMessage,
    SelectData,
  } from './utils';
  import {
    copy_to_clipboard,
    format_chat_for_sharing,
    should_flushing,
  } from './utils';

  export let value:
    | [
        (MultimodalMessage | null)[] | null,
        (MultimodalMessage | null)[] | null,
      ][]
    | null;
  let old_value:
    | [
        (MultimodalMessage | null)[] | null,
        (MultimodalMessage | null)[] | null,
      ][]
    | null = null;
  export let latex_delimiters: {
    left: string;
    right: string;
    display: boolean;
  }[];
  export let pending_message = false;
  export let complete_message = false;
  export let selectable = false;
  export let likeable = false;
  export let show_share_button = false;
  export let i18n: I18nFormatter;
  export let rtl = false;
  export let show_copy_button = false;
  export let avatar_images: [AvatarImage[], AvatarImage[]] = [[], []];
  export let avatar_image_align: 'top' | 'middle' | 'bottom' = 'bottom';
  export let avatar_image_width: number = 45;
  export let sanitize_html = true;
  export let bubble_full_width = true;
  export let render_markdown = true;
  export let line_breaks = true;
  export let root: string;
  export let proxy_url: null | string;
  export let layout: 'bubble' | 'panel' = 'bubble';
  // custom
  export let enable_base64 = false;
  export let preview = true;
  // typewriter
  export let flushing = true;
  export let custom_components: CustomComponents = {};
  export let flushing_speed = 3;
  export let theme = 'light';
  let div: HTMLDivElement;
  let container_scroll: boolean;
  let is_programmatic_scroll = false;
  let user_scrolled = false;
  let container_scroll_timer: number;
  const dispatch = createEventDispatcher<{
    change: undefined;
    select: SelectData;
    like: LikeData;
    flushed: FlushData;
    custom: CustomData & { index: [number, number, number] };
  }>();
  const on_container_scroll = (): void => {
    if (is_programmatic_scroll) {
      is_programmatic_scroll = false;
      return;
    }
    user_scrolled = true;
    container_scroll_timer && clearTimeout(container_scroll_timer);
    container_scroll = true;
    container_scroll_timer = setTimeout(() => {
      container_scroll = false;
    }, 500) as unknown as number;
  };

  const scroll = (): void => {
    const autoscroll = user_scrolled
      ? div && div.offsetHeight + div.scrollTop > div.scrollHeight - 100
      : true;
    if (autoscroll && !container_scroll) {
      is_programmatic_scroll = true;
      div.scrollTo(0, div.scrollHeight);
    }
  };
  afterUpdate(() => {
    scroll();
    div.querySelectorAll('img').forEach((n) => {
      n.addEventListener('load', () => {
        scroll();
      });
    });
  });

  $: {
    if (
      value?.length !== old_value?.length ||
      (value &&
        old_value &&
        value.at(-1)?.filter(Boolean)?.length !==
          old_value.at(-1)?.filter(Boolean)?.length)
    ) {
      user_scrolled = false;
    }
    if (!dequal(value, old_value)) {
      old_value = value;
      dispatch('change');
    }
  }

  function handle_custom(
    i: number,
    j: number,
    k: number,
    custom_data: CustomData
  ): void {
    dispatch('custom', {
      index: [i, j, k],
      ...custom_data,
    });
  }

  function handle_select(
    i: number,
    j: number,
    k: number,
    message: MultimodalMessage | null
  ): void {
    dispatch('select', {
      index: [i, j, k],
      value: message,
    });
  }
  function handle_flushed(
    i: number,
    j: number,
    k: number,
    message: string
  ): void {
    dispatch('flushed', {
      index: [i, j, k],
      value: message,
    });
  }

  function handle_like(
    i: number,
    j: number,
    k: number,
    message: MultimodalMessage | null,
    liked: boolean
  ): void {
    dispatch('like', {
      index: [i, j, k],
      value: message,
      liked: liked,
    });
  }

  function get_message_avatar(
    message: MultimodalMessage,
    index: number,
    item_index: number
  ) {
    const avatar_image = avatar_images[index][item_index];
    return get_fetchable_url_or_file(
      typeof message.avatar === 'object' && message.avatar
        ? message.avatar.path
        : typeof avatar_image === 'object'
          ? avatar_image?.avatar || null
          : avatar_image,
      root,
      proxy_url
    );
  }
  function get_message_name(
    message: MultimodalMessage,
    index: number,
    item_index: number
  ) {
    const avatar_image = avatar_images[index][item_index];

    return (
      message.name ||
      (typeof avatar_image === 'object' ? avatar_image?.name : null)
    );
  }
</script>

{#if show_share_button && value && value.length > 0}
  <div class="share-button">
    <ShareButton
      {i18n}
      on:error
      on:share={(e) => {
        copy_to_clipboard(e.detail.description);
      }}
      formatter={format_chat_for_sharing}
      {value}
    />
  </div>
{/if}

<div
  class={layout === 'bubble' ? 'bubble-wrap' : 'panel-wrap'}
  bind:this={div}
  on:scroll={on_container_scroll}
  role="log"
  aria-label="chatbot conversation"
  aria-live="polite"
>
  <div class="message-wrap" class:bubble-gap={layout === 'bubble'} use:copy>
    {#if value}
      {#each value as message_pair, i}
        {#each message_pair as message_item, j}
          {#if message_item}
            {#each message_item as message, k}
              {#if message}
                <div
                  class="message-row {layout} {j == 0 ? 'user-row' : 'bot-row'}"
                >
                  {#if message.avatar || avatar_images[j][k]}
                    {@const message_name = get_message_name(message, j, k)}
                    <div
                      class="avatar-container {avatar_image_align}"
                      style={typeof avatar_image_width === 'number'
                        ? `width: ${avatar_image_width}px;`
                        : undefined}
                    >
                      <img
                        class="avatar-image"
                        src={get_message_avatar(message, j, k)}
                        alt="{j == 0 ? 'user' : 'bot'} avatar"
                      />
                      {#if message_name}
                        <span title={message_name}>{message_name}</span>
                      {/if}
                    </div>
                  {/if}

                  <div
                    class="message {j == 0 ? 'user' : 'bot'}"
                    class:message-fit={layout === 'bubble' &&
                      !bubble_full_width}
                    class:panel-full-width={layout === 'panel'}
                    class:message-bubble-border={layout === 'bubble'}
                    class:message-markdown-disabled={!render_markdown}
                  >
                    <button
                      class="message-content-button"
                      class:latest={i === value.length - 1}
                      class:message-markdown-disabled={!render_markdown}
                      class:selectable
                      style:text-align="left"
                      on:click={() => handle_select(i, j, k, message)}
                      on:keydown={(e) => {
                        if (e.key === 'Enter') {
                          handle_select(i, j, k, message);
                        }
                      }}
                      dir={rtl ? 'rtl' : 'ltr'}
                      aria-label={(j == 0 ? 'user' : 'bot') +
                        "'s message:' " +
                        message}
                    >
                      <FlushingMarkdown
                        {custom_components}
                        flushing={flushing &&
                          i === value.length - 1 &&
                          should_flushing(
                            j === 0 ? 'user' : 'chatbot',
                            message
                          )}
                        complete_message={complete_message || pending_message}
                        {theme}
                        {flushing_speed}
                        {enable_base64}
                        {preview}
                        message={message.text}
                        {latex_delimiters}
                        {sanitize_html}
                        {render_markdown}
                        {line_breaks}
                        on:update={scroll}
                        on:load={scroll}
                        on:custom={(e) => handle_custom(i, j, k, e.detail)}
                        on:flushed={(e) => handle_flushed(i, j, k, e.detail)}
                      />

                      {#each message.files || [] as file}
                        {#if message && file.file}
                          <FileView
                            {theme}
                            {preview}
                            elem_style="width: 100%"
                            alt_text={file.alt_text}
                            file={file.file}
                          />
                        {:else if pending_message && j === 1}
                          <Pending {layout} />
                        {/if}
                      {/each}
                    </button>
                    {#if (likeable && j !== 0) || (show_copy_button && message && typeof message.text === 'string')}
                      <div
                        class="message-buttons-{j == 0
                          ? 'user'
                          : 'bot'} message-buttons-{layout} {get_message_avatar(
                          message,
                          j,
                          k
                        ) && 'with-avatar'}"
                        class:message-buttons-fit={layout === 'bubble' &&
                          !bubble_full_width}
                        class:bubble-buttons-user={layout === 'bubble'}
                      >
                        {#if likeable && j == 1}
                          <LikeDislike
                            action="like"
                            handle_action={() =>
                              handle_like(i, j, k, message, true)}
                          />
                          <LikeDislike
                            action="dislike"
                            handle_action={() =>
                              handle_like(i, j, k, message, false)}
                          />
                        {/if}

                        {#if show_copy_button && message && typeof message.text === 'string'}
                          <Copy value={message.text} />
                        {/if}
                      </div>
                    {/if}
                  </div>
                </div>
              {/if}
            {/each}
          {/if}
        {/each}
      {/each}
    {/if}
  </div>
</div>

<style>
  .bubble-wrap {
    padding: var(--block-padding);
    width: 100%;
    overflow-y: auto;
  }

  .panel-wrap {
    width: 100%;
    overflow-y: auto;
  }

  .message-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .bubble-gap {
    gap: calc(var(--spacing-xxl) + var(--spacing-lg));
  }

  .message-wrap > div :not(.avatar-container) :global(img) {
    border-radius: 13px;
    max-width: 30vw;
  }

  .message-wrap > div :not(.avatar-container) :global(.ant-image-mask) {
    border-radius: 13px;
  }

  .message-wrap > div :global(p:not(:first-child)) {
    margin-top: var(--spacing-xxl);
  }

  .message-wrap :global(audio) {
    width: 100%;
  }

  .message {
    position: relative;
    display: flex;
    flex-direction: column;
    align-self: flex-end;
    text-align: left;
    background: var(--background-fill-secondary);
    flex: 1;
    width: 0;
    color: var(--body-text-color);
    font-size: var(--text-lg);
    line-height: var(--line-lg);
    overflow-wrap: break-word;
    padding-right: calc(var(--spacing-xxl) + var(--spacing-md));
    padding: calc(var(--spacing-xxl) + var(--spacing-sm));
  }

  .message-content-button {
    outline: none;
    display: flex;
    flex-direction: column;
    user-select: text;
  }

  .message-bubble-border {
    border-width: 1px;
    border-radius: var(--radius-xxl);
  }

  .message-fit {
    max-width: fit-content;
  }

  .panel-full-width {
    padding: calc(var(--spacing-xxl) * 2);
    width: 100%;
  }
  .message-markdown-disabled {
    white-space: pre-line;
  }

  @media (max-width: 480px) {
    .panel-full-width {
      padding: calc(var(--spacing-xxl) * 2);
    }
  }

  .user {
    align-self: flex-start;
    border-bottom-right-radius: 0;
    text-align: right;
  }
  .bot {
    border-bottom-left-radius: 0;
  }

  /* Colors */
  .bot {
    border-color: var(--border-color-primary);
    background: var(--background-fill-secondary);
  }

  .user {
    border-color: var(--border-color-accent-subdued);
    background-color: var(--color-accent-soft);
  }
  .message-row {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
  }

  .message-row.panel.user-row {
    background: var(--color-accent-soft);
  }

  .message-row.panel.bot-row {
    background: var(--background-fill-secondary);
  }

  .message-row:last-of-type {
    margin-bottom: var(--spacing-xxl);
  }

  .user-row.bubble {
    flex-direction: row;
    justify-content: flex-end;
  }
  @media (max-width: 480px) {
    .user-row.bubble {
      align-self: flex-end;
    }

    .bot-row.bubble {
      align-self: flex-start;
    }
    /* .message {
      width: 100%;
    } */
  }
  .avatar-container {
    align-self: flex-end;
    position: relative;
    justify-content: center;
    display: flex;
    text-align: center;
    flex-direction: column;
    width: 45px;
    align-items: center;
    flex-shrink: 0;
    bottom: 0;
  }

  .avatar-container.top {
    align-self: flex-start;
  }
  .avatar-container.middle {
    align-self: center;
  }
  .avatar-container.bottom {
    align-self: flex-end;
  }

  @media (max-width: 480px) {
    .avatar-container span {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .user-row.bubble > .avatar-container {
    order: 2;
    margin-left: 10px;
  }
  .bot-row.bubble > .avatar-container {
    margin-right: 10px;
  }

  .panel > .avatar-container {
    margin-left: 25px;
    align-self: center;
  }
  img.avatar-image {
    width: 35px;
    height: 35px;
    object-fit: cover;
    border-radius: 50%;
  }

  .message-buttons-user,
  .message-buttons-bot {
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    bottom: 0;
    height: var(--size-7);
    align-self: self-end;
    position: absolute;
    bottom: -15px;
    margin: 2px;
    padding-left: 5px;
    z-index: 1;
  }
  .message-buttons-bot {
    left: 10px;
  }
  .message-buttons-user {
    right: 5px;
  }

  /* .message-buttons-bot.message-buttons-bubble.with-avatar {
    left: 50px;
  }
  .message-buttons-user.message-buttons-bubble.with-avatar {
    right: 50px;
  } */

  .message-buttons-bubble {
    border: 1px solid var(--border-color-accent);
    background: var(--background-fill-secondary);
  }

  .message-buttons-panel {
    left: unset;
    right: 0px;
    top: 0px;
  }

  .share-button {
    position: absolute;
    top: 4px;
    right: 6px;
  }

  .selectable {
    cursor: pointer;
  }

  @keyframes dot-flashing {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0.8;
    }
  }
  .message-wrap .message :global(img) {
    max-height: 200px;
  }
  .message-wrap .message :global(video) {
    max-height: 400px;
  }
  .message-wrap .message :global(a) {
    color: var(--color-text-link);
    text-decoration: underline;
  }

  .message-wrap .bot :global(table),
  .message-wrap .bot :global(tr),
  .message-wrap .bot :global(td),
  .message-wrap .bot :global(th) {
    border: 1px solid var(--border-color-primary);
  }

  .message-wrap .user :global(table),
  .message-wrap .user :global(tr),
  .message-wrap .user :global(td),
  .message-wrap .user :global(th) {
    border: 1px solid var(--border-color-accent);
  }

  /* Lists */
  .message-wrap :global(ol),
  .message-wrap :global(ul) {
    padding-inline-start: 2em;
  }

  /* KaTeX */
  .message-wrap :global(span.katex) {
    font-size: var(--text-lg);
    direction: ltr;
  }

  /* Copy button */
  .message-wrap :global(div[class*='code_wrap'] > button) {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    z-index: 1;
    cursor: pointer;
    border-bottom-left-radius: var(--radius-sm);
    padding: 5px;
    padding: var(--spacing-md);
    width: 25px;
    height: 25px;
  }

  .message-wrap :global(code > button > span) {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    width: 12px;
    height: 12px;
  }
  .message-wrap :global(.check) {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    z-index: var(--layer-top);
    transition: opacity 0.2s;
    background: var(--background-fill-primary);
    padding: var(--size-1);
    width: 100%;
    height: 100%;
    color: var(--body-text-color);
  }

  .message-wrap :global(pre) {
    position: relative;
  }
</style>
