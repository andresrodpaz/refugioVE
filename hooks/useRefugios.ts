'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Refugio, EstadoRefugio } from '@/lib/types';

export function useRefugios(filtroEstado?: EstadoRefugio | 'todos') {
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    let query = supabase
      .from('refugios')
      .select('*')
      .order('created_at', { ascending: false });

    if (filtroEstado && filtroEstado !== 'todos') {
      query = query.eq('estado', filtroEstado);
    }

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
    } else {
      setRefugios((data as Refugio[]) ?? []);
    }
    setLoading(false);
  }, [filtroEstado]);

  useEffect(() => {
    load();
  }, [load]);

  return { refugios, loading, error, refetch: load };
}
