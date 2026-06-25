'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Package, MapPin, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { CentroAcopio } from '@/lib/types';

const MapaCentrosAcopio = dynamic(
  () => import('@/components/mapa/MapaCentrosAcopio'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[#0f172a] text-white/40 gap-2">
        <Loader2 className="animate-spin" size={20} />
        <span className="text-sm">Cargando mapa...</span>
      </div>
    ),
  }
);

const ESTADOS_VENEZUELA = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
  'Carabobo', 'Cojedes', 'Delta Amacuro', 'Dependencias Federales',
  'Distrito Capital', 'Falcón', 'Guárico', 'Lara', 'Mérida', 'Miranda',
  'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira',
  'Trujillo', 'Vargas', 'Yaracuy', 'Zulia',
];

// Fallback coords (state capital) if GPS not used
const ESTADO_COORDS: Record<string, [number, number]> = {
  'Amazonas': [3.9935, -67.3553],
  'Anzoátegui': [9.3397, -64.1929],
  'Apure': [7.8884, -67.4783],
  'Aragua': [10.2530, -67.6003],
  'Barinas': [8.6227, -70.2086],
  'Bolívar': [8.1241, -63.5476],
  'Carabobo': [10.1661, -68.0004],
  'Cojedes': [9.6881, -68.5850],
  'Delta Amacuro': [8.5996, -61.0093],
  'Dependencias Federales': [11.9800, -66.6700],
  'Distrito Capital': [10.4806, -66.9036],
  'Falcón': [11.4355, -69.6732],
  'Guárico': [8.7491, -66.2358],
  'Lara': [10.0736, -69.3227],
  'Mérida': [8.5960, -71.1452],
  'Miranda': [10.4962, -66.8488],
  'Monagas': [9.7471, -63.1795],
  'Nueva Esparta': [10.9928, -63.8618],
  'Portuguesa': [9.3640, -69.2290],
  'Sucre': [10.4576, -63.1780],
  'Táchira': [7.7753, -72.2247],
  'Trujillo': [9.3669, -70.4387],
  'Vargas': [10.6033, -67.0271],
  'Yaracuy': [10.3392, -68.7341],
  'Zulia': [10.6616, -71.6014],
};

