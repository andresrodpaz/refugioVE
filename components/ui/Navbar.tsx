'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MapPin, Hospital, Search, Phone, Package, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const [refugiosCount, setRefugiosCount] = useState<number>(0);
  const [busquedasCount, setBusquedasCount] = useState<number>(0);

  const fetchCounts = async () => {
    const supabase = createClient();

    // Refugios count
    const { count: rCount } = await supabase
      .from('refugios')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'activo');
    setRefugiosCount(rCount ?? 0);

    // // Busquedas count
    // const { count: bCount } = await supabase
    //   .from('busquedas_personas')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('estado', 'buscando');
    // setBusquedasCount(bCount ?? 0);
  };

  useEffect(() => {
    fetchCounts();

    const supabase = createClient();
    const channel = supabase
      .channel('navbar-counts-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'refugios' },
        () => {
          fetchCounts();
        }
      )
      // .on(
      //   'postgres_changes',
      //   { event: '*', schema: 'public', table: 'busquedas_personas' },
      //   () => {
      //     fetchCounts();
      //   }
      // )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const desktopLinks = [
    { href: '/mapa', label: 'Refugios', icon: MapPin, badgeCount: 0 },
    // { href: '/buscar-personas', label: 'Buscar personas', icon: Search, badgeCount: busquedasCount },
    // { href: '/pacientes', label: 'Pacientes', icon: Hospital, badgeCount: 0 },
    { href: '/centros-acopio', label: 'Centros de Acopio', icon: Package, badgeCount: 0 },
    { href: '/ayuda-exterior', label: 'Ayuda Exterior', icon: Globe, badgeCount: 0 },
    // { href: '/emergencias', label: 'Emergencias', icon: Phone, badgeCount: 0 },
  ];

  // Mobile bottom bar keeps active items
  const mobileLinks = [
    { href: '/mapa', shortLabel: 'Refugios', icon: MapPin, badgeCount: 0 },
    // { href: '/buscar-personas', shortLabel: 'Buscar', icon: Search, badgeCount: busquedasCount },
    // { href: '/pacientes', shortLabel: 'Pacientes', icon: Hospital, badgeCount: 0 },
    { href: '/centros-acopio', shortLabel: 'Acopio', icon: Package, badgeCount: 0 },
    { href: '/ayuda-exterior', shortLabel: 'Exterior', icon: Globe, badgeCount: 0 },
    // { href: '/emergencias', shortLabel: 'Emergencias', icon: Phone, badgeCount: 0 },
  ];

  return (
    <>
      {/* Top Header - Branding for both, navigation for desktop */}
      <header className="bg-[#8B0000] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tight">
            <span>VE</span>
            <span>RefugioVE</span>
            {refugiosCount > 0 && (
              <span className="bg-[#22c55e] text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full ml-1 shrink-0">
                {refugiosCount} activos
              </span>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {desktopLinks.map(({ href, label, icon: Icon, badgeCount }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {badgeCount > 0 && (
                    <span className="bg-[#22c55e] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Fixed Bottom Navigation Bar - Mobile viewports only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#8B0000] border-t border-white/10 shadow-2xl md:hidden h-16">
        <div className="grid grid-cols-3 h-full max-w-md mx-auto">
          {mobileLinks.map(({ href, shortLabel, icon: Icon, badgeCount }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive ? 'text-white bg-white/10' : 'text-white/60 active:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon size={20} className={isActive ? 'scale-105' : ''} />
                  {badgeCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-green-500 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-[#8B0000] shadow-sm">
                      {badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium tracking-tight">
                  {shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
