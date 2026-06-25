'use client';

import { Phone, Radio, Globe, ShieldAlert, Smartphone, Activity, Flame, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EmergenciasPage() {
  const handleShare = async () => {
    const shareData = {
      title: 'Números de emergencia Venezuela — Terremoto 2026',
      text: 'Líneas de emergencia para coordinar asistencia tras el sismo en Venezuela.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Página compartida con éxito.');
      } catch (err) {
        // Ignore abort errors
        if ((err as Error).name !== 'AbortError') {
          toast.error('No se pudo compartir de forma automática.');
        }
      }
    } else {
      // Fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Enlace de la página copiado al portapapeles.');
      } catch (err) {
        toast.error('No se pudo copiar el enlace al portapapeles.');
      }
    }
  };

  const emergencies = [
    { name: 'Protección Civil Nacional', number: '0800-248-4825', tel: 'tel:08002484825' },
    { name: 'Defensa Civil', number: '0212-483.35.11', tel: 'tel:02124833511' },
    { name: 'Cruz Roja Venezolana', number: '0212-606.06.06', tel: 'tel:02126060606' },
    { name: 'Cuerpo de Bomberos Nacional', number: '0212-545.45.45', tel: 'tel:02125454545' },
    { name: 'CICPC (desaparecidos)', number: '0800-248-2272', tel: 'tel:08002482272' },
  ];

  const carriers = [
    { name: 'Movilnet', number: '*1', tel: 'tel:*1' },
    { name: 'Digitel', number: '112', tel: 'tel:112' },
    { name: 'Movistar', number: '911', tel: 'tel:911' },
    { name: 'Cantv (fijo)', number: '171', tel: 'tel:171' },
  ];

  const ambulances = [
    { name: 'Aeroambulancias (Opción 1)', number: '(0212) 993.25.41', tel: 'tel:02129932541' },
    { name: 'Aeroambulancias (Opción 2)', number: '(0212) 992.89.80', tel: 'tel:02129928980' },
    { name: 'Rescarven (Opción 1)', number: '(0212) 993.69.11', tel: 'tel:02129936911' },
    { name: 'Rescarven (Opción 2)', number: '(0212) 993.69.91', tel: 'tel:02129936991' },
    { name: 'SAM Metropolitano (Opción 1)', number: '(0212) 545.45.45', tel: 'tel:02125454545' },
    { name: 'SAM Metropolitano (Opción 2)', number: '(0212) 577.92.09', tel: 'tel:02125779209' },
  ];

  const firefighters = [
    { name: 'Bomberos Chacao', number: '(0212) 265.32.61', tel: 'tel:02122653261' },
    { name: 'Bomberos Sucre', number: '(0212) 985.36.40', tel: 'tel:02129853640' },
    { name: 'Bomberos El Valle', number: '(0212) 672.01.75', tel: 'tel:02126720175' },
    { name: 'Bomberos La Guaira', number: '(0212) 332.76.20', tel: 'tel:02123327620' },
    { name: 'Bomberos San Bernardino', number: '(0212) 577.92.09', tel: 'tel:02125779209' },
    { name: 'Bomberos Plaza Venezuela', number: '(0212) 793.00.39', tel: 'tel:02127930039' },
    { name: 'Bomberos El Paraíso', number: '(0212) 481.09.61', tel: 'tel:02124810961' },
    { name: 'Bomberos Miranda', number: '(0212) 235.69.67', tel: 'tel:02122356967' },
  ];

  const radios = [
    { name: 'Radio Nacional de Venezuela', frequency: '630 AM' },
    { name: 'YVKE Mundial', frequency: '550 AM' },
    { name: 'Radio Caracas Radio', frequency: '750 AM' },
  ];

  const verifiedAccounts = [
    { name: '@FunvisisVenezuela', label: 'Funvisis — sismos y réplicas en tiempo real', url: 'https://x.com/FUNVISIS' },
    { name: '@PCivil_Vzla', label: 'Protección Civil nacional', url: 'https://x.com/PCivil_Ve' },
    { name: '@CruzRojaVzla', label: 'Cruz Roja Venezolana — operaciones humanitarias', url: 'https://x.com/CruzRojaVzla' },
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] text-white pb-20 md:pb-10">
      {/* Header */}
      <div className="bg-[#DC143C] px-4 py-6 md:py-8 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider mb-2 self-start transition-all">
            <ArrowLeft size={14} />
            Volver al inicio
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Líneas de Emergencia
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Toca cualquier número para llamar directamente.
          </p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-[#F5C518] text-black font-semibold px-4 py-3 sticky top-0 z-40 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5 text-xs md:text-sm">
          <span className="text-base shrink-0">⚠️</span>
          <p>
            Las redes móviles pueden estar saturadas. Si no logras llamar, espera 2 minutos e intenta de nuevo.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Emergencias generales */}
          <section className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <ShieldAlert className="text-[#DC143C]" size={20} />
              <h2 className="font-bold text-sm uppercase tracking-wider text-white/80">🚨 Emergencias generales</h2>
            </div>
            <div className="divide-y divide-white/5">
              {emergencies.map((item, idx) => (
                <a
                  key={idx}
                  href={item.tel}
                  className="flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs text-white/50">{item.name}</span>
                    <span className="font-mono text-base font-bold text-emerald-400 mt-0.5">{item.number}</span>
                  </div>
                  <Phone size={18} className="text-[#22c55e] shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* Card: Por operadora móvil */}
          <section className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <Smartphone className="text-blue-400" size={20} />
              <h2 className="font-bold text-sm uppercase tracking-wider text-white/80">📱 Por operadora móvil</h2>
            </div>
            <div className="divide-y divide-white/5">
              {carriers.map((item, idx) => (
                <a
                  key={idx}
                  href={item.tel}
                  className="flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs text-white/50">{item.name} (gratis)</span>
                    <span className="font-mono text-lg font-bold text-emerald-400 mt-0.5">{item.number}</span>
                  </div>
                  <Phone size={18} className="text-[#22c55e] shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* Card: Ambulancias Caracas */}
          <section className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <Activity className="text-emerald-400" size={20} />
              <h2 className="font-bold text-sm uppercase tracking-wider text-white/80">🏥 Ambulancias Caracas</h2>
            </div>
            <div className="divide-y divide-white/5">
              {ambulances.map((item, idx) => (
                <a
                  key={idx}
                  href={item.tel}
                  className="flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs text-white/50">{item.name}</span>
                    <span className="font-mono text-base font-bold text-emerald-400 mt-0.5">{item.number}</span>
                  </div>
                  <Phone size={18} className="text-[#22c55e] shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* Card: Bomberos por municipio */}
          <section className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <Flame className="text-amber-500" size={20} />
              <h2 className="font-bold text-sm uppercase tracking-wider text-white/80">🚒 Bomberos (Área Metropolitana)</h2>
            </div>
            <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto">
              {firefighters.map((item, idx) => (
                <a
                  key={idx}
                  href={item.tel}
                  className="flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs text-white/50">{item.name}</span>
                    <span className="font-mono text-base font-bold text-emerald-400 mt-0.5">{item.number}</span>
                  </div>
                  <Phone size={18} className="text-[#22c55e] shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* Card: Radio AM (si se cae internet) */}
          <section className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <Radio className="text-[#F5C518]" size={20} />
              <h2 className="font-bold text-sm uppercase tracking-wider text-white/80">📻 Radio AM (si no hay datos/internet)</h2>
            </div>
            <div className="divide-y divide-white/5">
              {radios.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-3 min-h-[56px]"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs text-white/50">{item.name}</span>
                    <span className="font-mono text-base font-bold text-white mt-0.5">{item.frequency}</span>
                  </div>
                  <Radio size={18} className="text-white/30 shrink-0" />
                </div>
              ))}
            </div>
          </section>

          {/* Card: Cuentas oficiales verificadas */}
          <section className="bg-[#1e293b] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <Globe className="text-sky-400" size={20} />
              <h2 className="font-bold text-sm uppercase tracking-wider text-white/80">🌐 Cuentas oficiales verificadas</h2>
            </div>
            <div className="divide-y divide-white/5">
              {verifiedAccounts.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col pr-4">
                    <span className="font-semibold text-sm text-[#3b82f6] hover:underline">
                      {item.name}
                    </span>
                    <span className="text-xs text-white/50 mt-0.5">{item.label}</span>
                  </div>
                  <Globe size={18} className="text-white/30 shrink-0" />
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Share Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 bg-[#DC143C] hover:bg-[#b01030] text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md w-full sm:w-auto"
          >
            <Share2 size={18} />
            Compartir esta página
          </button>
        </div>
      </div>
    </main>
  );
}
