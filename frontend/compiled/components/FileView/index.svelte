<script lang="ts">
  import type { FileData } from '@gradio/client';

  import FileView from './shared/FileView.svelte';

  export let theme = 'light';
  export let file: FileData;
  export let link_disabled = false;
  export let excludes: string[] = [];
  export let elem_style = '';
  export let elem_classes: string[] = [];
  export let alt_text = file.alt_text || file.orig_name;
  function getType(mime_type = '') {
    let _type = 'link';
    if (mime_type.includes('audio')) {
      _type = 'audio';
    } else if (mime_type.includes('video')) {
      _type = 'video';
    } else if (mime_type.includes('image')) {
      _type = 'image';
    }
    return excludes.includes(_type) ? 'link' : _type;
  }
  $: type = getType(file.mime_type || '');
</script>

<FileView
  {...$$restProps}
  {theme}
  disabled={type === 'link' ? link_disabled : undefined}
  {elem_classes}
  {elem_style}
  {type}
  url={file.url}
  title={alt_text}
  filename={window.__is_colab__ ? null : file.orig_name || file.path}
/>
