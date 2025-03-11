<script lang="ts">
  import { type FileData } from '@gradio/client';
  import { Microphone, Pause } from '@gradio/icons';
  import type { I18nFormatter } from '@gradio/utils';
  import { createEventDispatcher, onMount } from 'svelte';
  import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';
  import WaveSurfer from 'wavesurfer.js/dist/wavesurfer';

  import { getContextValue } from './context';
  import RemoveIcon from './RemoveIcon.svelte';
  import { format_time, process_audio } from './utils';

  export let i18n: I18nFormatter;
  export let disabled = false;
  let micWaveform: WaveSurfer;
  let record: RecordPlugin | null = null;
  let micDevices: MediaDeviceInfo[] = [];
  let microphoneContainer: HTMLDivElement;
  let deviceId: string;
  let seconds = 0;
  let interval: number;
  let timing = false;
  let paused = false;
  let open = false;

  $: if (disabled) {
    open = false;
  }

  const dispatch = createEventDispatcher<{
    error: string;
    change: FileData;
  }>();
  const { upload } = getContextValue();

  const handle_upload = async (blobs: Uint8Array[] | Blob[]): Promise<void> => {
    const _audio_blob = new File(blobs, 'audio.wav', {
      type: 'audio/wav',
    });
    const value = (await upload([_audio_blob]))[0];
    dispatch('change', value);
  };

  const get_audio_devices = () => {
    RecordPlugin.getAvailableAudioDevices().then(
      (devices: MediaDeviceInfo[]) => {
        micDevices = devices.filter((device) => device.deviceId);
      }
    );
  };
  get_audio_devices();

  const start_interval = (): void => {
    clearInterval(interval);
    interval = setInterval(() => {
      seconds++;
    }, 1000) as unknown as number;
  };

  const cleanup = (): void => {
    seconds = 0;
    timing = false;
    paused = false;
    clearInterval(interval);
    if (record?.isPaused()) {
      record?.resumeRecording();
      record?.stopRecording();
    } else {
      record?.stopRecording();
    }
  };

  const create_mic_waveform = (): void => {
    if (micWaveform) {
      micWaveform.destroy();
    }
    if (!microphoneContainer) {
      return;
    }
    // eslint-disable-next-line svelte/no-dom-manipulating
    microphoneContainer.innerHTML = '';

    micWaveform = WaveSurfer.create({
      normalize: false,
      container: microphoneContainer,
    });

    record = micWaveform.registerPlugin(RecordPlugin.create());

    record.on('record-start', () => {
      record?.startMic();
      if (micDevices.length === 0) {
        get_audio_devices();
      }
      start_interval();
      paused = false;
      timing = true;
    });

    record.on('record-pause', () => {
      paused = true;
      clearInterval(interval);
    });

    record.on('record-end', async (blob) => {
      if (record?.isPaused()) {
        record.resumeRecording();
        record.stopRecording();
      }
      record?.stopMic();

      if (!open) {
        return;
      }
      const array_buffer = await blob.arrayBuffer();
      const context = new AudioContext();
      const audio_buffer = await context.decodeAudioData(array_buffer);

      if (audio_buffer) {
        await process_audio(audio_buffer).then((audio: Uint8Array) => {
          handle_upload([audio]);
        });
      }
    });
    record.on('record-resume', () => {
      paused = false;
      start_interval();
    });
  };
  onMount(() => {
    create_mic_waveform();
  });

  $: if (!open) {
    cleanup();
  }
</script>

<div style="display: none;" bind:this={microphoneContainer}></div>
<button
  style={open ? 'display: none;' : ''}
  class="icon-button"
  class:disabled
  on:click={() => {
    if (disabled) {
      return;
    }
    open = true;
  }}
>
  <Microphone />
