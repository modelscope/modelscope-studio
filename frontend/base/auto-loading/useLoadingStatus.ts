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
    if (eta === null) {
      setEta(oldEta);
    }
    if (eta !== null && oldEta !== eta) {
      setFormattedEta(
        ((performance.now() - timerStart) / 1000 + eta).toFixed(1)
      );
      setOldEta(eta);
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