export default function CentrosAcopioPage() {
  const [centros, setCentros] = useState<CentroAcopio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  // Form state
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estadoPais, setEstadoPais] = useState('');
  const [reportadoPor, setReportadoPor] = useState('');
  const [notas, setNotas] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const fetchCentros = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('centros_acopio')
      .select('*')
      .order('creado_en', { ascending: false });
    if (!error && data) {
      setCentros(data as CentroAcopio[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCentros();
  }, [fetchCentros]);

  const handleGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(parseFloat(pos.coords.latitude.toFixed(7)));
        setLng(parseFloat(pos.coords.longitude.toFixed(7)));
        setLocating(false);
        toast.success('Ubicación GPS capturada.');
      },
      () => {
        setLocating(false);
        toast.error('No se pudo obtener la ubicación. Puedes omitir este paso.');
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    // Use state capital coords as fallback if GPS not provided
    let finalLat = lat;
    let finalLng = lng;
    if (!finalLat || !finalLng) {
      const fallback = ESTADO_COORDS[estadoPais];
      if (fallback) {
        [finalLat, finalLng] = fallback;
      }
    }

    try {
      const res = await fetch('/api/centros-acopio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          direccion,
          estado_pais: estadoPais,
          lat: finalLat,
          lng: finalLng,
          reportado_por: reportadoPor || null,
          notas: notas || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      setSubmitSuccess(true);
      setNombre('');
      setDireccion('');
      setEstadoPais('');
      setReportadoPor('');
      setNotas('');
      setLat(null);
      setLng(null);
      fetchCentros(); // Refresh map
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const centrosFiltrados = centros.filter(c => {
    if (filtroEstado && c.estado_pais !== filtroEstado) return false;
    return true;
  });

  const inputClass =
    'w-full bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f1c40f]/60 placeholder-white/30 transition-all';
  const labelClass = 'block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider';

  return (
    <main className="min-h-screen bg-[#0f172a] text-white pb-24 md:pb-12">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <div className="bg-[#1e293b] border-b border-white/10 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5 mb-2">
            <Package className="text-[#f1c40f]" size={24} />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Centros de Acopio
            </h1>
          </div>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
            Puntos habilitados por la comunidad para recibir y distribuir ayuda. Si conoces uno que no está en el mapa, repórtalo.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#f1c40f] border-2 border-[#d4a017]" />
              Verificado
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#2ecc71] border-2 border-[#27ae60]" />
              Sin verificar — reportado por ciudadanos
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              {centrosFiltrados.length} centros mostrados
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-[#1e293b] border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f1c40f]/60 appearance-none min-w-[200px]"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_VENEZUELA.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Map */}
        <section>
          <div
            className="w-full rounded-xl overflow-hidden border border-white/10 shadow-xl"
            style={{ height: '400px', minHeight: '400px' }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full bg-[#1e293b] text-white/40 gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm">Cargando centros...</span>
              </div>
            ) : (
              <MapaCentrosAcopio centros={centrosFiltrados} />
            )}
          </div>
        </section>

        {/* Form Section */}
        <section className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Context */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                Reportar un centro de acopio
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Si sabes de un punto de acopio que no está en el mapa, publícalo para que más personas puedan acceder a la ayuda.
                Cualquier dato adicional —como horario, tipo de insumos o contacto— es muy útil.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <CheckCircle size={16} className="text-[#2ecc71] mt-0.5 shrink-0" />
                  <span>Los centros verificados se resaltan en amarillo en el mapa.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <Clock size={16} className="text-[#f1c40f] mt-0.5 shrink-0" />
                  <span>Cada reporte aparece inmediatamente en el mapa para todos los usuarios.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <MapPin size={16} className="text-[#DC143C] mt-0.5 shrink-0" />
                  <span>Si no usas GPS, el marcador se coloca en la capital del estado indicado.</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 shadow-lg">
              {submitSuccess ? (
                <div className="flex flex-col items-center text-center py-6 gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#2ecc71]/20 flex items-center justify-center">
                    <CheckCircle className="text-[#2ecc71]" size={28} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">¡Gracias por tu aporte!</p>
                    <p className="text-white/60 text-sm mt-1">
                      El centro fue publicado y ya aparece en el mapa.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-[#f1c40f] text-sm font-semibold hover:underline"
                  >
                    Reportar otro centro →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className={labelClass}>Nombre del lugar *</label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Escuela Simón Bolívar, planta baja"
                      className={inputClass}
                    />
                  </div>

                  {/* Direccion */}
                  <div>
                    <label className={labelClass}>Dirección *</label>
                    <input
                      type="text"
                      required
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Calle, edificio, referencia cercana"
                      className={inputClass}
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className={labelClass}>Estado de Venezuela *</label>
                    <select
                      required
                      value={estadoPais}
                      onChange={(e) => setEstadoPais(e.target.value)}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="">Selecciona un estado...</option>
                      {ESTADOS_VENEZUELA.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>

                  {/* GPS & Manual Coords */}
                  <div>
                    <label className={labelClass}>Ubicación Coordenadas (opcional)</label>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <input
                          type="number"
                          step="any"
                          value={lat !== null ? lat : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLat(val !== '' ? parseFloat(val) : null);
                          }}
                          placeholder="Latitud: 10.2530"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          step="any"
                          value={lng !== null ? lng : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLng(val !== '' ? parseFloat(val) : null);
                          }}
                          placeholder="Longitud: -67.6002"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGPS}
                      disabled={locating}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-white/60 hover:bg-white/5 hover:text-white text-sm transition-all disabled:opacity-50"
                    >
                      {locating ? (
                        <><Loader2 size={14} className="animate-spin" /> Obteniendo ubicación...</>
                      ) : (
                        <><MapPin size={14} /> Detectar ubicación GPS</>
                      )}
                    </button>
                    {lat !== null && lng !== null && (
                      <p className="text-[10px] text-[#2ecc71] mt-1">
                        ✓ Coordenadas activas: {lat.toFixed(5)}, {lng.toFixed(5)}
                      </p>
                    )}
                  </div>

                  {/* Reportado por */}
                  <div>
                    <label className={labelClass}>Reportado por (opcional)</label>
                    <input
                      type="text"
                      value={reportadoPor}
                      onChange={(e) => setReportadoPor(e.target.value)}
                      placeholder="Tu nombre, @usuario o déjalo en blanco"
                      className={inputClass}
                    />
                  </div>

                  {/* Notas */}
                  <div>
                    <label className={labelClass}>Notas adicionales (opcional)</label>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      rows={3}
                      placeholder="Horario, qué aceptan, número de contacto..."
                      className={inputClass}
                    />
                  </div>

                  {/* Error */}
                  {submitError && (
                    <div className="flex items-start gap-2 text-red-400 text-xs bg-red-950/30 border border-red-900/50 rounded-lg p-3">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>
                        Hubo un problema al publicar. Intenta de nuevo o escríbenos a{' '}
                        <a href="mailto:refugiove.app@outlook.com" className="underline">
                          refugiove.app@outlook.com
                        </a>
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#f1c40f] hover:bg-[#d4a017] disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all active:translate-y-px text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Publicando...</>
                    ) : (
                      'Publicar centro de acopio →'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* List view */}
        {centrosFiltrados.length > 0 && (
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-base font-bold text-white mb-4">
              Centros encontrados ({centrosFiltrados.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {centrosFiltrados.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex flex-col gap-1.5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-white text-sm leading-tight">{c.nombre}</p>
                    {c.verificado ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f1c40f]/20 text-[#f1c40f] border border-[#f1c40f]/30">
                        ✓ Verificado
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#2ecc71]/10 text-[#2ecc71] border border-[#2ecc71]/20">
                        Ciudadano
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-xs">{c.direccion}</p>
                  <p className="text-white/40 text-xs">📍 {c.estado_pais}</p>
                  {c.notas && (
                    <p className="text-white/40 text-xs italic mt-0.5">{c.notas}</p>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DC143C] text-xs font-semibold hover:underline mt-1 self-start"
                  >
                    🗺️ Cómo llegar
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
