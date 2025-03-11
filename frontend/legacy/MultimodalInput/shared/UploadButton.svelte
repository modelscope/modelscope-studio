<script lang="ts">
  import { BaseButton } from '@gradio/button';
  import { type FileData } from '@gradio/client';
  import type { I18nFormatter } from '@gradio/utils';
  import { createEventDispatcher, tick } from 'svelte';

  import { getContextValue } from './context';
  import UploadIcon from './UploadIcon.svelte';

  export let i18n: I18nFormatter;
  export let disabled = false;
  export let props: Record<string, any> = {};

  $: file_count = (props.file_count || 'multiple') as
    | 'single'
    | 'multiple'
    | 'directory';
  $: file_types = (props.file_types || []) as string[];
  const dispatch = createEventDispatcher<{
    click: void;
    change: FileData[];
  }>();

  let hidden_upload: HTMLInputElement;
  let accept_file_types: string | null;
  const { upload } = getContextValue();

  $: if (file_types == null) {
    accept_file_types = null;
  } else {
    // eslint-disable-next-line svelte/no-reactive-reassign
    file_types = file_types.map((x) => {
      if (x.startsWith('.')) {
        return x;
      }
      return x + '/*';
    });
    accept_file_types = file_types.join(', ');
  }

  function openFileUpload(): void {
    dispatch('click');
    hidden_upload.click();
  }

  async function loadFiles(files: FileList): Promise<void> {
    let _files: File[] = Array.from(files);
    if (!files.length) {
      return;
    }
    if (file_count === 'single') {
      _files = [files[0]];
    }
    await tick();
    const all_file_data = await upload(_files);
    dispatch('change', all_file_data);
  }

  async function loadFilesFromUpload(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;

    if (!target.files) return;
    await loadFiles(target.files);
  }

  function clearInputValue(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.value) target.value = '';
  }
</script>

<input
  webkitdirectory={file_count === 'directory' || undefined}
  mozdirectory={file_count === 'directory' || undefined}
  class="hide"
  accept={accept_file_types}
  type="file"
  bind:this={hidden_upload}
  on:change={loadFilesFromUpload}
  on:click={clearInputValue}
  multiple={file_count === 'multiple' || undefined}
/>

<BaseButton
  variant="secondary"
  {...props}
  elem_classes={props.elem_classes || []}
  on:click={openFileUpload}
  disabled={disabled || props.disabled}
>
  {#if !props.icon}
    <span style="margin-right: 4px;">
      <UploadIcon />
    </span>
  {/if}
  {i18n(props.label || 'upload_text.click_to_upload')}
</BaseButton>

<style>
  .hide {
    display: none;
  }
</style>
