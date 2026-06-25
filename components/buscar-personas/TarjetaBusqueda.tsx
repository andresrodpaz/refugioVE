'use client';

import { useState } from 'react';
import { Phone, MapPin, Calendar, User, UserCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BusquedaPersona, EstadoBusqueda } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TarjetaBusquedaProps {
  busqueda: BusquedaPersona;
  onMarcarLocalizado: (
    id: string,
    nuevoEstado: EstadoBusqueda,
    reportadoPor?: string
  ) => Promise<void>;
}

export default function TarjetaBusqueda({ busqueda, onMarcarLocalizado }: TarjetaBusquedaProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [reportadoPor, setReportadoPor] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState<'localizado_sano' | 'localizado_herido'>('localizado_sano');
  const [submitting, setSubmitting] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(busqueda.created_at), {
    addSuffix: true,
    locale: es,
  });

  const getStatusBadge = (estado: EstadoBusqueda) => {
    switch (estado) {
      case 'buscando':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse mr-1.5"></span>
            Buscando
          </span>
        );
      case 'localizado_sano':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
            Localizado Sano
          </span>
        );
      case 'localizado_herido':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950 text-amber-300 border border-amber-800">
            Localizado Herido
          </span>
        );
      case 'fallecido':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-950 text-red-500 border border-red-900">
            Fallecido
          </span>
        );
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onMarcarLocalizado(busqueda.id, nuevoEstado, reportadoPor);
      toast.success('Estado actualizado correctamente.');
      setModalOpen(false);
      setReportadoPor('');
    } catch (err: any) {
      toast.error(`Error al actualizar: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col justify-between gap-4 h-full">
        <div>
          {/* Header (Nombre + Badge) */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
              {busqueda.nombre_buscado}
            </h3>
            <div className="shrink-0">{getStatusBadge(busqueda.estado)}</div>
          </div>

          {/* Edad aproximada */}
          {busqueda.edad_aproximada && (
            <p className="text-white/50 text-xs mt-1">
              Edad aproximada: <span className="text-white">{busqueda.edad_aproximada} años</span>
            </p>
          )}

          {/* Ubicación */}
          <div className="flex items-center gap-1.5 text-white/70 text-sm mt-3">
            <MapPin size={16} className="text-white/40 shrink-0" />
            <span className="truncate">
              {busqueda.ciudad_ultima_vez}
              {busqueda.sector_barrio ? `, ${busqueda.sector_barrio}` : ''}
            </span>
          </div>

          {/* Descripción / Contexto */}
          {busqueda.descripcion && (
            <p className="text-white/50 text-sm mt-3 border-t border-white/5 pt-3 leading-relaxed break-words line-clamp-4">
              {busqueda.descripcion}
            </p>
          )}
        </div>

        {/* Footer Details & Acciones */}
        <div className="border-t border-white/5 pt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-[11px] text-white/40">
            {busqueda.desde_donde_busca && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>Se busca desde: <span className="text-white/60">{busqueda.desde_donde_busca}</span></span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Publicado {formattedDate}</span>
            </div>
            {busqueda.reportado_por && busqueda.estado !== 'buscando' && (
              <div className="flex items-center gap-1 text-emerald-400/80">
                <UserCheck size={12} />
                <span>Reportado por: {busqueda.reportado_por}</span>
              </div>
            )}
          </div>

          {/* Tappable Contact Card & Localizado Button */}
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <a
              href={`tel:${busqueda.contacto_buscador}`}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 text-sm font-medium hover:bg-[#22c55e]/20 active:translate-y-px transition-all"
            >
              <Phone size={16} />
              Llamar contacto
            </a>

            {busqueda.estado === 'buscando' && (
              <Button
                variant="outline"
                className="h-10 text-white/80 hover:text-white border-white/10 hover:bg-white/5"
                onClick={() => setModalOpen(true)}
              >
                ✓ Ya fue localizado
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mini-Modal "Ya fue localizado" */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Reportar como localizado">
        <form onSubmit={handleConfirm} className="space-y-4">
          <p className="text-sm text-white/70">
            Ayuda a la comunidad reportando si has localizado a <span className="text-white font-semibold">{busqueda.nombre_buscado}</span>.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
              Tu nombre (opcional)
            </label>
            <input
              type="text"
              value={reportadoPor}
              onChange={(e) => setReportadoPor(e.target.value)}
              placeholder="Ej. María Rodríguez"
              className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
              Estado de la persona *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                  nuevoEstado === 'localizado_sano'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
                    : 'bg-[#0f172a] border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="nuevoEstado"
                  value="localizado_sano"
                  checked={nuevoEstado === 'localizado_sano'}
                  onChange={() => setNuevoEstado('localizado_sano')}
                  className="sr-only"
                />
                Localizado Sano
              </label>

              <label
                className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                  nuevoEstado === 'localizado_herido'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-400'
                    : 'bg-[#0f172a] border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="nuevoEstado"
                  value="localizado_herido"
                  checked={nuevoEstado === 'localizado_herido'}
                  onChange={() => setNuevoEstado('localizado_herido')}
                  className="sr-only"
                />
                Localizado Herido
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {submitting ? 'Guardando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
