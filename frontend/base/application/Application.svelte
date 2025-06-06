<svelte:options accessors={true} />

<script lang="ts">
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import { styleObject2String } from '@utils/style';
  import cls from 'classnames';
  import { onDestroy, onMount } from 'svelte';
  import { getLocaleFromNavigator } from 'svelte-i18n';

  interface ApplicationPageData {
    language: string;
    userAgent: string;
    theme: string;
    screen: {
      width: number;
      height: number;
      scrollY: number;
      scrollX: number;
    };
  }
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties | string = {};
  export let value: ApplicationPageData;
  export let _internal: {
    bind_mount_event?: boolean;
    bind_resize_event?: boolean;
    bind_unmount_event?: boolean;
    bind_custom_event?: boolean;
  } = {};
  export let gradio: Gradio<{
    custom: any;
    mount: ApplicationPageData;
    resize: ApplicationPageData;
    unmount: ApplicationPageData;
  }>;
  export let attached_events: string[] = [];
  export let visible = true;
  function get_data(): ApplicationPageData {
    return {
      theme: gradio.theme,
      language: getLocaleFromNavigator() || 'en',
      userAgent: navigator.userAgent,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollY: window.scrollY,
        scrollX: window.scrollX,
      },
    };
  }

  function debounce<T extends (...args: any[]) => any>(cb: T, delay: number) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => cb(...args), delay);
    };
  }

  function wrap_event<T extends (...args: any[]) => any>(
    cb: T,
    debounce_delay?: number
  ) {
    const fn = (...args: Parameters<T>) => {
      return cb(...args);
    };
    return typeof debounce_delay === 'number'
      ? debounce(fn, debounce_delay)
      : fn;
  }

  function on_mount() {
    value = get_data();
    if (_internal.bind_mount_event || attached_events.includes('mount')) {
      gradio.dispatch('mount', get_data());
    }
  }

  const on_resize = wrap_event(() => {
    value = get_data();
    if (_internal.bind_resize_event || attached_events.includes('resize')) {
      gradio.dispatch('resize', get_data());
    }
  }, 500);

  const on_before_unload = wrap_event(() => {
    value = get_data();
    if (_internal.bind_unmount_event || attached_events.includes('unmount')) {
      gradio.dispatch('unmount', get_data());
    }
  });
  window.ms_globals.dispatch = (...args) => {
    gradio.dispatch('custom', args);
  };

  onMount(() => {
    requestAnimationFrame(() => {
      on_mount();
    });

    window.addEventListener('resize', on_resize);
    window.addEventListener('beforeunload', on_before_unload);
  });

  onDestroy(() => {
    window.removeEventListener('resize', on_resize);
    window.removeEventListener('beforeunload', on_before_unload);
  });
</script>

{#if visible}
  <div
    class={cls('ms-gr-container', elem_classes)}
    id={elem_id}
    style={typeof elem_style === 'object'
      ? styleObject2String(elem_style)
      : elem_style}
  >
    <slot />
  </div>
{/if}

<style>
  :global(.ms-gr-noop-class) {
    display: none;
  }
</style>
