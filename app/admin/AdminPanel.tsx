'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import { Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/client';
import { Refugio, Paciente, CentroAcopio } from '@/lib/types';
import { ESTADO_COLORS, ESTADO_LABELS, CONDICION_COLORS, CONDICION_LABELS } from '@/lib/constants';
import Badge from '@/components/ui/Badge';
import {
  verificarRefugioAction,
  eliminarRefugioAction,
  eliminarPacienteAction,
  verificarCentroAction,
  eliminarCentroAction
} from './actions';

export default function AdminPanel() {
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [centros, setCentros] = useState<CentroAcopio[]>([]);
  const [tab, setTab] = useState<'refugios' | 'pacientes' | 'centros'>('refugios');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: r }, { data: p }, { data: c }] = await Promise.all([
      supabase.from('refugios').select('*').order('created_at', { ascending: false }),
      supabase.from('pacientes').select('*').order('created_at', { ascending: false }),
      supabase.from('centros_acopio').select('*').order('creado_en', { ascending: false }),
    ]);
    setRefugios((r as Refugio[]) ?? []);
    setPacientes((p as Paciente[]) ?? []);
    setCentros((c as CentroAcopio[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function verificarRefugio(id: string) {
    setLoadingId(id);
    try {
      await verificarRefugioAction(id);
      setRefugios((prev) => prev.map((r) => (r.id === id ? { ...r, verificado: true } : r)));
      toast.success('Refugio verificado');
    } catch (error) {
      toast.error('Error al verificar');
    }
    setLoadingId(null);
  }

  async function eliminarRefugio(id: string) {
    setLoadingId(id);
    try {
      await eliminarRefugioAction(id);
      setRefugios((prev) => prev.filter((r) => r.id !== id));
      toast.success('Refugio eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
    setLoadingId(null);
  }

  async function eliminarPaciente(id: string) {
    setLoadingId(id);
    try {
      await eliminarPacienteAction(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      toast.success('Registro eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
    setLoadingId(null);
  }

  async function verificarCentro(id: number) {
    setLoadingId(String(id));
    try {
      await verificarCentroAction(id);
      setCentros((prev) => prev.map((c) => (c.id === id ? { ...c, verificado: true } : c)));
      toast.success('Centro de acopio verificado');
    } catch (error) {
      toast.error('Error al verificar');
    }
    setLoadingId(null);
  }

  async function eliminarCentro(id: number) {
    setLoadingId(String(id));
    try {
      await eliminarCentroAction(id);
      setCentros((prev) => prev.filter((c) => c.id !== id));
      toast.success('Centro de acopio eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
    setLoadingId(null);
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#0f172a] px-4 py-6">
      <Toaster position="top-right" theme="dark" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white font-bold text-2xl mb-6">Panel de administracion</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {(['refugios', 'pacientes', 'centros'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 ${
                tab === t
                  ? 'bg-[#DC143C] text-white'
                  : 'bg-[#1e293b] text-white/60 hover:text-white'
              }`}
            >
              {t === 'refugios'
                ? `Refugios (${refugios.length})`
                : t === 'pacientes'
                ? `Pacientes (${pacientes.length})`
                : `Centros de Acopio (${centros.length})`}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-white/30" />
          </div>
        )}

        {!loading && tab === 'refugios' && (
          <div className="flex flex-col gap-3">
            {refugios.map((r) => (
              <div
                key={r.id}
                className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{r.nombre}</span>
                    {r.verificado && <CheckCircle size={14} className="text-[#22c55e]" />}
                    <Badge label={ESTADO_LABELS[r.estado]} color={ESTADO_COLORS[r.estado]} />
                  </div>
                  <p className="text-white/40 text-xs">{r.direccion}</p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                    {r.reportado_por && ` · por ${r.reportado_por}`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.verificado && (
                    <button
                      onClick={() => verificarRefugio(r.id)}
                      disabled={loadingId === r.id}
                      className="flex items-center gap-1 bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {loadingId === r.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle size={12} />
                      )}
                      Verificar
                    </button>
                  )}
                  <button
                    onClick={() => eliminarRefugio(r.id)}
                    disabled={loadingId === r.id}
                    className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {loadingId === r.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {refugios.length === 0 && (
              <p className="text-white/40 text-center py-10 text-sm">No hay refugios.</p>
            )}
          </div>
        )}

        {!loading && tab === 'pacientes' && (
          <div className="flex flex-col gap-3">
            {pacientes.map((p) => (
              <div
                key={p.id}
                className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{p.nombre_paciente}</span>
                    {p.cedula && (
                      <span className="text-white/40 text-xs">C.I. {p.cedula}</span>
                    )}
                    {p.edad && <span className="text-white/40 text-xs">{p.edad} anos</span>}
                    <Badge
                      label={CONDICION_LABELS[p.condicion]}
                      color={CONDICION_COLORS[p.condicion]}
                    />
                  </div>
                  <p className="text-white/60 text-xs">{p.hospital_nombre}</p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {formatDistanceToNow(new Date(p.created_at), { addSuffix: true, locale: es })}
                    {p.reportado_por && ` · por ${p.reportado_por}`}
                  </p>
                </div>
                <button
                  onClick={() => eliminarPaciente(p.id)}
                  disabled={loadingId === p.id}
                  className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
                >
                  {loadingId === p.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Eliminar
                </button>
              </div>
            ))}
            {pacientes.length === 0 && (
              <p className="text-white/40 text-center py-10 text-sm">No hay pacientes.</p>
            )}
          </div>
        )}

        {!loading && tab === 'centros' && (
          <div className="flex flex-col gap-3">
            {centros.map((c) => (
              <div
                key={c.id}
                className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{c.nombre}</span>
                    {c.verificado && <CheckCircle size={14} className="text-[#f1c40f]" />}
                    <span className="text-white/40 text-xs font-semibold px-2 py-0.5 rounded bg-white/5 uppercase tracking-wider">
                      📍 {c.estado_pais}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs">{c.direccion}</p>
                  {c.notas && <p className="text-white/45 text-xs italic mt-1">&ldquo;{c.notas}&rdquo;</p>}
                  <p className="text-white/30 text-xs mt-1.5">
                    {formatDistanceToNow(new Date(c.creado_en), { addSuffix: true, locale: es })}
                    {c.reportado_por && ` · por ${c.reportado_por}`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!c.verificado && (
                    <button
                      onClick={() => verificarCentro(c.id)}
                      disabled={loadingId === String(c.id)}
                      className="flex items-center gap-1 bg-[#f1c40f]/10 text-[#f1c40f] hover:bg-[#f1c40f]/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {loadingId === String(c.id) ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle size={12} />
                      )}
                      Verificar
                    </button>
                  )}
                  <button
                    onClick={() => eliminarCentro(c.id)}
                    disabled={loadingId === String(c.id)}
                    className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {loadingId === String(c.id) ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {centros.length === 0 && (
              <p className="text-white/40 text-center py-10 text-sm">No hay centros de acopio.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
