'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Paciente } from '@/lib/types';

export function usePacientes(busqueda?: string) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    let query = supabase
      .from('pacientes')
      .select('*')
      .order('created_at', { ascending: false });

    const term = busqueda?.trim();
    if (term) {
      query = query.or(
        `nombre_paciente.ilike.%${term}%,cedula.ilike.%${term}%,hospital_nombre.ilike.%${term}%`,
      );
    }

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
    } else {
      setPacientes((data as Paciente[]) ?? []);
    }
    setLoading(false);
  }, [busqueda]);

  useEffect(() => {
    load();
  }, [load]);

  return { pacientes, loading, error, refetch: load };
}
