<script lang="ts">
  import { File } from '@gradio/icons';
  import { onMount } from 'svelte';

  import type { MutilmodalInputData } from './shared/utils';

  export let value: MutilmodalInputData;
  export let type: 'gallery' | 'table';
  export let selected = false;
  let size: number;
  let el: HTMLDivElement;

  function set_styles(element: HTMLElement, el_width: number): void {
    if (!element || !el_width) return;
    el.style.setProperty(
      '--local-text-width',
      `${el_width < 150 ? el_width : 200}px`
    );
    el.style.whiteSpace = 'unset';
  }

  onMount(() => {
    set_styles(el, size);
  });
</script>

<div
  bind:clientWidth={size}
  bind:this={el}
  class:table={type === 'table'}
  class:gallery={type === 'gallery'}
  class:selected
>
  <span>{value.text}</span>
  {#if value.files?.length > 0}
    <span class="files">
      <i>
        <File />
      </i>
      {value.files.map((file) => file.orig_name).join(', ')}
    </span>
  {/if}
</div>

<style>
  .gallery {
    padding: var(--size-1) var(--size-2);
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    min-width: var(--local-text-width);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .files {
    display: flex;
    align-items: center;
  }

  i {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 2px;
  }
</style>
