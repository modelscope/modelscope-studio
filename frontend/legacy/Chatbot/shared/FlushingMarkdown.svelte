<script lang="ts">
  import {
    Markdown,
    type MarkdownCustomData,
  } from '@modelscope-studio/legacy-compiled';
  import { afterUpdate, createEventDispatcher, onDestroy } from 'svelte';

  export let message = '';
  export let complete_message = false;
  export let flushing = false;
  export let theme = 'light';
  export let flushing_speed = 5;
  let display_message = '';
  let skip_message_positions: {
    start: number;
    end: number;
  }[] = [];
  let timeout: number;
  let i = 0;
  const flushing_end_tag = ':flushing-end';
  let last_flushing_end_index: number;

  $: _flushing_timeout =
    100 - (Math.max(Math.min(flushing_speed, 10), 1) * 100) / (10 - 1);

  const dispatch = createEventDispatcher<{
    flushed: string;
    update: void;
    custom: MarkdownCustomData;
  }>();
  const skip_tag_reg =
    /:::llm-thinking|::llm-thinking-title|::accordion-title|:flushing-end/g;

  function on_custom(tag: string, tag_index: number, value?: any) {
    dispatch('custom', { tag, tag_index, value });
  }

  $: if (flushing && complete_message && message === display_message) {
    dispatch('flushed', message);
  }

  $: {
    skip_message_positions = [
      ...Array.from(message.matchAll(skip_tag_reg)).map((match) => ({
        start: match.index!,
        end: match.index! + match[0].length,
      })),
    ];
  }

  $: if (message !== display_message) {
    clearTimeout(timeout);

    if (!flushing) {
      display_message = message;
    } else {
      last_flushing_end_index = message.lastIndexOf(flushing_end_tag);
      if (last_flushing_end_index !== -1) {
        const flushing_end_message = message.slice(
          0,
          last_flushing_end_index + flushing_end_tag.length
        );
        if (!display_message.startsWith(flushing_end_message)) {
          display_message = flushing_end_message;
          i = last_flushing_end_index;
        }
      }

      if (!message.startsWith(display_message)) {
        display_message = message.slice(0, i);
      }
      const last_time = Date.now();
      const step = () => {
        if (i >= message.length) {
          return;
        }
        // if switch to other tab, setTimeout will stop
        const scale = Math.min(
          Math.max(Math.round((Date.now() - last_time) / _flushing_timeout), 1),
          message.length - display_message.length
        );

        display_message += message.slice(i, i + scale);
        i += scale;

        const position = skip_message_positions.find(
          (pos) => pos.start <= i && i < pos.end
        );
        if (position) {
          display_message += message.slice(position.start, position.end);
          i += position.end - position.start;
        }
      };

      timeout = setTimeout(step, _flushing_timeout) as unknown as number;
    }
  }

  onDestroy(() => {
    clearTimeout(timeout);
  });
  afterUpdate(() => {
    dispatch('update');
  });
</script>

<Markdown
  {...$$restProps}
  elem_style="width: 100%"
  {last_flushing_end_index}
  end={!flushing || complete_message}
  flushing={flushing && (message !== display_message || !complete_message)}
  {theme}
  text={display_message}
  {on_custom}
/>
