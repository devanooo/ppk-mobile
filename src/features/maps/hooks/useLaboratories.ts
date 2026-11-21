import { useCallback, useEffect, useState } from 'react';

import { subscribeLaboratories } from '../services/lab-service';
import type { Laboratory } from '../types/laboratory';

interface UseLaboratoriesReturn {
  laboratories: Laboratory[];
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

export function useLaboratories(): UseLaboratoriesReturn {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [percobaan, setPercobaan] = useState(0);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setPercobaan((nilai) => nilai + 1);
  }, []);

  useEffect(() => {
    let aktif = true;

    const unsubscribe = subscribeLaboratories(
      (data) => {
        if (!aktif) return;

        setLaboratories(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        if (!aktif) return;

        setError(err);
        setLoading(false);
      },
    );

    return () => {
      aktif = false;
      unsubscribe();
    };
  }, [percobaan]);

  return {
    laboratories,
    loading,
    error,
    retry,
  };
}
