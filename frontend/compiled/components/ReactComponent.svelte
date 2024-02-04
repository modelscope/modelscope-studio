<script lang="ts">
  import type { ComponentType } from 'react';
  import type { Root } from 'react-dom/client';
  import { afterUpdate, onDestroy } from 'svelte';
  import { getLocaleFromNavigator } from 'svelte-i18n';

  import { mount } from '../build-assets';

  export let component: ComponentType<any>;
  export let elem_style: string = '';
  export let elem_classes: string[] = [];
  export let theme = 'light';
  let render_container: HTMLDivElement | null = null;
  let root: Root;
  const locale = getLocaleFromNavigator();
  afterUpdate(() => {
    if (render_container) {
      root = mount(
        render_container,
        component,
        {
          children: null,
          ...$$restProps,
          theme,
          locale,
        },
        root
      );
    }
  });
  onDestroy(() => {
    root?.unmount();
  });
</script>

<div
  bind:this={render_container}
  class={elem_classes.join(' ')}
  style={elem_style}
></div>
