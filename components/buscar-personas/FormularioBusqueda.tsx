'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  nombre_buscado: z.string().min(2, 'El nombre completo es requerido'),
  edad_aproximada: z.coerce.number().int().min(0).max(120).optional().or(z.literal('')),
  ciudad_ultima_vez: z.string().min(2, 'La ciudad es requerida'),
  sector_barrio: z.string().optional(),
  descripcion: z.string().optional(),
  contacto_buscador: z.string().min(5, 'El teléfono de contacto es requerido'),
  desde_donde_busca: z.string().optional(),
  reportado_por: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface FormularioBusquedaProps {
  onSuccess?: () => void;
}

export default function FormularioBusqueda({ onSuccess }: FormularioBusquedaProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const { error } = await supabase.from('busquedas_personas').insert({
      nombre_buscado: values.nombre_buscado.trim(),
      edad_aproximada: values.edad_aproximada !== '' && values.edad_aproximada !== undefined ? Number(values.edad_aproximada) : null,
      ciudad_ultima_vez: values.ciudad_ultima_vez.trim(),
      sector_barrio: values.sector_barrio?.trim() || null,
      descripcion: values.descripcion?.trim() || null,
      contacto_buscador: values.contacto_buscador.trim(),
      desde_donde_busca: values.desde_donde_busca?.trim() || null,
      reportado_por: values.reportado_por?.trim() || null,
      estado: 'buscando',
    });

    if (error) {
      toast.error('Error al registrar la búsqueda. Intente de nuevo.');
      return;
    }

    toast.success('Búsqueda publicada. Esperamos que pronto tengas noticias.');
    reset();
    onSuccess?.();
  }

  const inputClass =
    'w-full bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DC143C] placeholder-white/30 transition-all';
  const labelClass = 'block text-xs font-semibold text-white/70 mb-1';
  const errorClass = 'text-red-400 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre Buscado (Requerido) */}
      <div>
        <label className={labelClass}>Nombre completo de la persona que buscas *</label>
        <input
          {...register('nombre_buscado')}
          placeholder="Ej: Juan Pérez"
          className={inputClass}
        />
        {errors.nombre_buscado && (
          <p className={errorClass}>{errors.nombre_buscado.message}</p>
        )}
      </div>

      {/* Edad Aproximada (Opcional) */}
      <div>
        <label className={labelClass}>Edad aproximada</label>
        <input
          {...register('edad_aproximada')}
          type="number"
          placeholder="Ej: 34"
          className={inputClass}
        />
        {errors.edad_aproximada && (
          <p className={errorClass}>{errors.edad_aproximada.message}</p>
        )}
      </div>

      {/* Ciudad de última vez (Requerido) */}
      <div>
        <label className={labelClass}>Ciudad donde estaba cuando ocurrió el terremoto *</label>
        <input
          {...register('ciudad_ultima_vez')}
          placeholder="Ej: Caracas, Maracay, La Guaira"
          className={inputClass}
        />
        {errors.ciudad_ultima_vez && (
          <p className={errorClass}>{errors.ciudad_ultima_vez.message}</p>
        )}
      </div>

      {/* Sector o Barrio (Opcional) */}
      <div>
        <label className={labelClass}>Barrio o sector específico (ayuda a identificar)</label>
        <input
          {...register('sector_barrio')}
          placeholder="Ej: Los Palos Grandes, Catia, Macuto"
          className={inputClass}
        />
      </div>

      {/* Descripción (Opcional) */}
      <div>
        <label className={labelClass}>Descripción física, dónde trabaja, con quién vive, cualquier detalle útil...</label>
        <textarea
          {...register('descripcion')}
          rows={3}
          placeholder="Ej: Mide 1.75m, cabello oscuro, trabaja en el C.C. El Recreo, vive con sus abuelos."
          className={inputClass}
        />
      </div>

      {/* Contacto Buscador (Requerido) */}
      <div>
        <label className={labelClass}>Tu teléfono de contacto (con código de país si estás fuera de Venezuela) *</label>
        <input
          {...register('contacto_buscador')}
          type="tel"
          placeholder="Ej: +58 412 1234567 o +1 305 1234567"
          className={inputClass}
        />
        {errors.contacto_buscador && (
          <p className={errorClass}>{errors.contacto_buscador.message}</p>
        )}
      </div>

      {/* Desde dónde busca (Opcional) */}
      <div>
        <label className={labelClass}>Desde dónde buscas (ciudad, país) — opcional</label>
        <input
          {...register('desde_donde_busca')}
          placeholder="Ej: Santiago de Chile, Madrid, Miami"
          className={inputClass}
        />
      </div>

      {/* Nombre del buscador (Opcional) */}
      <div>
        <label className={labelClass}>Tu nombre — opcional</label>
        <input
          {...register('reportado_por')}
          placeholder="Ej: Hermano, Madre, Amigo"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#DC143C] hover:bg-[#b01030] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm active:translate-y-px"
      >
        {isSubmitting ? 'Publicando...' : 'Publicar búsqueda'}
      </button>
    </form>
  );
}
