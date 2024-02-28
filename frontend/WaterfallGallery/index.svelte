<script context="module" lang="ts">
  export { default as BaseGallery } from './shared/Gallery.svelte';
</script>

<script lang="ts">
  import { Block } from '@gradio/atoms';
  import type { LoadingStatus } from '@gradio/statustracker';
  import { StatusTracker } from '@gradio/statustracker';
  import type { Gradio, LikeData, SelectData, ShareData } from '@gradio/utils';
  import { createEventDispatcher } from 'svelte';

  import Gallery from './shared/Gallery.svelte';
  import type { Breakpoints, GalleryData } from './shared/utils';

  export let loading_status: LoadingStatus;
  export let show_progress: LoadingStatus['show_progress'] = 'full';
  export let show_label: boolean;
  export let has_more: boolean;
  export let label: string;
  export let action_label: string;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let visible = true;
  export let value: GalleryData | null = null;
  export let likeable: boolean;
  export let clickable: boolean;
  export let container = true;
  export let scale: number | null = null;
  export let min_width: number | undefined = undefined;
  export let columns: number | number[] | Breakpoints | undefined = [2];
  export let gap: number | [number, number] = 8;
  export let height: number | 'auto' = 'auto';
  export let preview: boolean;
  export let allow_preview = true;
  export let selected_index: number | null = null;
  export let show_share_button = false;
  export let object_fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' =
    'cover';
  export let show_download_button = false;
  export let gradio: Gradio<{
    change: typeof value;
    select: SelectData;
    click: Omit<SelectData, 'selected'>;
    share: ShareData;
    error: string;
    load_more: typeof value;
    like: LikeData;
    prop_change: Record<string, any>;
  }>;
  const dispatch = createEventDispatcher();

  const handle_like = (data: LikeData) => {
    gradio.dispatch('like', data);
  };

  $: selected_index, dispatch('prop_change', { selected_index });
</script>

<Block
  {visible}
  variant="solid"
  padding={false}
  {elem_id}
  {elem_classes}
  {container}
  {scale}
  {min_width}
  allow_overflow={false}
>
  <StatusTracker
    autoscroll={gradio.autoscroll}
    i18n={gradio.i18n}
    {...loading_status}
    {show_progress}
  />
  <Gallery
    on:click={(e) => gradio.dispatch('click', e.detail)}
    on:change={() => gradio.dispatch('change', value)}
    on:like={(e) => handle_like(e.detail)}
    on:select={(e) => gradio.dispatch('select', e.detail)}
    on:share={(e) => gradio.dispatch('share', e.detail)}
    on:error={(e) => gradio.dispatch('error', e.detail)}
    on:load_more={() => {
      gradio.dispatch('load_more', value);
    }}
    {likeable}
    {clickable}
    {label}
    {action_label}
    {value}
    {show_label}
    {object_fit}
    {has_more}
    {columns}
    {height}
    {preview}
    {gap}
    {allow_preview}
    bind:selected_index
    {show_share_button}
    {show_download_button}
    i18n={gradio.i18n}
  />
</Block>
