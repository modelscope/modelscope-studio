import { useCallback, useState } from 'react';

export function useUpdate() {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
}
