import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
          const data = await geocodeRes.json();
          if (data && data.length > 0) {
            finalLat = parseFloat(data[0].lat);
            finalLng = parseFloat(data[0].lon);
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
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        ciudad: ciudad.trim(),
        pais: pais.trim(),
        que_donar: que_donar?.trim() || null,
        lat: finalLat,
        lng: finalLng,
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
