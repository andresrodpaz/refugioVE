'use client';

import { useState } from 'react';
import { Plus, Loader2, AlertTriangle } from 'lucide-react';
import { Toaster } from 'sonner';
import { usePacientes } from '@/hooks/usePacientes';
import TarjetaPaciente from '@/components/pacientes/TarjetaPaciente';
import BuscadorPacientes from '@/components/pacientes/BuscadorPacientes';
import Modal from '@/components/ui/Modal';
import FormularioPaciente from '@/components/pacientes/FormularioPaciente';

export default function PacientesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { pacientes, loading, error } = usePacientes(busqueda);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#0f172a]">
      <Toaster position="top-right" theme="dark" />

      {/* Alert banner */}
      <div className="bg-[#F5C518]/10 border-b border-[#F5C518]/20 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-start gap-2 text-[#F5C518] text-xs md:text-sm">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>
            <strong>Registro Oficial y Comunitario:</strong> Este módulo está diseñado para que médicos, enfermeros, personal de ambulancias y voluntarios registren de manera directa los ingresos de personas en centros de salud.
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-white font-bold text-xl">Pacientes en hospitales</h1>
            <p className="text-white/50 text-xs md:text-sm mt-0.5">
              Habilitado para que el personal de salud reporte ingresos tras la emergencia.
            </p>
            <p className="text-white/40 text-xs mt-1">
              {pacientes.length} registro{pacientes.length !== 1 ? 's' : ''} encontrado{pacientes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#DC143C] hover:bg-[#b01030] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shrink-0 shadow-lg"
          >
            <Plus size={16} />
            Registrar ingreso de paciente
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-white/40">
            <Loader2 size={22} className="animate-spin mr-2" />
            Buscando pacientes...
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-400 text-sm">Error: {error}</div>
        ) : pacientes.length === 0 ? (
          <div className="py-16 text-center text-white/40 text-sm">
            {busqueda
              ? `No se encontraron resultados para "${busqueda}"`
              : 'No hay pacientes registrados aun.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pacientes.map((p) => (
              <TarjetaPaciente key={p.id} paciente={p} />
            ))}
          </div>
        )}
      </div>

      {/* FAB for mobile */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-6 sm:hidden bg-[#DC143C] hover:bg-[#b01030] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
        aria-label="Registrar ingreso de paciente"
      >
        <Plus size={24} />
      </button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registrar ingreso de paciente"
      >
        <FormularioPaciente onSuccess={() => setModalOpen(false)} />
      </Modal>
    </main>
  );
}
