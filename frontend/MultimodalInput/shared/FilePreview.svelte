<script lang="ts">
  import IconButton from '@gradio/atoms/src/IconButton.svelte';
  import type { FileData } from '@gradio/client';
  // import { normalise_file } from '@gradio/client';
  import type { I18nFormatter, SelectData } from '@gradio/utils';
  import { FileView } from '@modelscope-studio/compiled';
  import { createEventDispatcher } from 'svelte';

  import Loader from './Loader.svelte';
  import RemoveIcon from './RemoveIcon.svelte';
  import { prettyBytes } from './utils';

  const dispatch = createEventDispatcher<{
    select: SelectData;
    delete: number;
  }>();
  export let value: FileData | FileData[];
  export let selectable = false;
  export let i18n: I18nFormatter;
  // export let root: string;
  // export let proxy_url: null | string;
  export let theme = 'light';
  export let loading = false;
  export let disabled: boolean;
  export let props: {
    height?: number;
  } = {};

  $: normalized_files = (Array.isArray(value) ? value : [value]).map(
    (_file) => {
      // const file = normalise_file(_file, root, proxy_url) as FileData;
      const file = _file;

      return file;
    }
  );
</script>

<div
  class="file-preview-holder"
  style="max-height: {typeof props.height === 'undefined'
    ? 'auto'
    : props.height + 'px'};"
>
  {#if loading}
    <Loader />
  {/if}
  <table class="file-preview">
    <tbody>
      {#each normalized_files as file, i}
        <tr
          class="file"
          class:selectable
          on:click={() =>
            dispatch('select', {
              value: file.orig_name,
              index: i,
            })}
        >
          <td class="filename" aria-label={file.orig_name}>
            <FileView
              {theme}
              style={{ maxHeight: 80 }}
              excludes={['video']}
              link_disabled={true}
              {file}
              alt_text={file.alt_text || file.orig_name}
            />
          </td>

          <td class="download">
            {#if file.url}
              <a
                href={file.url}
                rel="noopener noreferrer"
                target="_blank"
                download={window.__is_colab__ ? null : file.orig_name}
              >
                {@html file.size != null
                  ? prettyBytes(file.size)
                  : '(size unknown)'}&nbsp;&#8675;
              </a>
            {:else}
              {i18n('file.uploading')}
            {/if}
          </td>
          <td class="clear">
            <IconButton
              Icon={RemoveIcon}
              size="small"
              {disabled}
              on:click={() => {
                dispatch('delete', i);
              }}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .file-preview-holder {
    position: relative;
  }
  .file-preview {
    table-layout: fixed;
    width: var(--size-full);
    max-height: var(--size-60);
    overflow-y: auto;
    margin-top: var(--size-1);
    color: var(--body-text-color);
  }

  .file {
    display: flex;
    width: var(--size-full);
  }

  .file > * {
    padding: var(--size-1) var(--size-2-5);
  }

  .filename {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .download {
    min-width: 5rem;
    width: 15%;
    white-space: nowrap;
    text-align: right;
  }

  .clear {
    white-space: nowrap;
    text-align: right;
  }

  .download:hover {
    text-decoration: underline;
  }
  .download > :global(a) {
    color: var(--link-text-color);
  }

  .download > :global(a:hover) {
    color: var(--link-text-color-hover);
  }
  .download > :global(a:visited) {
    color: var(--link-text-color-visited);
  }
  .download > :global(a:active) {
    color: var(--link-text-color-active);
  }
  .selectable {
    cursor: pointer;
  }

  tbody > tr:nth-child(even) {
    background: var(--block-background-fill);
  }

  tbody > tr:nth-child(odd) {
    background: var(--table-odd-background-fill);
  }

  td {
    display: flex;
    align-items: center;
  }
</style>
