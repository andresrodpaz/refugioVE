'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function verificarRefugioAction(id: string) {
  const { error } = await supabaseAdmin.from('refugios').update({ verificado: true }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function eliminarRefugioAction(id: string) {
  const { error } = await supabaseAdmin.from('refugios').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function eliminarPacienteAction(id: string) {
  const { error } = await supabaseAdmin.from('pacientes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function verificarCentroAction(id: number) {
  const { error } = await supabaseAdmin.from('centros_acopio').update({ verificado: true }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function eliminarCentroAction(id: number) {
  const { error } = await supabaseAdmin.from('centros_acopio').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
