'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BusquedaPersona, EstadoBusqueda } from '@/lib/types';

export function useBusquedas() {
  const [records, setRecords] = useState<BusquedaPersona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from('busquedas_personas')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setRecords((data as BusquedaPersona[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();

    const supabase = createClient();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'busquedas_personas' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as BusquedaPersona;
            setRecords((prev) => {
              // Avoid duplicate adds
              if (prev.some((r) => r.id === newRecord.id)) return prev;
              return [newRecord, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedRecord = payload.new as BusquedaPersona;
            setRecords((prev) =>
              prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
            );
          } else if (payload.eventType === 'DELETE') {
            const oldRecord = payload.old as { id: string };
            setRecords((prev) => prev.filter((r) => r.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  // Function to mark a person as located
  const marcarLocalizado = useCallback(
    async (id: string, nuevoEstado: EstadoBusqueda, reportadoPor?: string, notas?: string) => {
      const supabase = createClient();
      const { error: err } = await supabase
        .from('busquedas_personas')
        .update({
          estado: nuevoEstado,
          reportado_por: reportadoPor || null,
          notas: notas || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (err) {
        throw new Error(err.message);
      }
    },
    []
  );

  const busquedas = records.filter((r) => r.estado === 'buscando');
  const localizados = records.filter((r) => r.estado !== 'buscando');

  return {
    busquedas,
    localizados,
    loading,
    error,
    refetch: fetchAll,
    marcarLocalizado,
  };
}
