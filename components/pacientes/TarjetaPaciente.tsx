'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Phone, Hospital } from 'lucide-react';
import { Paciente } from '@/lib/types';
import { CONDICION_COLORS, CONDICION_LABELS } from '@/lib/constants';
import Badge from '@/components/ui/Badge';

interface Props {
  paciente: Paciente;
}

export default function TarjetaPaciente({ paciente: p }: Props) {
  const color = CONDICION_COLORS[p.condicion];

  const tiempoAtras = formatDistanceToNow(new Date(p.created_at), {
    addSuffix: true,
    locale: es,
  });

  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{p.nombre_paciente}</h3>
          <div className="flex items-center gap-2">
            {p.cedula && (
              <span className="text-white/50 text-xs font-mono">{p.cedula}</span>
            )}
            {p.edad !== null && (
              <span className="text-white/40 text-xs">{p.edad} años</span>
            )}
          </div>
        </div>
        <Badge label={CONDICION_LABELS[p.condicion]} color={color} />
      </div>

      <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
        <Hospital size={13} />
        <span className="font-medium">{p.hospital_nombre}</span>
      </div>

      {p.hospital_direccion && (
        <p className="text-white/40 text-xs mb-2">{p.hospital_direccion}</p>
      )}

      {p.descripcion_fisica && (
        <p className="text-white/50 text-xs italic mb-3 leading-relaxed">
          &ldquo;{p.descripcion_fisica}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        {p.contacto_familiar && (
          <a
            href={`tel:${p.contacto_familiar}`}
            className="flex items-center gap-1.5 text-[#F5C518] text-xs font-semibold hover:underline"
          >
            <Phone size={13} />
            {p.contacto_familiar}
          </a>
        )}
        <span className="text-white/30 text-xs ml-auto">{tiempoAtras}</span>
      </div>
    </div>
  );
}
