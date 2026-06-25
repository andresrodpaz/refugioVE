'use client';

import { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Navigation, CheckCircle2, Users } from 'lucide-react';
import { Refugio, Paciente } from '@/lib/types';
import { ESTADO_COLORS, ESTADO_LABELS, SERVICIOS_LABELS, VENEZUELA_CENTER, VENEZUELA_ZOOM } from '@/lib/constants';

// Fix Leaflet default icon bug in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

function createColoredIcon(color: string) {
  return L.divIcon({
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

function createHospitalIcon() {
  return L.divIcon({
    html: `<div style="background:#3b82f6;width:24px;height:24px;border-radius:4px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:14px">🏥</div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

interface MapClickHandlerProps {
  addingMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ addingMode, onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (addingMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

interface Props {
  refugios: Refugio[];
  pacientes: Paciente[];
  addingMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
  tempPin?: { lat: number; lng: number } | null;
}

export default function MapaRefugios({ refugios, pacientes, addingMode, onMapClick, tempPin }: Props) {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <MapContainer
      center={VENEZUELA_CENTER}
      zoom={VENEZUELA_ZOOM}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      className={addingMode ? 'cursor-crosshair' : ''}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler addingMode={addingMode} onMapClick={onMapClick} />

      {/* Refugio markers */}
      {refugios.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={createColoredIcon(ESTADO_COLORS[r.estado])}
        >
          <Popup className="refugio-popup" maxWidth={260}>
            <div className="font-sans text-sm">
              <div className="flex items-center gap-1 mb-1">
                <strong className="text-gray-900">{r.nombre}</strong>
                {r.verificado && <span className="text-green-600 text-xs">✓ Verificado</span>}
              </div>
              <p className="text-gray-600 text-xs mb-1">{r.direccion}</p>
              <span
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: ESTADO_COLORS[r.estado] + '22', color: ESTADO_COLORS[r.estado] }}
              >
                {ESTADO_LABELS[r.estado]}
              </span>
              {(r.capacidad_total !== null || r.capacidad_disponible !== null) && (
                <p className="text-gray-700 text-xs mb-1 flex items-center gap-1">
                  <span>👥</span>
                  {r.capacidad_disponible ?? '?'} / {r.capacidad_total ?? '?'} lugares
                </p>
              )}
              {r.servicios && r.servicios.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {r.servicios.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                      {SERVICIOS_LABELS[s] ?? s}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 mt-1">
                {r.contacto && (
                  <a href={`tel:${r.contacto}`} className="text-yellow-600 text-xs font-semibold hover:underline">
                    📞 Llamar
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 text-xs font-semibold hover:underline"
                >
                  🗺️ Como llegar
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Hospital markers */}
      {pacientes
        .filter((p) => p.hospital_lat !== null && p.hospital_lng !== null)
        .map((p) => (
          <Marker
            key={`h-${p.id}`}
            position={[p.hospital_lat!, p.hospital_lng!]}
            icon={createHospitalIcon()}
          >
            <Popup maxWidth={240}>
              <div className="font-sans text-sm">
                <strong className="text-gray-900">{p.hospital_nombre}</strong>
                {p.hospital_direccion && (
                  <p className="text-gray-600 text-xs mt-0.5">{p.hospital_direccion}</p>
                )}
                <p className="text-gray-700 text-xs mt-1">
                  Paciente: <strong>{p.nombre_paciente}</strong>
                </p>
                {p.contacto_familiar && (
                  <a href={`tel:${p.contacto_familiar}`} className="text-yellow-600 text-xs font-semibold hover:underline">
                    📞 Contactar familiar
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Temporary pin */}
      {tempPin && (
        <Marker
          position={[tempPin.lat, tempPin.lng]}
          icon={createColoredIcon('#DC143C')}
        />
      )}
    </MapContainer>
  );
}
