import type { FileData } from '@gradio/client';

export interface MutilmodalInputData {
  text: string;
  files: FileData[];
}

export const prettyBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'PB'];
  let i = 0;
  while (bytes > 1024) {
    bytes /= 1024;
    i++;
  }
  const unit = units[i];
  return bytes.toFixed(1) + '&nbsp;' + unit;
};

export function audioBufferToWav(audioBuffer: AudioBuffer): Uint8Array {
  // Write WAV header
  const writeString = function (
    view: DataView,
    offset: number,
    string: string
  ): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const numOfChan = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  let offset = 0;

  writeString(view, offset, 'RIFF');
  offset += 4;
  view.setUint32(offset, length - 8, true);
  offset += 4;
  writeString(view, offset, 'WAVE');
  offset += 4;
  writeString(view, offset, 'fmt ');
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4; // Sub-chunk size, 16 for PCM
  view.setUint16(offset, 1, true);
  offset += 2; // PCM format
  view.setUint16(offset, numOfChan, true);
  offset += 2;
  view.setUint32(offset, audioBuffer.sampleRate, true);
  offset += 4;
  view.setUint32(offset, audioBuffer.sampleRate * 2 * numOfChan, true);
  offset += 4;
  view.setUint16(offset, numOfChan * 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString(view, offset, 'data');
  offset += 4;
  view.setUint32(offset, audioBuffer.length * numOfChan * 2, true);
  offset += 4;

  // Write PCM audio data
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const channel = audioBuffer.getChannelData(i);
    for (let j = 0; j < channel.length; j++) {
      view.setInt16(offset, channel[j] * 0xffff, true);
      offset += 2;
    }
  }

  return new Uint8Array(buffer);
}

export const process_audio = (
  audioBuffer: AudioBuffer,
  start?: number,
  end?: number
): Promise<Uint8Array> => {
  const audioContext = new AudioContext();
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;

  let trimmedLength = audioBuffer.length;
  let startOffset = 0;

  if (start && end) {
    startOffset = Math.round(start * sampleRate);
    const endOffset = Math.round(end * sampleRate);
    trimmedLength = endOffset - startOffset;
  }

  const trimmedAudioBuffer = audioContext.createBuffer(
    numberOfChannels,
    trimmedLength,
    sampleRate
  );

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    const trimmedData = trimmedAudioBuffer.getChannelData(channel);
    for (let i = 0; i < trimmedLength; i++) {
      trimmedData[i] = channelData[startOffset + i];
    }
  }

  return Promise.resolve(audioBufferToWav(trimmedAudioBuffer));
};
export const format_time = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const secondsRemainder = Math.round(time) % 60;
  const paddedSeconds = `0${secondsRemainder}`.slice(-2);
  return `${minutes}:${paddedSeconds}`;
};
