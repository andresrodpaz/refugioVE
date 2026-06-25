'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Phone, Navigation, CheckCircle2, Users } from 'lucide-react';
import { Refugio } from '@/lib/types';
import { ESTADO_COLORS, ESTADO_LABELS, SERVICIOS_LABELS } from '@/lib/constants';
import Badge from '@/components/ui/Badge';

interface Props {
  refugio: Refugio;
  onSelect?: (r: Refugio) => void;
}

export default function TarjetaRefugio({ refugio, onSelect }: Props) {
  const color = ESTADO_COLORS[refugio.estado];

  const tiempoAtras = formatDistanceToNow(new Date(refugio.created_at), {
    addSuffix: true,
    locale: es,
  });

  return (
    <div
      className="bg-[#1e293b] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer"
      onClick={() => onSelect?.(refugio)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(refugio)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{refugio.nombre}</h3>
          {refugio.verificado && (
            <CheckCircle2 size={14} className="text-[#22c55e] shrink-0" />
          )}
        </div>
        <Badge label={ESTADO_LABELS[refugio.estado]} color={color} />
      </div>

      <p className="text-white/50 text-xs mb-3 leading-relaxed">{refugio.direccion}</p>

      {(refugio.capacidad_total !== null || refugio.capacidad_disponible !== null) && (
        <div className="flex items-center gap-1.5 text-xs text-white/60 mb-2">
          <Users size={13} />
          <span>
            {refugio.capacidad_disponible ?? '?'} / {refugio.capacidad_total ?? '?'} lugares
          </span>
        </div>
      )}

      {refugio.servicios && refugio.servicios.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {refugio.servicios.map((s) => (
            <span
              key={s}
              className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-full"
            >
              {SERVICIOS_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {refugio.contacto && (
            <a
              href={`tel:${refugio.contacto}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[#F5C518] text-xs hover:underline"
            >
              <Phone size={12} />
              Llamar
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${refugio.lat},${refugio.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[#DC143C] text-xs hover:underline"
          >
            <Navigation size={12} />
            Como llegar
          </a>
        </div>
        <span className="text-white/30 text-xs">{tiempoAtras}</span>
      </div>
    </div>
  );
}
