export type EstadoRefugio = 'activo' | 'lleno' | 'cerrado';
export type CondicionPaciente = 'estable' | 'grave' | 'critico' | 'dado_de_alta' | 'desconocido';
export type Servicio = 'agua' | 'comida' | 'medico' | 'bano' | 'electricidad' | 'wifi';

export interface Refugio {
  id: string;
  nombre: string;
  direccion: string;
  estado: EstadoRefugio;
  capacidad_total: number | null;
  capacidad_disponible: number | null;
  lat: number;
  lng: number;
  contacto: string | null;
  servicios: Servicio[];
  reportado_por: string | null;
  verificado: boolean;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Paciente {
  id: string;
  nombre_paciente: string;
  cedula: string | null;
  edad: number | null;
  descripcion_fisica: string | null;
  hospital_nombre: string;
  hospital_direccion: string | null;
  hospital_lat: number | null;
  hospital_lng: number | null;
  condicion: CondicionPaciente;
  contacto_familiar: string | null;
  reportado_por: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export type EstadoBusqueda = 'buscando' | 'localizado_sano' | 'localizado_herido' | 'fallecido';

export interface BusquedaPersona {
  id: string;
  nombre_buscado: string;
  edad_aproximada: number | null;
  ciudad_ultima_vez: string;
  sector_barrio: string | null;
  descripcion: string | null;
  contacto_buscador: string;
  desde_donde_busca: string | null;
  estado: EstadoBusqueda;
  reportado_por: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface CentroAcopio {
  id: number;
  nombre: string;
  direccion: string;
  estado_pais: string;
  lat: number;
  lng: number;
  reportado_por: string | null;
  verificado: boolean;
  notas: string | null;
  creado_en: string;
}

export interface CentroAcopioExterior {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  pais: string;
  que_donar: string | null;
  lat: number | null;
  lng: number | null;
  reportado_por: string | null;
  verificado: boolean;
  notas: string | null;
  creado_en: string;
}
