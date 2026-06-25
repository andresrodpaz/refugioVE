'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  nombre_paciente: z.string().min(2, 'El nombre es requerido'),
  cedula: z.string().optional(),
  edad: z.coerce.number().int().min(0).max(150).optional().or(z.literal('')),
  descripcion_fisica: z.string().optional(),
  hospital_nombre: z.string().optional(),
  hospital_direccion: z.string().optional(),
  condicion: z
    .enum(['estable', 'grave', 'critico', 'dado_de_alta', 'desconocido'])
    .default('desconocido'),
  contacto_familiar: z.string().optional(),
  reportado_por: z.string().optional(),
  notas: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export default function FormularioPaciente({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { condicion: 'desconocido' },
  });

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const { error } = await supabase.from('pacientes').insert({
      nombre_paciente: values.nombre_paciente,
      cedula: values.cedula?.trim() || null,
      edad: values.edad !== '' && values.edad !== undefined ? Number(values.edad) : null,
      descripcion_fisica: values.descripcion_fisica || null,
      hospital_nombre: values.hospital_nombre || 'No especificado',
      hospital_direccion: values.hospital_direccion || null,
      condicion: values.condicion,
      contacto_familiar: values.contacto_familiar || null,
      reportado_por: values.reportado_por || null,
      notas: values.notas || null,
    });

    if (error) {
      toast.error('Error al registrar el paciente. Intenta de nuevo.');
      return;
    }

    toast.success('Paciente registrado.');
    reset();
    onSuccess?.();
  }

  const inputClass =
    'w-full bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DC143C] placeholder-white/30';
  const labelClass = 'block text-xs font-semibold text-white/70 mb-1';
  const errorClass = 'text-red-400 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-[#1e293b] border border-white/10 rounded-xl p-3.5 text-xs text-white/70 mb-2">
        <p className="font-semibold text-white mb-1">✍️ Información para Personal de Salud y Rescatistas:</p>
        Use este formulario para registrar ingresos en salas de urgencias, carpas de triaje o traslados. Si el paciente no puede comunicarse, describa sus rasgos físicos detalladamente.
      </div>

      {/* Nombre — UNICO campo obligatorio */}
      <div>
        <label className={labelClass}>Nombre del paciente *</label>
        <input
          {...register('nombre_paciente')}
          placeholder="Nombre completo (o 'Desconocido' si no se tiene)"
          className={inputClass}
        />
        {errors.nombre_paciente && (
          <p className={errorClass}>{errors.nombre_paciente.message}</p>
        )}
      </div>

      {/* Cedula */}
      <div>
        <label className={labelClass}>Cédula de Identidad</label>
        <input
          {...register('cedula')}
          placeholder="Ej: 12345678"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Edad aproximada</label>
          <input
            {...register('edad')}
            type="number"
            placeholder="Ej: 45"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Condición médica</label>
          <select {...register('condicion')} className={inputClass}>
            <option value="desconocido">Desconocido</option>
            <option value="estable">Estable (Fuera de peligro)</option>
            <option value="grave">Grave (Monitoreo constante)</option>
            <option value="critico">Crítico (UCI / Quirófano)</option>
            <option value="dado_de_alta">Dado de alta / Egresado</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción física / Señas particulares</label>
        <textarea
          {...register('descripcion_fisica')}
          rows={2}
          placeholder="Ej: Tatuaje en brazo derecho, viste franela azul, cabello castaño. Crucial para pacientes inconscientes o indocumentados."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Hospital, Clínica o Centro de Salud *</label>
        <input
          {...register('hospital_nombre')}
          placeholder="Ej: Hospital Universitario de Caracas, Carpa de campaña"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Dirección o ubicación del centro de salud</label>
        <input
          {...register('hospital_direccion')}
          placeholder="Ej: Los Chaguaramos, Caracas"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Teléfono de algún familiar (si lo suministró)</label>
        <input
          {...register('contacto_familiar')}
          type="tel"
          placeholder="Ej: +58 412 000 0000"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Registrado por (Tu nombre o rol)</label>
        <input
          {...register('reportado_por')}
          placeholder="Ej: Dr. Gómez / Enfermera Patria / Rescatista"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Notas y observaciones adicionales</label>
        <textarea
          {...register('notas')}
          rows={2}
          placeholder="Sala o box de hospitalización, necesidades de insumos, etc."
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#DC143C] hover:bg-[#b01030] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {isSubmitting ? 'Registrando ingreso...' : 'Registrar ingreso de paciente'}
      </button>
    </form>
  );
}
