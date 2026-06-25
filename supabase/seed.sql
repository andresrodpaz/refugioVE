-- Schema
create table if not exists refugios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  direccion text not null,
  estado text not null default 'activo',
  capacidad_total int,
  capacidad_disponible int,
  lat float8 not null,
  lng float8 not null,
  contacto text,
  servicios text[] default '{}',
  reportado_por text,
  verificado boolean not null default false,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre_paciente text not null,
  cedula text,
  edad int,
  descripcion_fisica text,
  hospital_nombre text not null default 'No especificado',
  hospital_direccion text,
  hospital_lat float8,
  hospital_lng float8,
  condicion text not null default 'desconocido',
  contacto_familiar text,
  reportado_por text,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed: pacientes localizados en Hospital Perez Carreno, Caracas
insert into pacientes (nombre_paciente, cedula, hospital_nombre, hospital_direccion, hospital_lat, hospital_lng, condicion) values
  ('Yenni Marcano',    '18384289', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Manoela De Anzola','296723',   'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Gonzalo Leon',     '22916229', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Celiana Uijares',  '19739177', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Yonny Ortuno',     '5199652',  'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Ang Fernandez',    '25699054', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Plyandra Sojo',    '6904629',  'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Ebar Yegue',       '24058780', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Marcela Bernal',   '6049995',  'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Valeria Azocar',   '28544619', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Anabela Morillo',  '34588981', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Lesvia Morales',   '5965096',  'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Mendo Bueno',      '17158021', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Maria Montolla',   '25025734', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Narledi Rivero',   '36091784', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Jsabe Torres',     '4918019',  'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Duhar Lopez',      '12115323', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Yanel Acosta',     '31760907', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Meri Chavez',      '81462470', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable'),
  ('Eisabeth Chacon',  '27374286', 'Hospital Perez Carreno', 'Caracas, Venezuela', 10.4806, -66.9036, 'estable')
on conflict do nothing;

-- Function to handle updated_at updating automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table definition for busquedas_personas
CREATE TABLE IF NOT EXISTS busquedas_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_buscado TEXT NOT NULL,
  edad_aproximada INT,
  ciudad_ultima_vez TEXT NOT NULL,
  sector_barrio TEXT,
  descripcion TEXT,
  contacto_buscador TEXT NOT NULL,
  desde_donde_busca TEXT,
  estado TEXT DEFAULT 'buscando'
    CHECK (estado IN ('buscando', 'localizado_sano', 'localizado_herido', 'fallecido')),
  reportado_por TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE busquedas_personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lectura_publica_busquedas" ON busquedas_personas FOR SELECT USING (true);
CREATE POLICY "insercion_publica_busquedas" ON busquedas_personas FOR INSERT WITH CHECK (true);
-- Using a public update policy because visitors can mark people as located without authentication
CREATE POLICY "update_publico_busquedas" ON busquedas_personas FOR UPDATE USING (true) WITH CHECK (true);

-- Trigger to automatically maintain updated_at column
CREATE OR REPLACE TRIGGER busquedas_updated_at BEFORE UPDATE ON busquedas_personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Centros de Acopio table DDL
CREATE TABLE IF NOT EXISTS centros_acopio (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    estado_pais TEXT NOT NULL,
    lat NUMERIC(10,7) NOT NULL,
    lng NUMERIC(10,7) NOT NULL,
    reportado_por TEXT,
    verificado BOOLEAN DEFAULT false,
    notas TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- RLS policies for centros_acopio
ALTER TABLE centros_acopio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lectura_publica_centros" ON centros_acopio FOR SELECT USING (true);
CREATE POLICY "insercion_publica_centros" ON centros_acopio FOR INSERT WITH CHECK (true);

-- Seed data for centros_acopio
INSERT INTO centros_acopio (
    nombre,
    direccion,
    estado_pais,
    lat,
    lng,
    reportado_por,
    verificado,
    notas
)
VALUES
-- ARAGUA
(
    'Centro de Acopio CC La Capilla',
    'Av. 19 de Abril, Centro Comercial La Capilla, piso 1, local 21, Maracay',
    'Aragua',
    10.2530212,
    -67.6002579,
    'twitter:minmmei_',
    true,
    NULL
),
(
    'Centro de Acopio Las Delicias',
    'Paseo de la Libertad, Av. Las Delicias, frente al Centro Médico de Maracay',
    'Aragua',
    10.2826816,
    -67.5698179,
    'twitter:minmmei_',
    false,
    'Coordenadas aproximadas'
),
-- BOLÍVAR
(
    'Centro de Acopio Av. República',
    'Esquina de Banesco, Av. República, municipio Angostura del Orinoco, Ciudad Bolívar',
    'Bolívar',
    8.1241567,
    -63.5475494,
    'twitter:minmmei_',
    false,
    'Coordenadas aproximadas'
),
-- CARABOBO
(
    'Centro de Acopio El Viñedo',
    'Av. Monseñor Adams, El Viñedo, edificio Talislandia, mezzanina, Valencia',
    'Carabobo',
    10.2142709,
    -68.0126189,
    'twitter:minmmei_',
    false,
    'Coordenadas aproximadas'
),
-- DISTRITO CAPITAL
(
    'Centro de Acopio Terrazas del Club Hípico',
    'Terrazas del Club Hípico, Caracas',
    'Distrito Capital',
    10.4479797,
    -66.8738204,
    'twitter:minmmei_',
    true,
    NULL
),
-- LARA
(
    'Centro de Acopio Tatas Food',
    'Carrera 15 entre calles 13A y 13B, Barquisimeto',
    'Lara',
    10.0735800,
    -69.3227200,
    'twitter:minmmei_',
    false,
    'Coordenadas aproximadas'
),
-- MIRANDA
(
    'Centro de Acopio Altamira',
    '4ta avenida de Altamira, entre 9na y 10ma transversal, quinta El Bejucal, Caracas',
    'Miranda',
    10.4962129,
    -66.8488166,
    'twitter:minmmei_',
    false,
    'Coordenadas aproximadas'
),
-- MONAGAS
(
    'Centro de Acopio Maturín',
    'Calle 6, antigua Bermúdez, casa N.º 11, Maturín',
    'Monagas',
    9.7778869,
    -63.1315537,
    'twitter:minmmei_',
    false,
    'Coordenadas aproximadas'
),
-- TÁCHIRA
(
    'Centro de Acopio ULA Táchira',
    'Núcleo Táchira de la Universidad de Los Andes, San Cristóbal',
    'Táchira',
    7.7915894,
    -72.2132404,
    'twitter:minmmei_',
    true,
    NULL
),
-- ZULIA
(
    'Centro de Acopio UNT Zulia',
    'Sede regional Un Nuevo Tiempo, Av. 3F, Maracaibo',
    'Zulia',
    10.6815660,
    -71.6039025,
    'twitter:minmmei_',
    true,
    NULL
)
ON CONFLICT DO NOTHING;

-- Centros de Acopio Exterior table DDL
CREATE TABLE IF NOT EXISTS centros_acopio_exterior (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    pais TEXT NOT NULL,
    que_donar TEXT,
    lat NUMERIC(10,7),
    lng NUMERIC(10,7),
    reportado_por TEXT,
    verificado BOOLEAN DEFAULT false,
    notas TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- RLS policies for centros_acopio_exterior
ALTER TABLE centros_acopio_exterior ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lectura_publica_centros_exterior" ON centros_acopio_exterior FOR SELECT USING (true);
CREATE POLICY "insercion_publica_centros_exterior" ON centros_acopio_exterior FOR INSERT WITH CHECK (true);

-- Seed data for centros_acopio_exterior
INSERT INTO centros_acopio_exterior (
    nombre,
    direccion,
    ciudad,
    pais,
    que_donar,
    lat,
    lng,
    reportado_por,
    verificado,
    notas
)
VALUES
(
    'Asociación Venezolana en Madrid',
    'Calle de la Princesa 25',
    'Madrid',
    'España',
    'Medicinas, ropa de invierno, alimentos no perecederos',
    40.4285,
    -3.7147,
    'comunidad_madrid',
    true,
    'Abierto de 9am a 6pm'
),
(
    'Fundación Ayuda a Venezuela',
    '123 Brickell Ave',
    'Miami',
    'Estados Unidos',
    'Suministros médicos de primeros auxilios',
    25.7617,
    -80.1918,
    'venezolanos_miami',
    true,
    'Reciben donaciones los fines de semana'
)
ON CONFLICT DO NOTHING;
