'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Copy,
  Check,
  BookOpen,
  AlertCircle,
  Building2,
  Package,
  Globe,
  Code2,
  Terminal,
} from 'lucide-react';

/* ── tiny helpers ────────────────────────────────────────── */

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  return method === 'GET' ? (
    <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-emerald-700/60 bg-emerald-950/60 text-emerald-400 min-w-[44px] text-center">
      GET
    </span>
  ) : (
    <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-blue-700/60 bg-blue-950/60 text-blue-400 min-w-[44px] text-center">
      POST
    </span>
  );
}

function StatusBadge({ code }: { code: 200 | 201 | 400 | 500 }) {
  const styles: Record<number, string> = {
    200: 'border-emerald-700/60 bg-emerald-950/60 text-emerald-400',
    201: 'border-emerald-700/60 bg-emerald-950/60 text-emerald-400',
    400: 'border-yellow-700/60 bg-yellow-950/60 text-yellow-400',
    500: 'border-red-700/60 bg-red-950/60 text-red-400',
  };
  const labels: Record<number, string> = {
    200: '200 OK',
    201: '201 Created',
    400: '400 Validación',
    500: '500 Error',
  };
  return (
    <span
      className={`inline-flex font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${styles[code]}`}
    >
      {labels[code]}
    </span>
  );
}

function ReqBadge() {
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-700/60 bg-red-950/40 text-red-400 whitespace-nowrap">
      obligatorio
    </span>
  );
}

