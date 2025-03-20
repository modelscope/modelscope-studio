<script lang="ts">
  import type { FileData } from '@gradio/client';
  import {
    Camera,
    Circle,
    DropdownArrow,
    Image,
    Square,
    Video,
    Webcam,
  } from '@gradio/icons';
  import type { I18nFormatter } from '@gradio/utils';
  import { createEventDispatcher, onMount } from 'svelte';

  import { getContextValue } from './context';
  import RemoveIcon from './RemoveIcon.svelte';
  import { format_time } from './utils';

  export let mirror_webcam: boolean = true;
  export let include_audio: boolean = false;
  export let disabled = false;
  export let i18n: I18nFormatter;
  export let file_type: 'mp4' | 'webm' = 'webm';

  let video_source: HTMLVideoElement;
  let canvas: HTMLCanvasElement;
  let open = false;
  let seconds = 0;
  let accessed = false;
  let interval: number;

  let mode: 'image' | 'video' = 'image';
  const dispatch = createEventDispatcher<{
    change: FileData;
    error: string;
  }>();
  const { upload } = getContextValue();

  onMount(() => (canvas = document.createElement('canvas')));
  const size = {
    width: { ideal: 1920 },
    height: { ideal: 1440 },
  };

  const start_interval = (): void => {
    clearInterval(interval);
    recording = true;
    seconds = 0;
    interval = setInterval(() => {
      seconds++;
    }, 1000) as unknown as number;
  };

  const cleanup = (): void => {
    media_recorder?.stop();
    clearInterval(interval);
    seconds = 0;
    recording = false;
  };

  async function access_webcam(device_id?: string): Promise<void> {
    if (!device_id && accessed) {
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      dispatch('error', i18n('image.no_webcam_support'));
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: device_id ? { deviceId: { exact: device_id }, ...size } : size,
        audio: include_audio,
      });
      // eslint-disable-next-line svelte/infinite-reactive-loop
      accessed = true;
      video_source.srcObject = stream;
      video_source.muted = true;
      video_source.play();
    } catch (err) {
      if (err instanceof DOMException && err.name == 'NotAllowedError') {
        dispatch('error', i18n('image.allow_webcam_access'));
      } else {
        throw err;
      }
    }
  }

  function take_picture(): void {
    const context = canvas.getContext('2d')!;

    if (video_source.videoWidth && video_source.videoHeight) {
      canvas.width = video_source.videoWidth;
      canvas.height = video_source.videoHeight;
      context.drawImage(
        video_source,
        0,
        0,
        video_source.videoWidth,
        video_source.videoHeight
      );
      if (mirror_webcam) {
        context.scale(-1, 1);
        context.drawImage(video_source, -video_source.videoWidth, 0);
      }

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const _image_blob = new File([blob], 'image.png', {
              type: 'image/png',
            });
            const value = (await upload([_image_blob]))[0];
            dispatch('change', value);
          }
        },
        'image/png',
        0.8
      );
    }
  }

  let recording = false;

  let recorded_blobs: BlobPart[] = [];
  let stream: MediaStream;
  let mimeType: string;
  let media_recorder: MediaRecorder;

  function take_recording(): void {
    if (recording) {
      cleanup();
      const video_blob = new Blob(recorded_blobs, { type: mimeType });
      const ReaderObj = new FileReader();
      ReaderObj.onload = async function (e): Promise<void> {
        if (e.target) {
          const _video_blob = new File(
            [video_blob],
            'video.' + mimeType.substring(6)
          );
          const value = (await upload([_video_blob]))[0];
          dispatch('change', value);
        }
      };
      ReaderObj.readAsDataURL(video_blob);
    } else {
      recorded_blobs = [];
      const validMimeTypes =
        file_type === 'webm'
          ? ['video/webm', 'video/mp4']
          : ['video/mp4', 'video/webm'];
      for (const validMimeType of validMimeTypes) {
        if (MediaRecorder.isTypeSupported(validMimeType)) {
          mimeType = validMimeType;
          break;
        }
      }
      if (mimeType === null) {
        console.error('No supported MediaRecorder mimeType');
        return;
      }
      media_recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });
      media_recorder.addEventListener('dataavailable', function (e) {
        recorded_blobs.push(e.data);
      });
      media_recorder.start(200);
      start_interval();
    }
  }

  async function select_source(): Promise<void> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    video_sources = devices.filter((device) => device.kind === 'videoinput');
    options_open = true;
  }

  let video_sources: MediaDeviceInfo[] = [];
  async function selectVideoSource(device_id: string): Promise<void> {
    await access_webcam(device_id);
    options_open = false;
  }

  let options_open = false;

  function click_outside(node: Node, cb: any): any {
    const handle_click = (event: MouseEvent): void => {
      if (
        node &&
        !node.contains(event.target as Node) &&
        !event.defaultPrevented
      ) {
        cb(event);
      }
    };

    document.addEventListener('click', handle_click, true);

    return {
      destroy() {
        document.removeEventListener('click', handle_click, true);
      },
    };
  }

  function handle_click_outside(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    options_open = false;
  }
  // function stop_tracks(): void {
  //   if (video_source) {
  //     video_source.pause();
  //     video_source.srcObject = null;
  //   }
  //   stream?.getTracks().forEach((track) => track.stop());
  // }
  $: if (open) {
    // eslint-disable-next-line svelte/infinite-reactive-loop
    !accessed && access_webcam();
  } else {
    cleanup();
    // stop_tracks();
  }
