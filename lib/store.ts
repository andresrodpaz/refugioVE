'use client';

import { Paciente, Refugio } from './types';

// ── Seed data ────────────────────────────────────────────────────────────────
// Pacientes localizados en el Hospital Perez Carreno, Caracas

const SEED_PACIENTES: Paciente[] = [
  { id: '1', nombre_paciente: 'Yenni Marcano', cedula: '18384289', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', nombre_paciente: 'Manoela De Anzola', cedula: '296723', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', nombre_paciente: 'Gonzalo Leon', cedula: '22916229', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', nombre_paciente: 'Celiana Uijares', cedula: '19739177', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', nombre_paciente: 'Yonny Ortuno', cedula: '5199652', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', nombre_paciente: 'Ang Fernandez', cedula: '25699054', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '7', nombre_paciente: 'Plyandra Sojo', cedula: '6904629', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '8', nombre_paciente: 'Ebar Yegue', cedula: '24058780', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '9', nombre_paciente: 'Marcela Bernal', cedula: '6049995', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '10', nombre_paciente: 'Valeria Azocar', cedula: '28544619', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '11', nombre_paciente: 'Anabela Morillo', cedula: '34588981', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '12', nombre_paciente: 'Lesvia Morales', cedula: '5965096', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '13', nombre_paciente: 'Mendo Bueno', cedula: '17158021', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '14', nombre_paciente: 'Maria Montolla', cedula: '25025734', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '15', nombre_paciente: 'Narledi Rivero', cedula: '36091784', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '16', nombre_paciente: 'Jsabe Torres', cedula: '4918019', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '17', nombre_paciente: 'Duhar Lopez', cedula: '12115323', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '18', nombre_paciente: 'Yanel Acosta', cedula: '31760907', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '19', nombre_paciente: 'Meri Chavez', cedula: '81462470', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '20', nombre_paciente: 'Eisabeth Chacon', cedula: '27374286', edad: null, descripcion_fisica: null, hospital_nombre: 'Hospital Perez Carreno', hospital_direccion: 'Caracas, Venezuela', hospital_lat: 10.4806, hospital_lng: -66.9036, condicion: 'estable', contacto_familiar: null, reportado_por: null, notas: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const PACIENTES_KEY = 've_pacientes';
const REFUGIOS_KEY = 've_refugios';
const SEEDED_KEY = 've_seeded_v1';

// ── Listeners (simple pub/sub for cross-hook reactivity) ─────────────────────
type Listener = () => void;
const pacientesListeners = new Set<Listener>();
const refugiosListeners = new Set<Listener>();

export function subscribePacientes(fn: Listener) {
  pacientesListeners.add(fn);
  return () => pacientesListeners.delete(fn);
}

export function subscribeRefugios(fn: Listener) {
  refugiosListeners.add(fn);
  return () => refugiosListeners.delete(fn);
}

function notifyPacientes() {
  pacientesListeners.forEach((fn) => fn());
}

function notifyRefugios() {
  refugiosListeners.forEach((fn) => fn());
}

// ── Init seed ────────────────────────────────────────────────────────────────
function initSeed() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(SEEDED_KEY)) return;
  localStorage.setItem(PACIENTES_KEY, JSON.stringify(SEED_PACIENTES));
  localStorage.setItem(REFUGIOS_KEY, JSON.stringify([]));
  localStorage.setItem(SEEDED_KEY, '1');
}

// ── Pacientes CRUD ────────────────────────────────────────────────────────────
export function getPacientes(): Paciente[] {
  if (typeof window === 'undefined') return [];
  initSeed();
  try {
    return JSON.parse(localStorage.getItem(PACIENTES_KEY) ?? '[]') as Paciente[];
  } catch {
    return [];
  }
}

export function addPaciente(data: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>): Paciente {
  const now = new Date().toISOString();
  const nuevo: Paciente = {
    ...data,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };
  const all = getPacientes();
  localStorage.setItem(PACIENTES_KEY, JSON.stringify([nuevo, ...all]));
  notifyPacientes();
  return nuevo;
}

export function updatePaciente(id: string, data: Partial<Paciente>): void {
  const all = getPacientes().map((p) =>
    p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p,
  );
  localStorage.setItem(PACIENTES_KEY, JSON.stringify(all));
  notifyPacientes();
}

export function deletePaciente(id: string): void {
  const all = getPacientes().filter((p) => p.id !== id);
  localStorage.setItem(PACIENTES_KEY, JSON.stringify(all));
  notifyPacientes();
}

// ── Refugios CRUD ─────────────────────────────────────────────────────────────
export function getRefugios(): Refugio[] {
  if (typeof window === 'undefined') return [];
  initSeed();
  try {
    return JSON.parse(localStorage.getItem(REFUGIOS_KEY) ?? '[]') as Refugio[];
  } catch {
    return [];
  }
}

export function addRefugio(data: Omit<Refugio, 'id' | 'created_at' | 'updated_at'>): Refugio {
  const now = new Date().toISOString();
  const nuevo: Refugio = {
    ...data,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };
  const all = getRefugios();
  localStorage.setItem(REFUGIOS_KEY, JSON.stringify([nuevo, ...all]));
  notifyRefugios();
  return nuevo;
}

export function updateRefugio(id: string, data: Partial<Refugio>): void {
  const all = getRefugios().map((r) =>
    r.id === id ? { ...r, ...data, updated_at: new Date().toISOString() } : r,
  );
  localStorage.setItem(REFUGIOS_KEY, JSON.stringify(all));
  notifyRefugios();
}

export function deleteRefugio(id: string): void {
  const all = getRefugios().filter((r) => r.id !== id);
  localStorage.setItem(REFUGIOS_KEY, JSON.stringify(all));
  notifyRefugios();
}