function OptBadge() {
  return (
    <span className="text-[10px] font-medium text-white/30">opcional</span>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[12px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/80">
      {children}
    </code>
  );
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="bg-black/30 border border-white/10 rounded-lg p-4 font-mono text-[12px] overflow-x-auto leading-relaxed text-white/75 whitespace-pre">
      {children}
    </pre>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[13px] text-blue-300 bg-blue-950/40 border border-blue-700/40 rounded-lg px-3 py-2.5 mt-3 leading-relaxed">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/* ── Tab system ──────────────────────────────────────────── */

type TabKey = 'params' | 'response' | 'example';

function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: TabKey; label: string }[];
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-white/8">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`text-[12px] px-3 py-1 rounded font-medium transition-colors ${
            active === t.key
              ? 'bg-white/10 text-white border border-white/15'
              : 'text-white/40 hover:text-white/70 hover:bg-white/5'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Endpoint card ───────────────────────────────────────── */

interface ParamRow {
  name: string;
  type: string;
  req?: boolean;
  description: React.ReactNode;
  default?: string;
}

interface EndpointProps {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  paramLabel?: string;
  params: ParamRow[];
  responseCode: string;
  statuses: (200 | 201 | 400 | 500)[];
  exampleReq: string;
  note?: React.ReactNode;
}

function EndpointCard({
  id,
  method,
  path,
  description,
  paramLabel,
  params,
  responseCode,
  statuses,
  exampleReq,
  note,
}: EndpointProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('params');

  const tabDefs: { key: TabKey; label: string }[] =
    method === 'GET'
      ? [
          { key: 'params', label: 'Parámetros' },
          { key: 'response', label: 'Respuesta' },
          { key: 'example', label: 'Ejemplo' },
        ]
      : [
          { key: 'params', label: 'Body' },
          { key: 'response', label: 'Respuesta' },
          { key: 'example', label: 'Ejemplo' },
        ];

  return (
    <div
      id={id}
      className="border border-white/10 rounded-xl overflow-hidden mb-3 transition-colors"
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#1e293b] hover:bg-[#243044] transition-colors text-left"
      >
        <MethodBadge method={method} />
        <span className="font-mono text-[13px] font-semibold text-white/90">
          {path}
        </span>
        <span className="text-[13px] text-white/40 ml-auto pl-3 hidden sm:block">
          {description}
        </span>
        <ChevronDown
          size={15}
          className={`text-white/30 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Body */}
      {open && (
        <div className="bg-[#182030] border-t border-white/8">
          <Tabs tabs={tabDefs} active={tab} onChange={setTab} />

          {/* Params / Body */}
          {tab === 'params' && (
            <div className="p-4">
              <table className="w-full text-[13px]">
                <thead>
                  <tr>
                    {method === 'GET' ? (
                      <>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2 pr-4">
                          Parámetro
                        </th>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2 pr-4">
                          Tipo
                        </th>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2 pr-4">
                          Descripción
                        </th>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2">
                          Default
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2 pr-4">
                          Campo
                        </th>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2 pr-4">
                          Tipo
                        </th>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2 pr-4"></th>
                        <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-white/30 pb-2">
                          Descripción
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {params.map((p, i) => (
                    <tr
                      key={i}
                      className="border-t border-white/5 hover:bg-white/3"
                    >
                      <td className="py-2.5 pr-4">
                        <InlineCode>{p.name}</InlineCode>
                      </td>
                      <td className="py-2.5 pr-4 text-white/50">{p.type}</td>
                      {method === 'POST' && (
                        <td className="py-2.5 pr-4">
                          {p.req ? <ReqBadge /> : <OptBadge />}
                        </td>
                      )}
                      <td className="py-2.5 text-white/60">{p.description}</td>
                      {method === 'GET' && (
                        <td className="py-2.5 text-white/30 font-mono text-[12px]">
                          {p.default ?? '—'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {note && <InfoNote>{note}</InfoNote>}
            </div>
          )}

          {/* Response */}
          {tab === 'response' && (
            <div className="p-4 space-y-3">
              <Pre>{responseCode}</Pre>
              <div className="flex flex-wrap gap-2 pt-1">
                {statuses.map((s) => (
                  <StatusBadge key={s} code={s} />
                ))}
              </div>
            </div>
          )}

          {/* Example */}
          {tab === 'example' && (
            <div className="p-4 space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold">
                Petición
              </p>
              <Pre>{exampleReq}</Pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Copy button ─────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded border border-white/15 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors whitespace-nowrap"
    >
      {copied ? (
        <Check size={12} className="text-emerald-400" />
      ) : (
        <Copy size={12} />
      )}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

/* ── Section heading ─────────────────────────────────────── */

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[17px] font-bold text-white mt-10 mb-4 pb-3 border-b border-white/10">
      <Icon size={18} className="text-white/30" />
      {children}
    </div>
  );
}

/* ── Sidebar link ────────────────────────────────────────── */

function SidebarLink({
  href,
  dot,
  children,
}: {
  href: string;
  dot?: 'get' | 'post';
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-1.5 text-[12px] text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors"
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dot === 'get' ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
        />
      )}
      {children}
    </a>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */

const BASE_URL = 'https://refugio-ve.vercel.app/api';

export default function DocumentacionPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-white/8 bg-[#0a1120] py-6 gap-0.5">
        <div className="px-4 pb-4 mb-2 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DC143C]/20 border border-[#DC143C]/30 flex items-center justify-center">
              <Code2 size={13} className="text-[#DC143C]" />
            </div>
            <span className="text-[13px] font-semibold text-white/70">
              RefugioVE API
            </span>
          </div>
        </div>

        <p className="px-4 text-[10px] uppercase tracking-widest text-white/20 font-semibold mt-2 mb-1">
          General
        </p>
        <SidebarLink href="#intro">
          <BookOpen size={12} />
          Introducción
        </SidebarLink>
        <SidebarLink href="#errors">
          <AlertCircle size={12} />
          Errores
        </SidebarLink>

        <p className="px-4 text-[10px] uppercase tracking-widest text-white/20 font-semibold mt-4 mb-1">
          Refugios
        </p>
        <SidebarLink href="#r-get" dot="get">
          GET /refugios
        </SidebarLink>
        <SidebarLink href="#r-post" dot="post">
          POST /refugios
        </SidebarLink>

        <p className="px-4 text-[10px] uppercase tracking-widest text-white/20 font-semibold mt-4 mb-1">
          Acopio Venezuela
        </p>
        <SidebarLink href="#ca-get" dot="get">
          GET /centros-acopio
        </SidebarLink>
        <SidebarLink href="#ca-post" dot="post">
          POST /centros-acopio
        </SidebarLink>

        <p className="px-4 text-[10px] uppercase tracking-widest text-white/20 font-semibold mt-4 mb-1">
          Acopio Exterior
        </p>
        <SidebarLink href="#cae-get" dot="get">
          GET /centros-acopio-exterior
        </SidebarLink>
        <SidebarLink href="#cae-post" dot="post">
          POST /centros-acopio-exterior
        </SidebarLink>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 md:px-12 py-10 pb-28 md:pb-16 max-w-3xl">
        {/* Hero */}
        <section id="intro" className="mb-8 pb-8 border-b border-white/10">
          <p className="text-[11px] uppercase tracking-widest text-[#DC143C] font-semibold mb-2">
            Documentación
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            RefugioVE — API Reference
          </h1>
          <p className="text-white/50 text-[15px] mb-5 leading-relaxed">
            Plataforma ciudadana de emergencias. Todos los endpoints devuelven
            JSON. No se requiere autenticación.
          </p>

          {/* Base URL box */}
          <div className="flex items-center gap-3 bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold whitespace-nowrap">
              Base URL
            </span>
            <code className="font-mono text-[13px] text-[#DC143C] flex-1 min-w-0 break-all">
              {BASE_URL}
            </code>
            <CopyButton text={BASE_URL} />
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Endpoints', value: '6' },
            { label: 'Formato', value: 'JSON' },
            { label: 'Auth', value: 'Ninguna' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1">
                {s.label}
              </p>
              <p className="text-2xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── REFUGIOS ── */}
        <SectionHeading icon={Building2}>Refugios</SectionHeading>

        <EndpointCard
          id="r-get"
          method="GET"
          path="/refugios"
          description="Listar refugios"
          params={[
            {
              name: 'estado',
              type: 'string',
              description: (
                <>
                  <InlineCode>activo</InlineCode> ·{' '}
                  <InlineCode>lleno</InlineCode> ·{' '}
                  <InlineCode>cerrado</InlineCode>
                </>
              ),
            },
            {
              name: 'verificado',
              type: 'string',
              description: (
                <>
                  <InlineCode>true</InlineCode> o <InlineCode>false</InlineCode>
                </>
              ),
            },
            {
              name: 'limit',
              type: 'number',
              description: 'Número de resultados (máx. 500)',
              default: '100',
            },
            {
              name: 'offset',
              type: 'number',
              description: 'Para paginación',
              default: '0',
            },
          ]}
          responseCode={`{
  "data": [
    {
      "id": "uuid",
      "nombre": "Refugio Central",
      "direccion": "Av. Principal 123",
      "estado": "activo",
      "lat": 10.4806,
      "lng": -66.9036,
      "capacidad_total": 100,
      "capacidad_disponible": 40,
      "contacto": "+58 412 0000000",
      "servicios": ["agua", "comida", "bano"],
      "reportado_por": "Cruz Roja",
      "notas": null,
      "verificado": true,
      "created_at": "2025-06-01T12:00:00Z",
      "updated_at": "2025-06-01T12:00:00Z"
    }
  ],
  "total": 17,
  "limit": 100,
  "offset": 0
}`}
          statuses={[200, 500]}
          exampleReq={`GET ${BASE_URL}/refugios?estado=activo&verificado=true&limit=20`}
        />

        <EndpointCard
          id="r-post"
          method="POST"
          path="/refugios"
          description="Registrar refugio"
          params={[
            { name: 'nombre', type: 'string', req: true, description: 'Nombre del refugio' },
            { name: 'direccion', type: 'string', req: true, description: 'Dirección completa' },
            { name: 'lat', type: 'number', req: true, description: 'Latitud' },
            { name: 'lng', type: 'number', req: true, description: 'Longitud' },
            {
              name: 'estado',
              type: 'string',
              description: (
                <>
                  <InlineCode>activo</InlineCode> (default) ·{' '}
                  <InlineCode>lleno</InlineCode> ·{' '}
                  <InlineCode>cerrado</InlineCode>
                </>
              ),
            },
            { name: 'capacidad_total', type: 'number', description: 'Capacidad máxima de personas' },
            { name: 'capacidad_disponible', type: 'number', description: 'Espacios disponibles actualmente' },
            { name: 'contacto', type: 'string', description: 'Teléfono u otra info de contacto' },
            {
              name: 'servicios',
              type: 'string[]',
              description: (
                <>
                  <InlineCode>agua</InlineCode> · <InlineCode>comida</InlineCode>{' '}
                  · <InlineCode>medico</InlineCode> · <InlineCode>bano</InlineCode>{' '}
                  · <InlineCode>electricidad</InlineCode> · <InlineCode>wifi</InlineCode>
                </>
              ),
            },
            { name: 'reportado_por', type: 'string', description: 'Quién reporta el refugio' },
            { name: 'notas', type: 'string', description: 'Información adicional' },
          ]}
          responseCode={`{
  "success": true,
  "data": { /* objeto del refugio recién creado */ }
}`}
          statuses={[201, 400, 500]}
          exampleReq={`POST ${BASE_URL}/refugios
Content-Type: application/json

{
  "nombre": "Refugio Norte",
  "direccion": "Calle 5, Barrio El Carmen",
  "lat": 10.4806,
  "lng": -66.9036,
  "estado": "activo",
  "capacidad_total": 80,
  "capacidad_disponible": 30,
  "contacto": "+58 412 1234567",
  "servicios": ["agua", "comida", "bano"],
  "reportado_por": "Alcaldía",
  "notas": "Solo adultos"
}`}
        />

        {/* ── CENTROS ACOPIO VE ── */}
        <SectionHeading icon={Package}>
          Centros de acopio — Venezuela
        </SectionHeading>

        <EndpointCard
          id="ca-get"
          method="GET"
          path="/centros-acopio"
          description="Listar centros en Venezuela"
          params={[
            {
              name: 'estado_pais',
              type: 'string',
              description: 'Filtrar por estado/región (búsqueda parcial)',
            },
            {
              name: 'verificado',
              type: 'string',
              description: (
                <>
                  <InlineCode>true</InlineCode> o <InlineCode>false</InlineCode>
                </>
              ),
            },
            {
              name: 'limit',
              type: 'number',
              description: 'Número de resultados (máx. 500)',
              default: '100',
            },
            {
              name: 'offset',
              type: 'number',
              description: 'Para paginación',
              default: '0',
            },
          ]}
          responseCode={`{
  "data": [
    {
      "id": 125,
      "nombre": "Centro de Acopio Miranda",
      "direccion": "Av. Boyacá, Los Teques",
      "estado_pais": "Miranda",
      "lat": 10.3292,
      "lng": -67.0452,
      "reportado_por": null,
      "notas": null,
      "verificado": false,
      "creado_en": "2025-06-01T10:00:00Z"
    }
  ],
  "total": 121,
  "limit": 100,
  "offset": 0
}`}
          statuses={[200, 500]}
          exampleReq={`GET ${BASE_URL}/centros-acopio?estado_pais=miranda&limit=50`}
        />

        <EndpointCard
          id="ca-post"
          method="POST"
          path="/centros-acopio"
          description="Registrar centro en Venezuela"
          params={[
            { name: 'nombre', type: 'string', req: true, description: 'Nombre del centro' },
            { name: 'direccion', type: 'string', req: true, description: 'Dirección completa' },
            { name: 'estado_pais', type: 'string', req: true, description: 'Estado o región de Venezuela' },
            { name: 'lat', type: 'number', req: true, description: 'Latitud (no se geocodifica)' },
            { name: 'lng', type: 'number', req: true, description: 'Longitud (no se geocodifica)' },
            { name: 'reportado_por', type: 'string', description: 'Quién reporta' },
            { name: 'notas', type: 'string', description: 'Información adicional' },
          ]}
          note={
            <>
              Las coordenadas son obligatorias. A diferencia del endpoint
              exterior, <strong>no hay geocodificación automática</strong>.
            </>
          }
          responseCode={`{
  "success": true,
  "data": { /* objeto del centro recién creado */ }
}`}
          statuses={[201, 400, 500]}
          exampleReq={`POST ${BASE_URL}/centros-acopio
Content-Type: application/json

{
  "nombre": "Acopio Petare",
  "direccion": "Calle Real de Petare, Local 12",
  "estado_pais": "Miranda",
  "lat": 10.4698,
  "lng": -66.8001,
  "reportado_por": "Voluntarios Unidos",
  "notas": "Ropa y medicamentos"
}`}
        />

        {/* ── CENTROS ACOPIO EXTERIOR ── */}
        <SectionHeading icon={Globe}>
          Centros de acopio — Exterior
        </SectionHeading>

        <EndpointCard
          id="cae-get"
          method="GET"
          path="/centros-acopio-exterior"
          description="Listar centros fuera de Venezuela"
          params={[
            { name: 'pais', type: 'string', description: 'Filtrar por país (búsqueda parcial)' },
            { name: 'ciudad', type: 'string', description: 'Filtrar por ciudad (búsqueda parcial)' },
            {
              name: 'verificado',
              type: 'string',
              description: (
                <>
                  <InlineCode>true</InlineCode> o <InlineCode>false</InlineCode>
                </>
              ),
            },
            {
              name: 'limit',
              type: 'number',
              description: 'Número de resultados (máx. 500)',
              default: '100',
            },
            {
              name: 'offset',
              type: 'number',
              description: 'Para paginación',
              default: '0',
            },
          ]}
          responseCode={`{
  "data": [
    {
      "id": 40,
      "nombre": "Casa Venezuela Bogotá",
      "direccion": "Cra. 7 #45-20",
      "ciudad": "Bogotá",
      "pais": "Colombia",
      "que_donar": "Ropa, alimentos no perecederos",
      "lat": 4.711,
      "lng": -74.0721,
      "reportado_por": "Diáspora VE",
      "notas": null,
      "verificado": true,
      "creado_en": "2025-05-20T08:00:00Z"
    }
  ],
  "total": 68,
  "limit": 100,
  "offset": 0
}`}
          statuses={[200, 500]}
          exampleReq={`GET ${BASE_URL}/centros-acopio-exterior?pais=colombia&ciudad=bogota`}
        />

        <EndpointCard
          id="cae-post"
          method="POST"
          path="/centros-acopio-exterior"
          description="Registrar centro en el exterior"
          params={[
            { name: 'nombre', type: 'string', req: true, description: 'Nombre del centro' },
            { name: 'direccion', type: 'string', req: true, description: 'Dirección completa' },
            { name: 'ciudad', type: 'string', req: true, description: 'Ciudad donde se encuentra' },
            { name: 'pais', type: 'string', req: true, description: 'País donde se encuentra' },
            { name: 'que_donar', type: 'string', description: 'Qué tipo de donaciones aceptan' },
            { name: 'lat', type: 'number', description: 'Latitud (se geocodifica si se omite)' },
            { name: 'lng', type: 'number', description: 'Longitud (se geocodifica si se omite)' },
            { name: 'reportado_por', type: 'string', description: 'Quién reporta' },
            { name: 'notas', type: 'string', description: 'Información adicional' },
          ]}
          note={
            <>
              Si no se envían coordenadas, se geocodifica automáticamente vía
              Nominatim (OpenStreetMap) usando <InlineCode>ciudad</InlineCode> +{' '}
              <InlineCode>pais</InlineCode>. Si la geocodificación falla, el
              registro se guarda con coordenadas nulas.
            </>
          }
          responseCode={`{
  "success": true,
  "data": { /* objeto del centro recién creado */ }
}`}
          statuses={[201, 400, 500]}
          exampleReq={`POST ${BASE_URL}/centros-acopio-exterior
Content-Type: application/json

{
  "nombre": "Ayuda Venezuela Madrid",
  "direccion": "Calle Gran Vía 40, Local 3",
  "ciudad": "Madrid",
  "pais": "España",
  "que_donar": "Medicamentos y ropa de abrigo",
  "reportado_por": "Comunidad VE Madrid"
}`}
        />

        {/* ── ERRORS ── */}
        <div id="errors" className="mt-10 pt-8 border-t border-white/10">
          <SectionHeading icon={AlertCircle}>Códigos de error</SectionHeading>
          <div className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-[10px] uppercase tracking-widest text-white/30 font-semibold px-4 py-2.5">
                    Código
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-white/30 font-semibold px-4 py-2.5">
                    Cuándo ocurre
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-white/30 font-semibold px-4 py-2.5 hidden sm:table-cell">
                    Respuesta
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3">
                    <StatusBadge code={400} />
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    Faltan campos obligatorios o los valores enviados no son
                    válidos
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <InlineCode>
                      {'{ "error": "Faltan campos obligatorios: nombre, dirección." }'}
                    </InlineCode>
                  </td>
                </tr>
                <tr className="border-t border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3">
                    <StatusBadge code={500} />
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    Error de base de datos o fallo interno del servidor
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <InlineCode>
                      {'{ "error": "Error interno del servidor." }'}
                    </InlineCode>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/8 flex items-center gap-2 text-[12px] text-white/25">
          <Terminal size={13} />
          <span>
            RefugioVE — Todos los registros se crean con{' '}
            <InlineCode>verificado: false</InlineCode>. La verificación la
            gestiona el equipo de administración.
          </span>
        </footer>
      </main>
    </div>
  );
}
