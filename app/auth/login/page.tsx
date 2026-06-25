'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } else {
      router.push('/admin');
      router.refresh();
    }
    setLoading(false);
  }

  const inputClass =
    'w-full bg-[#0f172a] border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#DC143C] placeholder-white/30';

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#0f172a] flex items-center justify-center px-4">
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <div className="bg-[#DC143C]/10 p-3 rounded-xl">
            <Lock size={24} className="text-[#DC143C]" />
          </div>
        </div>
        <h1 className="text-white font-bold text-xl text-center mb-6">Acceso administrador</h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 text-sm px-3 py-2 rounded-lg mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1">
              Correo electronico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="admin@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DC143C] hover:bg-[#b01030] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}
