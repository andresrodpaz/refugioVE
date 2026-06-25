'use client';

import { Loader2 } from 'lucide-react';
import { Refugio, EstadoRefugio } from '@/lib/types';
import { useRefugios } from '@/hooks/useRefugios';
import TarjetaRefugio from './TarjetaRefugio';

interface Props {
  filtro: EstadoRefugio | 'todos';
  onSelectRefugio?: (r: Refugio) => void;
}

export default function ListaRefugios({ filtro, onSelectRefugio }: Props) {
  const { refugios, loading, error } = useRefugios(filtro);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/40">
        <Loader2 size={22} className="animate-spin mr-2" />
        Cargando refugios...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-400 text-sm">
        Error al cargar refugios: {error}
      </div>
    );
  }

  if (refugios.length === 0) {
    return (
      <div className="py-12 text-center text-white/40 text-sm">
        No hay refugios reportados aun.
        <br />
        Se el primero en reportar uno.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {refugios.map((r) => (
        <TarjetaRefugio key={r.id} refugio={r} onSelect={onSelectRefugio} />
      ))}
    </div>
  );
}
