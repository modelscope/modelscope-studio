<svelte:options accessors={true} />

<script context="module" lang="ts">
  export { default as BaseExample } from './Example.svelte';
  export { default as BaseTextbox } from './shared/Input.svelte';
</script>

<script lang="ts">
  import { Block, BlockTitle } from '@gradio/atoms';
  import {
    type FileData,
    prepare_files,
    type upload_files,
  } from '@gradio/client';
  import type { LoadingStatus } from '@gradio/statustracker';
  import { StatusTracker } from '@gradio/statustracker';
  import type { Gradio, SelectData } from '@gradio/utils';
  import { upload as gradio_upload } from '@utils/upload';
  import { getContext } from 'svelte';

  import AudioRecorder from './shared/AudioRecorder.svelte';
  import { type ContextValue, setContextValue } from './shared/context';
  import FilePreview from './shared/FilePreview.svelte';
  import Input from './shared/Input.svelte';
  import SubmitButton from './shared/SubmitButton.svelte';
  import UploadButton from './shared/UploadButton.svelte';
  import type { MutilmodalInputData } from './shared/utils';
  import Webcam from './shared/Webcam.svelte';

  export let gradio: Gradio<{
    change: MutilmodalInputData;
    submit: never;
    blur: never;
    error: string;
    select: SelectData;
    input: never;
    focus: never;
    upload: never;
  }>;

  // input
  export let label = '';
  export let info: string | undefined = undefined;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let visible = true;
  export let value: MutilmodalInputData = {
    text: '',
    files: [],
  };
  export let lines: number;
  export let placeholder = '';
  export let show_label: boolean;
  export let max_lines: number;
  export let type: 'text' | 'password' | 'email' = 'text';
  export let container = true;
  export let scale: number | null = null;
  export let min_width: number | undefined = undefined;
  export let show_copy_button = false;
  export let loading_status: LoadingStatus | undefined = undefined;
  export let value_is_output = false;
  export let rtl = false;
  export let text_align: 'left' | 'right' | undefined = undefined;
  export let autofocus = false;
  export let autoscroll = true;
  export let interactive: boolean;
  export let sources: ('upload' | 'microphone' | 'webcam')[] = ['upload'];

  $: _sources = Array.from(new Set(sources));
  // upload button
  export let root = '';
  // export let proxy_url = '';

  export let upload_button_props: Record<string, any> = {};

  let _upload_button_props: typeof upload_button_props = {};
  $: _upload_button_props = {
    ..._upload_button_props,
    ...upload_button_props,
  };

  export let webcam_props: Record<string, any> = {};

  let _webcam_props: typeof webcam_props = {};
  $: _webcam_props = {
    ..._webcam_props,
    ...webcam_props,
  };

  //  submit button
  export let submit_button_props: Record<string, any> = {};
  let _submit_button_props: typeof submit_button_props = {};
  $: _submit_button_props = {
    ..._submit_button_props,
    ...submit_button_props,
  };

  // file preview
  export let file_preview_props: Record<string, any> = {};
  let _file_preview_props: typeof file_preview_props = {};
  $: _file_preview_props = {
    ..._file_preview_props,
    ...file_preview_props,
  };
  let uploading = false;
  const upload_fn = getContext<typeof upload_files>('upload_files');
  const upload: ContextValue['upload'] = async (files) => {
    try {
      uploading = true;
      const val = await (upload_fn
        ? gradio_upload(await prepare_files(files), root, upload_fn)
        : gradio.client.upload(
            await prepare_files(files),
            root,
            undefined,
            undefined
          ));
      return (val?.filter(Boolean) as FileData[]) || [];
    } catch {
      return [];
    } finally {
      uploading = false;
    }
  };
  setContextValue({
    upload,
  });
</script>

<Block
  {visible}
  {elem_id}
  {elem_classes}
  {scale}
  {min_width}
  allow_overflow={false}
  {container}
  padding={container}
