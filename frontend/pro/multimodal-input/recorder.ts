import { useEffect, useRef, useState } from 'react';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';
import WaveSurfer from 'wavesurfer.js/dist/wavesurfer';

export interface UseRecorderOptions {
  container: HTMLElement | null;
  onStop: (blob: Blob) => void;
}

export function useRecorder({ container, onStop }: UseRecorderOptions) {
  const recorderRef = useRef<RecordPlugin | null>(null);
  const [recording, setRecording] = useState(false);

  const start = useMemoizedFn(() => {
    recorderRef.current?.startRecording();
  });

  const stop = useMemoizedFn(() => {
    recorderRef.current?.stopRecording();
  });
  const onStopMemoized = useMemoizedFn(onStop);

  useEffect(() => {
    if (container) {
      const micWaveform = WaveSurfer.create({
        normalize: false,
        container,
      });
      const recorder = micWaveform.registerPlugin(RecordPlugin.create());
      recorderRef.current = recorder;

      recorder.on('record-start', () => {
        setRecording(true);
      });
      recorder.on('record-end', (blob) => {
        onStopMemoized(blob);
        setRecording(false);
      });
    }
  }, [container, onStopMemoized]);
  return {
    recording,
    start,
    stop,
  };
}
