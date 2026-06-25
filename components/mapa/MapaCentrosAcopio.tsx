'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CentroAcopio } from '@/lib/types';

// Fix Leaflet default icon bug in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

function createAcopioIcon(verificado: boolean) {
  const color = verificado ? '#f1c40f' : '#2ecc71';
  const borderColor = verificado ? '#d4a017' : '#27ae60';
  return L.divIcon({
    html: `<div style="
      background:${color};
      width:22px;height:22px;
      border-radius:50%;
      border:3px solid ${borderColor};
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
      font-size:10px;
    ">📦</div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

interface Props {
  centros: CentroAcopio[];
}

const VENEZUELA_CENTER: [number, number] = [8.0, -66.0];
const VENEZUELA_ZOOM = 6;

export default function MapaCentrosAcopio({ centros }: Props) {
  return (
    <MapContainer
      center={VENEZUELA_CENTER}
      zoom={VENEZUELA_ZOOM}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {centros.map((c) => (
        <Marker
          key={c.id}
          position={[Number(c.lat), Number(c.lng)]}
          icon={createAcopioIcon(c.verificado)}
        >
          <Popup maxWidth={260}>
            <div className="font-sans text-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <strong className="text-gray-900 text-sm">{c.nombre}</strong>
                {c.verificado ? (
                  <span
                    style={{
                      background: '#d4edda',
                      color: '#155724',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    ✓ Verificado
                  </span>
                ) : (
                  <span
                    style={{
                      background: '#fff3cd',
                      color: '#856404',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    Sin verificar
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-xs mb-1">{c.direccion}</p>
              <p className="text-gray-500 text-xs mb-1">
                📍 {c.estado_pais}
              </p>
              {c.notas && (
                <p className="text-gray-500 text-xs mt-1 italic">{c.notas}</p>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 text-xs font-semibold hover:underline block mt-2"
              >
                🗺️ Cómo llegar
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
