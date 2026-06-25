import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

    // lat/lng are NOT NULL in DB — must have valid coordinates
    if (parsedLat == null || parsedLng == null || isNaN(parsedLat) || isNaN(parsedLng)) {
      return NextResponse.json(
        { error: 'Se requieren coordenadas válidas. Activa el GPS o selecciona un estado para obtenerlas automáticamente.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('centros_acopio')
      .insert({
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        estado_pais: estado_pais.trim(),
        lat: parsedLat,
        lng: parsedLng,
        reportado_por: reportado_por?.trim() || null,
        notas: notas?.trim() || null,
        verificado: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
