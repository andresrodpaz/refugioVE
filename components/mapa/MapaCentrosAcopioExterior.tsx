'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CentroAcopioExterior } from '@/lib/types';

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
    ">🌍</div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

function createUserLocationIcon() {
  return L.divIcon({
    html: `<div style="position:relative;width:24px;height:24px;">
      <div style="
        position:absolute;inset:0;
        background:rgba(52,152,219,0.25);
        border-radius:50%;
        animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:14px;height:14px;
        background:#3498db;
        border-radius:50%;
        border:2.5px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
      "></div>
    </div>
    <style>
      @keyframes ping {
        75%,100%{transform:scale(2);opacity:0}
      }
    </style>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

// Auto-zoom/pan to fit all visible markers + user location
function MapAutoZoom({
  centros,
  userLocation,
}: {
  centros: CentroAcopioExterior[];
  userLocation?: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [];
    centros.forEach((c) => {
      if (c.lat != null && c.lng != null) points.push([Number(c.lat), Number(c.lng)]);
    });
    if (userLocation) points.push([userLocation.lat, userLocation.lng]);

    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 10, { animate: true });
    } else {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centros, userLocation]);

  return null;
}

interface Props {
  centros: CentroAcopioExterior[];
  userLocation?: { lat: number; lng: number };
}

const GLOBAL_CENTER: [number, number] = [20.0, 0.0];
const GLOBAL_ZOOM = 2;

export default function MapaCentrosAcopioExterior({ centros, userLocation }: Props) {
  return (
    <MapContainer
      center={GLOBAL_CENTER}
      zoom={GLOBAL_ZOOM}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapAutoZoom centros={centros} userLocation={userLocation} />

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={createUserLocationIcon()}
          zIndexOffset={1000}
        >
          <Popup maxWidth={200}>
            <div className="font-sans text-sm">
              <strong className="text-gray-900">📍 Tu ubicación</strong>
              <p className="text-gray-500 text-xs mt-1">Centros ordenados por cercanía a ti</p>
            </div>
          </Popup>
        </Marker>
      )}

      {centros.filter((c) => c.lat != null && c.lng != null).map((c) => (
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
                📍 {c.ciudad}, {c.pais}
              </p>
              {c.que_donar && (
                <p className="text-gray-700 font-medium text-xs mt-1">Donar: {c.que_donar}</p>
              )}
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
