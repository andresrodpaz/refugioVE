'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Plus, MapPin } from 'lucide-react';
import { Toaster } from 'sonner';
import { EstadoRefugio, Refugio } from '@/lib/types';
import { useRefugios } from '@/hooks/useRefugios';
import { usePacientes } from '@/hooks/usePacientes';
import ListaRefugios from '@/components/refugios/ListaRefugios';
import FiltrosMapa from '@/components/mapa/FiltrosMapa';
import Modal from '@/components/ui/Modal';
import FormularioRefugio from '@/components/refugios/FormularioRefugio';

const MapaRefugios = dynamic(() => import('@/components/mapa/MapaRefugios'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0f172a] text-white/40">
      Cargando mapa...
    </div>
  ),
});

export default function MapaPage() {
  const [filtro, setFiltro] = useState<EstadoRefugio | 'todos'>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [addingMode, setAddingMode] = useState(false);
  const [tempPin, setTempPin] = useState<{ lat: number; lng: number } | null>(null);
  const [initialCoords, setInitialCoords] = useState<{ lat?: number; lng?: number }>({});

  const { refugios } = useRefugios();
  const { pacientes } = usePacientes();

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setTempPin({ lat, lng });
    setInitialCoords({ lat, lng });
    setAddingMode(false);
    setModalOpen(true);
  }, []);

  const handleModalClose = () => {
    setModalOpen(false);
    setTempPin(null);
    setInitialCoords({});
    setAddingMode(false);
  };

  const handleSelectRefugio = (r: Refugio) => {
    // Could fly to the marker; for now we just open the browser directions
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`,
      '_blank',
    );
  };

  return (
    <main className="flex flex-col md:flex-row bg-[#0f172a]" style={{ height: 'calc(100vh - 56px)' }}>
      <Toaster position="top-right" theme="dark" />

      {/* Left panel */}
      <aside className="w-full md:w-[40%] flex flex-col bg-[#0f172a] border-r border-white/10 order-2 md:order-1 md:h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-white font-bold text-base">Refugios reportados</h1>
            <span className="text-white/40 text-xs">{refugios.length} total</span>
          </div>

          <button
            onClick={() => {
              setAddingMode(true);
              setInitialCoords({});
              setModalOpen(false);
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              addingMode
                ? 'bg-[#F5C518] text-black'
                : 'bg-[#DC143C] hover:bg-[#b01030] text-white'
            }`}
          >
            <MapPin size={16} />
            {addingMode ? 'Haz clic en el mapa...' : 'Reportar refugio en el mapa'}
          </button>

          <button
            onClick={() => {
              setAddingMode(false);
              setInitialCoords({});
              setModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-sm text-white/70 border border-white/10 hover:bg-white/5 transition-colors"
          >
            <Plus size={15} />
            Ingresar coordenadas manualmente
          </button>

          <FiltrosMapa filtro={filtro} onChange={setFiltro} />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4">
          <ListaRefugios filtro={filtro} onSelectRefugio={handleSelectRefugio} />
        </div>
      </aside>

      {/* Map */}
      <div
        id="map-container"
        className="w-full h-[400px] md:h-full md:w-[60%] order-1 md:order-2 md:flex-1"
      >
        <div style={{ height: '100%', width: '100%' }}>
          <MapaRefugios
            refugios={refugios}
            pacientes={pacientes}
            addingMode={addingMode}
            onMapClick={handleMapClick}
            tempPin={tempPin}
          />
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title="Reportar refugio"
      >
        <FormularioRefugio
          initialLat={initialCoords.lat}
          initialLng={initialCoords.lng}
          onSuccess={handleModalClose}
        />
      </Modal>
    </main>
  );
}
