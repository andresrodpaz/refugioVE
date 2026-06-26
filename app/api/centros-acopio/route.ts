import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ─── GET /api/centros-acopio ────────────────────────────────────────────────
// Query params:
//   estado_pais  — filtrar por estado/región
//   verificado   — "true" | "false"
//   limit        — número de resultados (default 100, max 500)
//   offset       — paginación (default 0)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const estado_pais = searchParams.get('estado_pais');
    const verificado  = searchParams.get('verificado');
    const limit       = Math.min(parseInt(searchParams.get('limit')  ?? '100'), 500);
    const offset      = Math.max(parseInt(searchParams.get('offset') ?? '0'),    0);

    const supabase = await createClient();

    let query = supabase
      .from('centros_acopio')
      .select('*', { count: 'exact' })
      .order('creado_en', { ascending: false })
      .range(offset, offset + limit - 1);

    if (estado_pais) query = query.ilike('estado_pais', `%${estado_pais}%`);
    if (verificado === 'true')  query = query.eq('verificado', true);
    if (verificado === 'false') query = query.eq('verificado', false);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, total: count ?? 0, limit, offset }, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

// ─── POST /api/centros-acopio ────────────────────────────────────────────────
// Body (JSON):
//   nombre*       — nombre del centro
//   direccion*    — dirección completa
//   estado_pais*  — estado o región de Venezuela
//   lat*          — latitud (número)
//   lng*          — longitud (número)
//   reportado_por — texto libre (quién reporta)
//   notas         — información adicional
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, direccion, estado_pais, lat, lng, reportado_por, notas } = body;

    if (!nombre || !direccion || !estado_pais) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, dirección, estado.' },
        { status: 400 }
      );
    }

    const parsedLat = lat != null ? parseFloat(lat) : null;
    const parsedLng = lng != null ? parseFloat(lng) : null;

    if (parsedLat == null || parsedLng == null || isNaN(parsedLat) || isNaN(parsedLng)) {
      return NextResponse.json(
        { error: 'Se requieren coordenadas válidas (lat, lng).' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('centros_acopio')
      .insert({
        nombre:        nombre.trim(),
        direccion:     direccion.trim(),
        estado_pais:   estado_pais.trim(),
        lat:           parsedLat,
        lng:           parsedLng,
        reportado_por: reportado_por?.trim() || null,
        notas:         notas?.trim() || null,
        verificado:    false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
