import { EstadoRefugio, CondicionPaciente, Servicio } from './types';

export const ESTADO_COLORS: Record<EstadoRefugio, string> = {
  activo: '#22c55e',
  lleno: '#eab308',
  cerrado: '#ef4444',
};

export const ESTADO_LABELS: Record<EstadoRefugio, string> = {
  activo: 'Activo',
  lleno: 'Lleno',
  cerrado: 'Cerrado',
};

export const CONDICION_COLORS: Record<CondicionPaciente, string> = {
  estable: '#22c55e',
  grave: '#f97316',
  critico: '#ef4444',
  dado_de_alta: '#6b7280',
  desconocido: '#6b7280',
};

export const CONDICION_LABELS: Record<CondicionPaciente, string> = {
  estable: 'Estable',
  grave: 'Grave',
  critico: 'Critico',
  dado_de_alta: 'Dado de alta',
  desconocido: 'Desconocido',
};

export const SERVICIOS_LABELS: Record<Servicio, string> = {
  agua: 'Agua',
  comida: 'Comida',
  medico: 'Medico',
  bano: 'Bano',
  electricidad: 'Electricidad',
  wifi: 'WiFi',
};

export const SERVICIOS_ICONS: Record<Servicio, string> = {
  agua: 'Gota',
  comida: 'UtensilsCrossed',
  medico: 'Cross',
  bano: 'ShowerHead',
  electricidad: 'Zap',
  wifi: 'Wifi',
};

export const VENEZUELA_CENTER: [number, number] = [8.0, -66.0];
export const VENEZUELA_ZOOM = 6;
