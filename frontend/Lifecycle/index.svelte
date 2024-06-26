<script lang="ts">
  import type { Gradio } from '@gradio/utils';
  import { onDestroy, onMount } from 'svelte';
  import { getLocaleFromNavigator } from 'svelte-i18n';

  import type { LifecycleData } from './shared/utils';

  // export let interactive: boolean;
  export let value: LifecycleData;
  export let gradio: Gradio<{
    mount: LifecycleData;
    resize: LifecycleData;
    unmount: LifecycleData;
  }>;
  export let _bind_mount_event: boolean = false;
  export let _bind_resize_event: boolean = false;
  export let _bind_unmount_event: boolean = false;

  function get_data(): LifecycleData {
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
    if (_bind_mount_event) {
      gradio.dispatch('mount', get_data());
    }
  }

  const on_resize = wrap_event(() => {
    value = get_data();
    if (_bind_resize_event) {
      gradio.dispatch('resize', get_data());
    }
  }, 500);

  const on_before_unload = wrap_event(() => {
    value = get_data();
    if (_bind_unmount_event) {
      gradio.dispatch('unmount', get_data());
    }
  });

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

<div class="lifecycle-placeholder"></div>

<style>
  .lifecycle-placeholder {
    width: 0;
    height: 0;
    display: none;
  }
</style>
