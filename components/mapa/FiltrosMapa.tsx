'use client';

import { EstadoRefugio } from '@/lib/types';
import { ESTADO_COLORS, ESTADO_LABELS } from '@/lib/constants';

interface Props {
  filtro: EstadoRefugio | 'todos';
  onChange: (f: EstadoRefugio | 'todos') => void;
}

const OPCIONES: { value: EstadoRefugio | 'todos'; label: string; color?: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: ESTADO_LABELS.activo, color: ESTADO_COLORS.activo },
  { value: 'lleno', label: ESTADO_LABELS.lleno, color: ESTADO_COLORS.lleno },
  { value: 'cerrado', label: ESTADO_LABELS.cerrado, color: ESTADO_COLORS.cerrado },
];

export default function FiltrosMapa({ filtro, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {OPCIONES.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            filtro === o.value
              ? 'bg-[#DC143C] border-[#DC143C] text-white'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
          }`}
        >
          {o.color && (
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: o.color }}
            />
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}
