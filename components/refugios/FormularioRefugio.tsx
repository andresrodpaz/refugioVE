'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Servicio } from '@/lib/types';

const SERVICIOS: { value: Servicio; label: string }[] = [
  { value: 'agua', label: 'Agua' },
  { value: 'comida', label: 'Comida' },
  { value: 'medico', label: 'Medico' },
  { value: 'bano', label: 'Bano' },
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'wifi', label: 'WiFi' },
];

const schema = z
  .object({
    nombre: z.string().min(2, 'Nombre requerido'),
    direccion: z.string().min(3, 'Direccion requerida'),
    lat: z.coerce.number({ invalid_type_error: 'Latitud invalida' }).min(-90).max(90),
    lng: z.coerce.number({ invalid_type_error: 'Longitud invalida' }).min(-180).max(180),
    estado: z.enum(['activo', 'lleno', 'cerrado']).default('activo'),
    capacidad_total: z.coerce.number().int().positive().optional().or(z.literal('')),
    capacidad_disponible: z.coerce.number().int().min(0).optional().or(z.literal('')),
    contacto: z.string().optional(),
    servicios: z.array(z.string()).default([]),
    reportado_por: z.string().optional(),
    notas: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.capacidad_total !== '' &&
        data.capacidad_disponible !== '' &&
        data.capacidad_total !== undefined &&
        data.capacidad_disponible !== undefined
      ) {
        return Number(data.capacidad_disponible) <= Number(data.capacidad_total);
      }
      return true;
    },
    { message: 'Capacidad disponible no puede superar la total', path: ['capacidad_disponible'] },
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  initialLat?: number;
  initialLng?: number;
  onSuccess?: () => void;
}

export default function FormularioRefugio({ initialLat, initialLng, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      estado: 'activo',
      lat: initialLat,
      lng: initialLng,
      servicios: [],
    },
  });

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const { error } = await supabase.from('refugios').insert({
      nombre: values.nombre,
      direccion: values.direccion,
      lat: values.lat,
      lng: values.lng,
      estado: values.estado,
      capacidad_total: values.capacidad_total !== '' ? Number(values.capacidad_total) : null,
      capacidad_disponible:
        values.capacidad_disponible !== '' ? Number(values.capacidad_disponible) : null,
      contacto: values.contacto || null,
      servicios: values.servicios,
      reportado_por: values.reportado_por || null,
      notas: values.notas || null,
    });

    if (error) {
      toast.error('Error al reportar el refugio. Intenta de nuevo.');
      return;
    }

    toast.success('Refugio reportado. Gracias por ayudar.');
    reset();
    onSuccess?.();
  }

  const inputClass =
    'w-full bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DC143C] placeholder-white/30';
  const labelClass = 'block text-xs font-semibold text-white/70 mb-1';
  const errorClass = 'text-red-400 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Nombre del refugio *</label>
        <input {...register('nombre')} placeholder="Ej: Escuela Bolivar" className={inputClass} />
        {errors.nombre && <p className={errorClass}>{errors.nombre.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Direccion *</label>
        <input
          {...register('direccion')}
          placeholder="Calle, sector, municipio"
          className={inputClass}
        />
        {errors.direccion && <p className={errorClass}>{errors.direccion.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Latitud *</label>
          <input
            {...register('lat')}
            type="number"
            step="any"
            placeholder="8.0"
            className={inputClass}
          />
          {errors.lat && <p className={errorClass}>{errors.lat.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Longitud *</label>
          <input
            {...register('lng')}
            type="number"
            step="any"
            placeholder="-66.0"
            className={inputClass}
          />
          {errors.lng && <p className={errorClass}>{errors.lng.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Estado</label>
        <select {...register('estado')} className={inputClass}>
          <option value="activo">Activo</option>
          <option value="lleno">Lleno</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Capacidad total</label>
          <input
            {...register('capacidad_total')}
            type="number"
            placeholder="100"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Disponible</label>
          <input
            {...register('capacidad_disponible')}
            type="number"
            placeholder="50"
            className={inputClass}
          />
          {errors.capacidad_disponible && (
            <p className={errorClass}>{errors.capacidad_disponible.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Telefono de contacto</label>
        <input
          {...register('contacto')}
          type="tel"
          placeholder="+58 412 000 0000"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Servicios disponibles</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {SERVICIOS.map((s) => (
            <label
              key={s.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-white/80"
            >
              <input
                type="checkbox"
                value={s.value}
                {...register('servicios')}
                className="accent-[#DC143C] w-4 h-4"
              />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Reportado por (opcional)</label>
        <input
          {...register('reportado_por')}
          placeholder="Tu nombre o seudónimo"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Notas adicionales</label>
        <textarea
          {...register('notas')}
          rows={2}
          placeholder="Informacion adicional..."
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#DC143C] hover:bg-[#b01030] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {isSubmitting ? 'Enviando...' : 'Reportar refugio'}
      </button>
    </form>
  );
}
