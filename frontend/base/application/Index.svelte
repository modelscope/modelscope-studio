<svelte:options accessors={true} />

<script lang="ts">
  import '@svelte-preprocess-react/inject';
  import type { Gradio } from '@gradio/utils';
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

  export let value: ApplicationPageData;
  export let _internal: {
    bind_mount_event?: boolean;
    bind_resize_event?: boolean;
    bind_unmount_event?: boolean;
  } = {};
  export let gradio: Gradio<{
    custom: any;
    mount: ApplicationPageData;
    resize: ApplicationPageData;
    unmount: ApplicationPageData;
  }>;
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
    if (_internal.bind_mount_event) {
      gradio.dispatch('mount', get_data());
    }
  }

  const on_resize = wrap_event(() => {
    value = get_data();
    if (_internal.bind_resize_event) {
      gradio.dispatch('resize', get_data());
    }
  }, 500);

  const on_before_unload = wrap_event(() => {
    value = get_data();
    if (_internal.bind_unmount_event) {
      gradio.dispatch('unmount', get_data());
    }
  });

  onMount(() => {
    window.ms_globals.dispatch = (...args) => {
      gradio.dispatch('custom', args);
    };
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
  <div class="ms-gr-antd-container">
    <slot />
  </div>
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