>
  {#if loading_status}
    <StatusTracker
      autoscroll={gradio.autoscroll}
      i18n={gradio.i18n}
      {...loading_status}
    />
  {/if}
  {#if show_label && label}
    <BlockTitle {show_label} {info}>{label}</BlockTitle>
  {/if}
  <div class="input-content">
    <Input
      value={value.text}
      bind:value_is_output
      {show_label}
      {lines}
      {type}
      {rtl}
      {text_align}
      max_lines={!max_lines ? lines + 1 : max_lines}
      {placeholder}
      {show_copy_button}
      {autofocus}
      {container}
      {autoscroll}
      on:change={(e) => {
        value.text = e.detail;
        gradio.dispatch('change', value);
      }}
      on:input={() => gradio.dispatch('input')}
      on:submit={() => {
        if (uploading) {
          return;
        }
        gradio.dispatch('submit');
      }}
      on:blur={() => gradio.dispatch('blur')}
      on:select={(e) => gradio.dispatch('select', e.detail)}
      on:focus={() => gradio.dispatch('focus')}
      disabled={!interactive}
    />
  </div>
  <div class="controls">
    <span class="input-tools">
      {#each _sources as source}
        {#if source === 'upload'}
          <span class="tool-button upload-button">
            <UploadButton
              props={_upload_button_props}
              disabled={!interactive}
              i18n={gradio.i18n}
              on:change={(e) => {
                if (_upload_button_props.file_count === 'single') {
                  value.files = e.detail;
                } else {
                  value.files = [...value.files, ...e.detail];
                }
                gradio.dispatch('upload');
                gradio.dispatch('change', value);
              }}
              on:click
            />
          </span>
        {:else if source === 'microphone'}
          <span class="tool-button">
            <AudioRecorder
              i18n={gradio.i18n}
              disabled={!interactive}
              on:error={(e) => {
                gradio.dispatch('error', e.detail);
              }}
              on:change={(e) => {
                if (_upload_button_props.file_count === 'single') {
                  value.files = [e.detail];
                } else {
                  value.files = [...value.files, e.detail];
                }
                gradio.dispatch('upload');
                gradio.dispatch('change', value);
              }}
            />
          </span>
        {:else if source === 'webcam'}
          <span class="tool-button">
            <Webcam
              {..._webcam_props}
              i18n={gradio.i18n}
              disabled={!interactive}
              on:error={(e) => {
                gradio.dispatch('error', e.detail);
              }}
              on:change={(e) => {
                if (_upload_button_props.file_count === 'single') {
                  value.files = [e.detail];
                } else {
                  value.files = [...value.files, e.detail];
                }
                gradio.dispatch('upload');
                gradio.dispatch('change', value);
              }}
            />
          </span>
        {/if}
      {/each}
    </span>
    <span class="submit-button">
      <SubmitButton
        props={_submit_button_props}
        i18n={gradio.i18n}
        disabled={!interactive || uploading}
        on:click={() => gradio.dispatch('submit')}
      />
    </span>
  </div>
  {#if value.files?.length}
    <FilePreview
      on:select
      on:delete={(e) => {
        value.files = value.files.filter((_, i) => i !== e.detail);
        gradio.dispatch('change', value);
      }}
      loading={uploading}
      theme={gradio.theme}
      i18n={gradio.i18n}
      value={value.files}
      props={_file_preview_props}
      disabled={!interactive}
    />
  {/if}
</Block>

<style>
  .controls {
    display: flex;
    gap: 4px;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 10px;
  }
  .input-tools {
    display: flex;
    gap: 4px;
    flex: 1;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .tool-button {
    display: flex;
    align-items: center;
    min-height: 40px;
  }
  .submit-button {
    min-height: 40px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .upload-button {
    flex-shrink: 0;
  }
  .input-content {
    flex: 1;
  }
</style>
