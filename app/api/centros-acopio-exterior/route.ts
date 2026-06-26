import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ─── GET /api/centros-acopio-exterior ──────────────────────────────────────
// Query params:
//   pais         — filtrar por país (búsqueda parcial, case-insensitive)
//   ciudad       — filtrar por ciudad (búsqueda parcial, case-insensitive)
//   verificado   — "true" | "false"
//   limit        — número de resultados (default 100, max 500)
//   offset       — paginación (default 0)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const pais       = searchParams.get('pais');
    const ciudad     = searchParams.get('ciudad');
    const verificado = searchParams.get('verificado');
    const limit      = Math.min(parseInt(searchParams.get('limit')  ?? '100'), 500);
    const offset     = Math.max(parseInt(searchParams.get('offset') ?? '0'),    0);

    const supabase = await createClient();

    let query = supabase
      .from('centros_acopio_exterior')
      .select('*', { count: 'exact' })
      .order('creado_en', { ascending: false })
      .range(offset, offset + limit - 1);

    if (pais)   query = query.ilike('pais',   `%${pais}%`);
    if (ciudad) query = query.ilike('ciudad', `%${ciudad}%`);
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

// ─── POST /api/centros-acopio-exterior ─────────────────────────────────────
// Body (JSON):
//   nombre*       — nombre del centro
//   direccion*    — dirección completa
//   ciudad*       — ciudad donde se encuentra
//   pais*         — país donde se encuentra
//   que_donar     — qué tipo de donaciones aceptan
//   lat           — latitud (se geocodifica por ciudad/país si se omite)
//   lng           — longitud (se geocodifica por ciudad/país si se omite)
//   reportado_por — texto libre (quién reporta)
//   notas         — información adicional
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, direccion, ciudad, pais, que_donar, lat, lng, reportado_por, notas } = body;

    if (!nombre || !direccion || !ciudad || !pais) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, dirección, ciudad, país.' },
        { status: 400 }
      );
    }

    let finalLat = lat != null && lat !== '' ? parseFloat(lat) : null;
    let finalLng = lng != null && lng !== '' ? parseFloat(lng) : null;

    if (finalLat == null || finalLng == null || isNaN(finalLat) || isNaN(finalLng)) {
      // Intentar obtener coordenadas aproximadas usando Nominatim de OpenStreetMap
      try {
        const query = `${encodeURIComponent(ciudad)}, ${encodeURIComponent(pais)}`;
        const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
          headers: {
            'User-Agent': 'RefugioVE/1.0 (refugiove.app@outlook.com)'
          }
        });

        if (geocodeRes.ok) {
          const geoData = await geocodeRes.json();
          if (geoData && geoData.length > 0) {
            finalLat = parseFloat(geoData[0].lat);
            finalLng = parseFloat(geoData[0].lon);
          }
        }
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError);
      }
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('centros_acopio_exterior')
      .insert({
        nombre:        nombre.trim(),
        direccion:     direccion.trim(),
        ciudad:        ciudad.trim(),
        pais:          pais.trim(),
        que_donar:     que_donar?.trim() || null,
        lat:           finalLat,
        lng:           finalLng,
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
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
