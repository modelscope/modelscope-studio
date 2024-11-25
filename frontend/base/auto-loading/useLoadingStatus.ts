import { useEffect, useRef, useState } from 'react';
import type { LoadingStatus } from '@gradio/statustracker';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';

export function useLoadingStatus(loadingStatus?: LoadingStatus | null) {
  const [eta, setEta] = useState<number | null>(loadingStatus?.eta ?? null);
  const { status, progress, queue_position, message, queue_size } =
    loadingStatus || {};
  const [timerStart, setTimerStart] = useState(0);
  const [timerDiff, setTimerDiff] = useState(0);
  const [oldEta, setOldEta] = useState<number | null>(null);
  const [formattedEta, setFormattedEta] = useState<string | null>(null);
  const [formattedTimer, setFormattedTimer] = useState<string | null>(null);

  const timerRef = useRef(false);

  const run = useMemoizedFn(() => {
    requestAnimationFrame(() => {
      setTimerDiff((performance.now() - timerStart) / 1000);
      if (timerRef.current) {
        run();
      }
    });
  });

  const startTimer = useMemoizedFn(() => {
    setEta(null);
    setOldEta(null);
    setFormattedEta(null);
    setTimerStart(performance.now());
    setTimerDiff(0);
    timerRef.current = true;
    run();
  });

  const stopTimer = useMemoizedFn(() => {
    setTimerDiff(0);
    setEta(null);
    setOldEta(null);
    setFormattedEta(null);
    timerRef.current = false;
  });

  useEffect(() => {
    if (status === 'pending') {
      startTimer();
    } else {
      stopTimer();
    }
  }, [startTimer, status, stopTimer]);

  useEffect(() => {
    setEta(loadingStatus?.eta ?? null);
  }, [loadingStatus?.eta]);

  useEffect(() => {
    let _eta = eta;
    if (_eta === null) {
      _eta = oldEta;
      setEta(_eta);
    }
    if (_eta !== null && oldEta !== _eta) {
      setFormattedEta(
        ((performance.now() - timerStart) / 1000 + _eta).toFixed(1)
      );
      setOldEta(_eta);
    }
  }, [eta, oldEta, timerStart]);

  useEffect(() => {
    setFormattedTimer(timerDiff.toFixed(1));
  }, [timerDiff]);

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
