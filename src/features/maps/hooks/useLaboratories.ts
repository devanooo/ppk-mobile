import { useEffect, useState } from 'react';
import { subscribeLaboratories } from '../services/lab-service';
import type { Laboratory } from '../types/laboratory';

interface UseLaboratoriesReturn {
  laboratories: Laboratory[];
  loading: boolean;
  error: Error | null;
}

export function useLaboratories(): UseLaboratoriesReturn {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeLaboratories(
      (data) => {
        setLaboratories(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    laboratories,
    loading,
    error,
  };
}