</button>
<div style={!open ? 'display: none;' : ''} class="controls">
  <div class="wrapper">
    <div class="record-tools">
      {#if timing}
        <button
          class={paused ? 'stop-button-paused' : 'stop-button'}
          on:click={cleanup}
          >{`${i18n('audio.stop')} ${format_time(seconds)}`}</button
        >

        <button
          class={paused ? 'resume-button' : 'pause-button'}
          on:click={() => {
            if (record?.isPaused()) {
              record?.resumeRecording();
            } else {
              record?.pauseRecording();
            }
          }}
        >
          {#if paused}
            {i18n('audio.resume')}
          {:else}
            <Pause />
          {/if}
        </button>
      {:else}
        <button
          class="record record-button"
          on:click={() =>
            record
              ?.startRecording({
                deviceId,
              })
              .catch(() => {
                dispatch('error', i18n('audio.allow_recording_access'));
              })}>{i18n('audio.record')}</button
        >
      {/if}
    </div>
    <select
      class="mic-select"
      aria-label="Select input device"
      disabled={micDevices.length === 0}
      on:change={(e) => {
        deviceId = e.currentTarget.value;
      }}
    >
      {#if micDevices.length === 0}
        <option value="">{i18n('audio.no_microphone')}</option>
      {:else}
        {#each micDevices as micDevice (micDevice.deviceId)}
          <option value={micDevice.deviceId}>{micDevice.label}</option>
        {/each}
      {/if}
    </select>
  </div>
  <button
    class="icon-button"
    on:click={() => {
      open = false;
    }}
  >
    <RemoveIcon />
  </button>
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
  button {
    outline: none;
    margin-right: var(--spacing-md);
  }
  .mic-select {
    outline: none;
    height: var(--size-8);
    background: var(--block-background-fill);
    padding: 0px var(--spacing-xxl);
    border-radius: var(--radius-full);
    font-size: var(--text-md);
    border: 1px solid var(--neutral-400);
  }

  .controls {
    display: flex;
    border: var(--button-border-width) solid
      var(--button-secondary-border-color);
    padding: 3px;
    border-radius: var(--radius-lg);
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
  }

  .controls select {
    text-overflow: ellipsis;
    max-width: var(--size-40);
  }

  @media (max-width: 375px) {
    .controls select {
      width: 100%;
    }
  }
  .record-tools {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  .wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
    gap: 4px;
  }

  .stop-button-paused,
  .stop-button {
    display: flex;
    padding: 0 var(--spacing-xxl);
    height: var(--size-8);
    background-color: var(--block-background-fill);
    border-radius: var(--radius-3xl);
    align-items: center;
    border: 1px solid var(--neutral-400);
  }

  .stop-button-paused::before {
    content: '';
    height: var(--size-4);
    width: var(--size-4);
    border-radius: var(--radius-full);
    background: var(--primary-600);
    margin-right: var(--spacing-xl);
  }
  .stop-button::before {
    content: '';
    height: var(--size-4);
    width: var(--size-4);
    border-radius: var(--radius-full);
    background: var(--primary-600);
    margin-right: var(--spacing-xl);
    animation: scaling 1800ms infinite;
  }

  .record-button::before {
    content: '';
    height: var(--size-4);
    width: var(--size-4);
    border-radius: var(--radius-full);
    background: var(--primary-600);
    margin-right: var(--spacing-xl);
  }

  .record-button {
    padding: 0 var(--spacing-xxl);
    height: var(--size-8);
    background-color: var(--block-background-fill);
    border-radius: var(--radius-3xl);
    display: flex;
    align-items: center;
    border: 1px solid var(--neutral-400);
  }

  .stop-button:disabled {
    cursor: not-allowed;
  }

  .record-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @keyframes scaling {
    0% {
      background-color: var(--primary-600);
      scale: 1;
    }
    50% {
      background-color: var(--primary-600);
      scale: 1.2;
    }
    100% {
      background-color: var(--primary-600);
      scale: 1;
    }
  }

  .pause-button {
    height: var(--size-8);
    width: var(--size-20);
    border: 1px solid var(--neutral-400);
    border-radius: var(--radius-3xl);
    padding: var(--spacing-md);
  }

  .resume-button {
    height: var(--size-8);
    width: var(--size-20);
    border: 1px solid var(--neutral-400);
    border-radius: var(--radius-3xl);
    padding: var(--spacing-xl);
    line-height: 1px;
    font-size: var(--text-md);
  }
</style>
