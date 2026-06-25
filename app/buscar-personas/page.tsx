'use client';

import { useState, useEffect } from 'react';
import { useBusquedas } from '@/hooks/useBusquedas';
import TarjetaBusqueda from '@/components/buscar-personas/TarjetaBusqueda';
import FormularioBusqueda from '@/components/buscar-personas/FormularioBusqueda';
import Modal from '@/components/ui/Modal';
import { Search, Plus, UserPlus, HelpCircle } from 'lucide-react';

export default function BuscarPersonasPage() {
  const { busquedas, localizados, loading, error, marcarLocalizado } = useBusquedas();
  const [activeTab, setActiveTab] = useState<'buscando' | 'localizado'>('buscando');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Search input debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filterRecords = (list: any[]) => {
    if (!debouncedQuery.trim()) return list;
    const query = debouncedQuery.toLowerCase().trim();
    return list.filter((r) => {
      const matchNombre = r.nombre_buscado?.toLowerCase().includes(query);
      const matchCiudad = r.ciudad_ultima_vez?.toLowerCase().includes(query);
      const matchSector = r.sector_barrio?.toLowerCase().includes(query);
      return matchNombre || matchCiudad || matchSector;
    });
  };

  const busquedasFiltradas = filterRecords(busquedas);
  const localizadosFiltrados = filterRecords(localizados);

  const displayedRecords = activeTab === 'buscando' ? busquedasFiltradas : localizadosFiltrados;

  return (
    <main className="min-h-screen bg-[#0f172a] text-white pb-24 md:pb-12">
      {/* Header Panel */}
      <div className="bg-[#1e293b] border-b border-white/10 px-4 py-8 mb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Buscar personas</h1>
          <p className="text-white/60 mt-2 text-sm md:text-base leading-relaxed">
            ¿No sabes nada de un familiar o conocido? Publícalo aquí y la comunidad te ayuda a localizarlos.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Real-time search filter */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, ciudad o barrio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e293b] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] transition-all"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-white/10 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('buscando')}
            className={`pb-3 text-left transition-all border-b-2 shrink-0 ${
              activeTab === 'buscando'
                ? 'border-[#DC143C] text-white'
                : 'border-transparent text-white/50 hover:text-white hover:border-white/10'
            }`}
          >
            <span className="block font-bold text-sm md:text-base">Aún buscando</span>
            <span className="block text-xs opacity-75 mt-0.5">{busquedas.length} personas buscando</span>
          </button>

          <button
            onClick={() => setActiveTab('localizado')}
            className={`pb-3 text-left transition-all border-b-2 shrink-0 ${
              activeTab === 'localizado'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-white/50 hover:text-white hover:border-white/10'
            }`}
          >
            <span className="block font-bold text-sm md:text-base">Ya fue localizado</span>
            <span className="block text-xs opacity-75 mt-0.5">{localizados.length} personas localizadas</span>
          </button>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#DC143C] animate-spin" />
            <p className="text-white/40 text-sm">Cargando registros...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-950/20 border border-red-900/50 rounded-xl p-4">
            <p className="text-red-400 text-sm">Error al cargar registros: {error}</p>
          </div>
        ) : displayedRecords.length === 0 ? (
          <div className="text-center py-16 bg-[#1e293b]/40 rounded-2xl border border-dashed border-white/10 p-6">
            <HelpCircle size={36} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/50 font-medium">No se encontraron resultados</p>
            <p className="text-white/30 text-xs mt-1">
              Prueba con otro término de búsqueda o publica un nuevo reporte.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedRecords.map((item) => (
              <TarjetaBusqueda
                key={item.id}
                busqueda={item}
                onMarcarLocalizado={marcarLocalizado}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setCreateModalOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 bg-[#DC143C] hover:bg-[#b01030] text-white font-bold px-5 py-3.5 rounded-full flex items-center gap-2 shadow-2xl z-40 transition-all hover:scale-[1.05] active:scale-[0.95]"
      >
        <UserPlus size={18} />
        Publicar búsqueda
      </button>

      {/* Publication Form Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Publicar búsqueda de persona"
      >
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <FormularioBusqueda onSuccess={() => setCreateModalOpen(false)} />
        </div>
      </Modal>
    </main>
  );
}
