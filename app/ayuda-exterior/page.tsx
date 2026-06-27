'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Globe, MapPin, CheckCircle, Loader2, AlertCircle, Heart, ChevronDown, Navigation2, Search, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { CentroAcopioExterior } from '@/lib/types';

const MapaCentrosAcopioExterior = dynamic(
  () => import('@/components/mapa/MapaCentrosAcopioExterior'),
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

const PAISES_COMUNES = [
  'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bangladés', 'Barbados', 'Baréin', 'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina', 'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután', 'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Ciudad del Vaticano', 'Colombia', 'Comoras', 'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba', 'Dinamarca', 'Dominica', 'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'Estados Unidos', 'Estonia', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi', 'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala', 'Guyana', 'Guinea', 'Guinea ecuatorial', 'Guinea-Bisáu', 'Haití', 'Honduras', 'Hungría', 'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda', 'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia', 'Jamaica', 'Japón', 'Jordania', 'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos', 'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal', 'Reino Unido', 'República Centroafricana', 'República Checa', 'República del Congo', 'República Democrática del Congo', 'República Dominicana', 'Ruanda', 'Rumanía', 'Rusia', 'Samoa', 'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Suazilandia', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía', 'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue', 'Otro'
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function AyudaExteriorPage() {
  const [centros, setCentros] = useState<CentroAcopioExterior[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [paisCustom, setPaisCustom] = useState('');
  const [queDonar, setQueDonar] = useState('');
  const [reportadoPor, setReportadoPor] = useState('');
  const [notas, setNotas] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Filter state
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const fetchCentros = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('centros_acopio_exterior')
      .select('*')
      .order('creado_en', { ascending: false });
    if (!error && data) {
      setCentros(data as CentroAcopioExterior[]);
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
        toast.error('No se pudo obtener la ubicación. Debes ingresar las coordenadas manualmente si quieres aparecer exacto.');
      },
      { timeout: 10000 }
    );
  };

  const handleBuscarCercanos = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización.');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1&accept-language=es`,
            { headers: { 'User-Agent': 'RefugioVE/1.0 (refugiove.app@outlook.com)' } }
          );
          if (res.ok) {
            const data = await res.json();
            let country = data.address?.country;
            if (country) {
              if (country === 'EE. UU.') country = 'Estados Unidos';
              if (country === 'Reino Unido de Gran Bretaña e Irlanda del Norte') country = 'Reino Unido';
              setFiltroPais(country);
              setFiltroCiudad('');
            }
          }
        } catch (err) {
          console.error('Error reverse geocoding:', err);
        }

        setLoadingLocation(false);
        toast.success('Ubicación detectada — filtrando por tu país.');
      },
      () => {
        setLoadingLocation(false);
        toast.error('No se pudo obtener tu ubicación.');
      },
      { timeout: 10000 }
    );
  };

  const handleShare = (c: CentroAcopioExterior) => {
    const text = `📦 *${c.nombre}*\n📍 ${c.direccion}, ${c.ciudad}, ${c.pais}${
      c.que_donar ? `\n❤️ Donar: ${c.que_donar}` : ''
    }${c.notas ? `\n📝 ${c.notas}` : ''}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: c.nombre, text }).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success('¡Info copiada al portapapeles!'))
        .catch(() => {});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    const finalPais = pais === 'Otro' ? paisCustom : pais;

    // Coordenadas son opcionales en el exterior

    try {
      const res = await fetch('/api/centros-acopio-exterior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          direccion,
          ciudad,
          pais: finalPais,
          que_donar: queDonar || null,
          lat,
          lng,
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
      setCiudad('');
      setPais('');
      setPaisCustom('');
      setQueDonar('');
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

  const inputClass =
    'w-full bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f1c40f]/60 placeholder-white/30 transition-all';
  const labelClass = 'block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider';

  // Países con conteo para el selector de filtros
  const paisesConConteo = useMemo(() => {
    const counts: Record<string, number> = {};
    centros.forEach((c) => { counts[c.pais] = (counts[c.pais] || 0) + 1; });
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'es'));
  }, [centros]);

  const ciudadesUnicas = useMemo(() => {
    let filtrados = centros;
    if (filtroPais) filtrados = filtrados.filter((c) => c.pais === filtroPais);
    return Array.from(new Set(filtrados.map((c) => c.ciudad))).sort((a, b) =>
      a.localeCompare(b, 'es')
    );
  }, [centros, filtroPais]);

  const centrosFiltrados = useMemo(() => {
    let filtrados = centros.filter((c) => {
      if (filtroPais && c.pais !== filtroPais) return false;
      if (filtroCiudad && c.ciudad !== filtroCiudad) return false;
      if (textSearch) {
        const q = textSearch.toLowerCase();
        if (
          !c.nombre.toLowerCase().includes(q) &&
          !c.direccion.toLowerCase().includes(q) &&
          !c.ciudad.toLowerCase().includes(q) &&
          !c.pais.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    if (userLocation) {
      filtrados = filtrados.slice().sort((a, b) => {
        const dA =
          a.lat != null && a.lng != null
            ? haversineKm(userLocation.lat, userLocation.lng, Number(a.lat), Number(a.lng))
            : Infinity;
        const dB =
          b.lat != null && b.lng != null
            ? haversineKm(userLocation.lat, userLocation.lng, Number(b.lat), Number(b.lng))
            : Infinity;
        return dA - dB;
      });
    }

    return filtrados;
  }, [centros, filtroPais, filtroCiudad, textSearch, userLocation]);


  return (
    <main className="min-h-screen bg-[#0f172a] text-white pb-24 md:pb-12">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <div className="bg-[#1e293b] border-b border-white/10 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5 mb-2">
            <Globe className="text-[#3498db]" size={28} />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ayuda en el Exterior
            </h1>
          </div>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
            Centros de acopio y apoyo organizados por la diáspora en distintas ciudades del mundo. Si tu comunidad está recibiendo donaciones, repórtalo aquí.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#f1c40f] border-2 border-[#d4a017]" />
              Verificado
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#2ecc71] border-2 border-[#27ae60]" />
              Sin verificar — reportado por la comunidad
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              {centrosFiltrados.length} centros mostrados
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        
        {/* Filtros */}
        <section className="bg-[#1e293b] p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Filtrar resultados</h2>
            {(filtroPais || filtroCiudad || textSearch || userLocation) && (
              <button
                onClick={() => {
                  setFiltroPais('');
                  setFiltroCiudad('');
                  setTextSearch('');
                  setUserLocation(null);
                }}
                className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Limpiar todo
              </button>
            )}
          </div>

          {/* Búsqueda por texto */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-3 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={textSearch}
              onChange={(e) => setTextSearch(e.target.value)}
              placeholder="Buscar por nombre, ciudad, dirección..."
              className={`${inputClass} pl-9 ${textSearch ? 'pr-9' : ''}`}
            />
            {textSearch && (
              <button
                onClick={() => setTextSearch('')}
                className="absolute right-3 top-3 text-white/30 hover:text-white/70 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className={labelClass}>País</label>
              <div className="relative">
                <select
                  value={filtroPais}
                  onChange={(e) => {
                    setFiltroPais(e.target.value);
                    setFiltroCiudad('');
                  }}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="">Todos los países</option>
                  {paisesConConteo.map(([p, count]) => (
                    <option key={p} value={p}>
                      {p} ({count})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-white/40 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Ciudad</label>
              <div className="relative">
                <select
                  value={filtroCiudad}
                  onChange={(e) => setFiltroCiudad(e.target.value)}
                  disabled={!filtroPais}
                  className={`${inputClass} appearance-none pr-10 disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {filtroPais ? 'Todas las ciudades' : 'Elige un país primero'}
                  </option>
                  {ciudadesUnicas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-white/40 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Geolocalización */}
          <button
            type="button"
            onClick={handleBuscarCercanos}
            disabled={loadingLocation}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all disabled:opacity-50 ${
              userLocation
                ? 'bg-[#2ecc71]/10 border-[#2ecc71]/30 text-[#2ecc71] cursor-default'
                : 'bg-[#3498db]/10 border-[#3498db]/30 text-[#3498db] hover:bg-[#3498db]/20'
            }`}
          >
            {loadingLocation ? (
              <><Loader2 size={14} className="animate-spin" /> Detectando ubicación...</>
            ) : userLocation ? (
              <><Navigation2 size={14} /> Ubicación activa — ordenados por cercanía</>
            ) : (
              <><Navigation2 size={14} /> Buscar centros cerca de mí</>
            )}
          </button>
        </section>

        {/* Map */}
        <section>
          <div
            className="w-full rounded-xl overflow-hidden border border-white/10 shadow-xl"
            style={{ height: '400px', minHeight: '400px' }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full bg-[#1e293b] text-white/40 gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm">Cargando centros globales...</span>
              </div>
            ) : (
              <MapaCentrosAcopioExterior centros={centrosFiltrados} userLocation={userLocation ?? undefined} />
            )}
          </div>
        </section>

        {/* Form Section */}
        <section className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Context */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                Registrar un centro en el exterior
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Ayuda a coordinar la recolección de insumos desde el exterior para enviarlos a Venezuela o apoyar a la comunidad local.
              </p>

              <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 mb-5 shadow-inner">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>📦</span> ¿Qué puedes donar?
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2"><span>🥫</span> <span>Alimentos no perecederos</span></li>
                  <li className="flex items-start gap-2"><span>💧</span> <span>Agua potable</span></li>
                  <li className="flex items-start gap-2"><span>🧴</span> <span>Productos de higiene (jabón, pañales, toallas sanitarias)</span></li>
                  <li className="flex items-start gap-2"><span>🩹</span> <span>Botiquines y material médico básico</span></li>
                  <li className="flex items-start gap-2"><span>👕</span> <span>Ropa en buen estado</span></li>
                  <li className="flex items-start gap-2"><span>🔋</span> <span>Linternas, pilas y power banks</span></li>
                  <li className="flex items-start gap-2"><span>🧸</span> <span>Artículos para niños y bebés</span></li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <CheckCircle size={16} className="text-[#2ecc71] mt-0.5 shrink-0" />
                  <span>Especifica claramente qué tipo de donaciones están recibiendo.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <MapPin size={16} className="text-[#3498db] mt-0.5 shrink-0" />
                  <span>Puedes aportar coordenadas GPS para que aparezcan ubicados en el mapa global.</span>
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
                    <p className="text-white font-bold text-base">¡Gracias por tu apoyo!</p>
                    <p className="text-white/60 text-sm mt-1">
                      El centro internacional ha sido registrado.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-[#3498db] text-sm font-semibold hover:underline"
                  >
                    Registrar otro centro →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className={labelClass}>Nombre del centro / Organización *</label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Asociación de Venezolanos en Madrid"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pais */}
                    <div>
                      <label className={labelClass}>País *</label>
                      <div className="relative">
                        <select
                          required
                          value={pais}
                          onChange={(e) => setPais(e.target.value)}
                          className={`${inputClass} appearance-none pr-10`}
                        >
                          <option value="">Selecciona...</option>
                          {PAISES_COMUNES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-3 text-white/40 pointer-events-none" />
                      </div>
                    </div>
                    {/* Ciudad */}
                    <div>
                      <label className={labelClass}>Ciudad *</label>
                      <input
                        type="text"
                        required
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        placeholder="Ej: Madrid, Miami..."
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Otro Pais */}
                  {pais === 'Otro' && (
                    <div>
                      <label className={labelClass}>Especificar País *</label>
                      <input
                        type="text"
                        required
                        value={paisCustom}
                        onChange={(e) => setPaisCustom(e.target.value)}
                        placeholder="Nombre del país"
                        className={inputClass}
                      />
                    </div>
                  )}

                  {/* Direccion */}
                  <div>
                    <label className={labelClass}>Dirección Exacta *</label>
                    <input
                      type="text"
                      required
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Calle, número, código postal..."
                      className={inputClass}
                    />
                  </div>

                  {/* Que Donar */}
                  <div>
                    <label className={labelClass}>¿Qué se puede donar?</label>
                    <div className="relative">
                      <Heart size={16} className="absolute left-3 top-3 text-white/30" />
                      <input
                        type="text"
                        value={queDonar}
                        onChange={(e) => setQueDonar(e.target.value)}
                        placeholder="Medicinas, ropa, alimentos..."
                        className={`${inputClass} pl-9`}
                      />
                    </div>
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
                          placeholder="Lat: ej. 40.4168"
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
                          placeholder="Lng: ej. -3.7038"
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
                      rows={2}
                      placeholder="Horarios, información de envíos..."
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
                    className="w-full bg-[#3498db] hover:bg-[#2980b9] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all active:translate-y-px text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Registrando...</>
                    ) : (
                      'Registrar centro en el exterior →'
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
                  className="bg-[#1e293b] border border-white/10 rounded-xl p-5 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3498db]/10 hover:border-[#3498db]/40 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Decorative glowing gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3498db]/0 to-[#3498db]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <p className="font-semibold text-white text-[15px] leading-tight">{c.nombre}</p>
                    {c.verificado ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f1c40f]/20 text-[#f1c40f] border border-[#f1c40f]/30">
                        <CheckCircle size={10} /> Verificado
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ecc71]/10 text-[#2ecc71] border border-[#2ecc71]/20">
                        Comunidad
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 mt-1 relative z-10">
                    <p className="text-white/60 text-xs flex items-center gap-1.5"><Globe size={12} className="text-white/40"/> {c.ciudad}, {c.pais}</p>
                    <p className="text-white/60 text-xs flex items-center gap-1.5"><MapPin size={12} className="text-white/40"/> {c.direccion}</p>
                  </div>
                  {c.que_donar && (
                    <div className="mt-2 flex gap-1.5 items-start bg-white/5 p-2 rounded-lg relative z-10 border border-white/5">
                      <Heart size={14} className="text-pink-500 mt-0.5 shrink-0" />
                      <p className="text-white/80 text-xs leading-relaxed"><strong>Donar:</strong> {c.que_donar}</p>
                    </div>
                  )}
                  {c.notas && (
                    <p className="text-white/50 text-xs italic mt-1 relative z-10 border-l-2 border-white/10 pl-2">{c.notas}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2 relative z-10">
                    {c.lat != null && c.lng != null && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#3498db]/15 text-[#3498db] hover:bg-[#3498db] hover:text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all duration-300"
                      >
                        <MapPin size={14} />
                        Ver cómo llegar
                      </a>
                    )}
                    <button
                      onClick={() => handleShare(c)}
                      className="inline-flex items-center gap-1.5 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all duration-300"
                    >
                      <Share2 size={14} />
                      Compartir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
