import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ─── GET /api/refugios ──────────────────────────────────────────────────────
// Query params:
//   estado       — filtrar por estado del refugio: "activo" | "lleno" | "cerrado"
//   verificado   — "true" | "false"
//   limit        — número de resultados (default 100, max 500)
//   offset       — paginación (default 0)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const estado     = searchParams.get('estado');
    const verificado = searchParams.get('verificado');
    const limit      = Math.min(parseInt(searchParams.get('limit')  ?? '100'), 500);
    const offset     = Math.max(parseInt(searchParams.get('offset') ?? '0'),    0);

    const VALID_ESTADOS = ['activo', 'lleno', 'cerrado'];

    if (estado && !VALID_ESTADOS.includes(estado)) {
      return NextResponse.json(
        { error: `Estado inválido. Valores posibles: ${VALID_ESTADOS.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let query = supabase
      .from('refugios')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (estado)    query = query.eq('estado', estado);
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

// ─── POST /api/refugios ─────────────────────────────────────────────────────
// Body (JSON):
//   nombre*             — nombre del refugio
//   direccion*          — dirección completa
//   lat*                — latitud (número)
//   lng*                — longitud (número)
//   estado              — "activo" | "lleno" | "cerrado" (default: "activo")
//   capacidad_total     — número entero
//   capacidad_disponible — número entero
//   contacto            — teléfono o información de contacto
//   servicios           — array de strings: ["agua", "comida", "medico", "bano", "electricidad", "wifi"]
//   reportado_por       — texto libre (quién reporta)
//   notas               — información adicional
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      direccion,
      lat,
      lng,
      estado = 'activo',
      capacidad_total,
      capacidad_disponible,
      contacto,
      servicios,
      reportado_por,
      notas,
    } = body;

    if (!nombre || !direccion) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, dirección.' },
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

    const VALID_ESTADOS = ['activo', 'lleno', 'cerrado'];
    if (!VALID_ESTADOS.includes(estado)) {
      return NextResponse.json(
        { error: `Estado inválido. Valores posibles: ${VALID_ESTADOS.join(', ')}` },
        { status: 400 }
      );
    }

    const VALID_SERVICIOS = ['agua', 'comida', 'medico', 'bano', 'electricidad', 'wifi'];
    const serviciosArray: string[] = Array.isArray(servicios)
      ? servicios.filter((s: string) => VALID_SERVICIOS.includes(s))
      : [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('refugios')
      .insert({
        nombre:               nombre.trim(),
        direccion:            direccion.trim(),
        estado,
        lat:                  parsedLat,
        lng:                  parsedLng,
        capacidad_total:      capacidad_total != null ? parseInt(capacidad_total) : null,
        capacidad_disponible: capacidad_disponible != null ? parseInt(capacidad_disponible) : null,
        contacto:             contacto?.trim() || null,
        servicios:            serviciosArray,
        reportado_por:        reportado_por?.trim() || null,
        notas:                notas?.trim() || null,
        verificado:           false,
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
