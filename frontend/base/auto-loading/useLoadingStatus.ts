import { useEffect, useMemo, useRef, useState } from 'react';
import type { ILoadingStatus } from '@gradio/statustracker';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';

export function useLoadingStatus(loadingStatus?: ILoadingStatus | null) {
  const { status, progress, queue_position, message, queue_size } =
    loadingStatus || {};
  const [timerStart, setTimerStart] = useState(0);
  const [timerDiff, setTimerDiff] = useState(0);
  const timerRef = useRef(false);
  const runRef = useRef<() => void>(null!);
  const oldEtaRef = useRef<number | null>(null);

  const run = useMemoizedFn(() => {
    requestAnimationFrame(() => {
      setTimerDiff((performance.now() - timerStart) / 1000);
      if (timerRef.current) {
        runRef.current();
      }
    });
  });
  runRef.current = run;

  const startTimer = useMemoizedFn(() => {
    oldEtaRef.current = null;
    setTimerStart(performance.now());
    setTimerDiff(0);
    timerRef.current = true;
    run();
  });

  const stopTimer = useMemoizedFn(() => {
    setTimerDiff(0);
    oldEtaRef.current = null;
    timerRef.current = false;
  });

  useEffect(() => {
    if (status === 'pending') {
      startTimer();
    } else {
      stopTimer();
    }
  }, [startTimer, status, stopTimer]);

  const currentEta = loadingStatus?.eta ?? null;
  if (currentEta !== null) {
    oldEtaRef.current = currentEta;
  }
  const eta = currentEta ?? oldEtaRef.current;

  const formattedEta = useMemo(() => {
    if (eta !== null) {
      return (timerDiff + eta).toFixed(1);
    }
    return null;
  }, [eta, timerDiff]);

  const formattedTimer = useMemo(() => timerDiff.toFixed(1), [timerDiff]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        stopTimer();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    eta,
    formattedEta,
    formattedTimer,
    progress,
    queuePosition: queue_position,
    queueSize: queue_size,
    status,
    message,
  };
}