</script>

<button
  style={open ? 'display: none;' : ''}
  class="icon-button webcam"
  class:disabled
  on:click={() => {
    if (disabled) {
      return;
    }
    open = true;
  }}
>
  <Webcam />
</button>

<div style={!open ? 'display: none;' : ''} class="controls">
  <!-- svelte-ignore a11y-media-has-caption -->
  <!-- need to suppress for video streaming https://github.com/sveltejs/svelte/issues/5967 -->
  <div class="wrap">
    <video bind:this={video_source} class:flip={mirror_webcam} />
    <div class="button-wrap">
      <button
        on:click={mode === 'image' ? take_picture : take_recording}
        aria-label={mode === 'image' ? 'capture photo' : 'start recording'}
      >
        {#if mode === 'video'}
          {#if recording}
            <div class="recording-wrap">
              <div class="icon red" title="stop recording">
                <Square />
              </div>
              <span>{format_time(seconds)}</span>
            </div>
          {:else}
            <div class="icon red" title="start recording">
              <Circle />
            </div>
          {/if}
        {:else}
          <div class="icon" title="capture photo">
            <Camera />
          </div>
        {/if}
      </button>

      {#if !recording}
        <button
          on:click={select_source}
          aria-label={mode === 'image' ? 'capture photo' : 'start recording'}
        >
          <div class="icon" title="select video source">
            <DropdownArrow />
          </div>
        </button>
      {/if}
    </div>
    {#if options_open}
      <select
        class="select-wrap"
        aria-label="select source"
        use:click_outside={handle_click_outside}
      >
        <button
          class="inset-icon"
          on:click|stopPropagation={() => (options_open = false)}
        >
          <DropdownArrow />
        </button>
        {#if video_sources.length === 0}
          <option value="">{i18n('common.no_devices')}</option>
        {:else}
          {#each video_sources as source (source.deviceId)}
            <option on:click={() => selectVideoSource(source.deviceId)}>
              {source.label}
            </option>
          {/each}
        {/if}
      </select>
    {/if}
  </div>
  <div class="extra-wrap">
    <button
      class="icon-button"
      on:click={() => {
        if (mode === 'image') {
          mode = 'video';
        } else {
          mode = 'image';
        }
      }}
    >
      {#if mode === 'image'}
        <Video />
      {:else}
        <Image />
      {/if}
    </button>
    <button
      class="icon-button"
      on:click={() => {
        open = false;
      }}
    >
      <RemoveIcon />
    </button>
  </div>
</div>

<style>
  .icon-button {
    cursor: pointer;
    width: 22px;
    height: 22px;
    margin: 0 var(--spacing-xs);
    padding: var(--spacing-xs);
    border: none;
    background: none;
    flex-shrink: 0;
  }
  .icon-button.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .webcam {
    padding: 0;
    margin: 0;
  }

  button {
    outline: none;
  }

  .controls {
    display: flex;
    border: var(--button-border-width) solid
      var(--button-secondary-border-color);
    padding: 3px;
    width: var(--size-full);
    max-width: 400px;
    border-radius: var(--radius-lg);
    align-items: stretch;
    justify-content: space-between;
    overflow: hidden;
  }
  .wrap {
    flex: 1;
    position: relative;
  }
  .extra-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    position: relative;
  }

  video {
    border-radius: var(--radius-md);
    width: var(--size-full);
    object-fit: cover;
  }

  .button-wrap {
    position: absolute;
    background-color: var(--block-background-fill);
    border: 1px solid var(--border-color-primary);
    border-radius: var(--radius-xl);
    padding: var(--size-1-5);
    display: flex;
    bottom: var(--size-2);
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: var(--shadow-drop-lg);
    border-radius: var(--radius-xl);
    line-height: var(--size-3);
    color: var(--button-secondary-text-color);
  }

  @media (--screen-md) {
    button {
      bottom: var(--size-4);
    }
  }

  @media (--screen-xl) {
    button {
      bottom: var(--size-8);
    }
  }

  .icon {
    opacity: 0.8;
    width: 18px;
    height: 18px;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .recording-wrap {
    display: flex;
    align-items: center;
  }
  .recording-wrap span {
    margin-left: 4px;
  }

  .red {
    fill: red;
    stroke: red;
  }

  .flip {
    transform: scaleX(-1);
  }

  .select-wrap {
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    appearance: none;
    color: var(--button-secondary-text-color);
    background-color: transparent;
    width: 95%;
    font-size: var(--text-md);
    position: absolute;
    bottom: var(--size-2);
    background-color: var(--block-background-fill);
    box-shadow: var(--shadow-drop-lg);
    border-radius: var(--radius-xl);
    z-index: var(--layer-top);
    border: 1px solid var(--border-color-primary);
    text-align: left;
    line-height: var(--size-4);
    white-space: nowrap;
    text-overflow: ellipsis;
    left: 50%;
    transform: translate(-50%, 0);
    max-width: var(--size-52);
  }

  .select-wrap > option {
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid var(--border-color-accent);
    padding-right: var(--size-8);
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .select-wrap > option:hover {
    background-color: var(--color-accent);
  }

  .select-wrap > option:last-child {
    border: none;
  }

  .inset-icon {
    position: absolute;
    top: 5px;
    right: -6.5px;
    width: var(--size-10);
    height: var(--size-5);
    opacity: 0.8;
  }
</style>
