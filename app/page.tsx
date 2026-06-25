import Link from 'next/link';
import { MapPin, Hospital, ArrowRight, Search, Phone, Share2, FileText, CheckCircle, Megaphone, Info, Package } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white py-12 px-4 md:py-20 pb-24 md:pb-16 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col gap-16">
        
        {/* Hero & Navigation Grid */}
        <section className="text-center max-w-xl mx-auto w-full">
          <div className="text-5xl mb-4">🇻🇪</div>
          <h1 className="text-white font-extrabold text-3xl md:text-4xl tracking-tight mb-3">
            RefugioVE
          </h1>
          <p className="text-white/70 text-base leading-relaxed mb-2">
            Coordinación ciudadana en respuesta al terremoto en Venezuela.
          </p>
          <p className="text-white/40 text-xs tracking-wider uppercase mb-10 font-semibold">
            Sismo del 24 de junio, 2026
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Card 1: Refugios */}
            <Link
              href="/mapa"
              className="group bg-[#1e293b] border border-white/10 hover:border-[#DC143C]/50 rounded-2xl p-5 transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between"
            >
              <div>
                <MapPin size={24} className="text-emerald-400 mb-3" />
                <h2 className="text-white font-bold text-lg mb-1">Mapa de Refugios</h2>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                  Ver y reportar albergues y puntos de evacuación activos cerca de ti.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#DC143C] text-xs md:text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                Ver mapa <ArrowRight size={14} />
              </div>
            </Link>

            {/* Card 2: Pacientes */}
            <Link
              href="/pacientes"
              className="group bg-[#1e293b] border border-white/10 hover:border-[#DC143C]/50 rounded-2xl p-5 transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between"
            >
              <div>
                <Hospital size={24} className="text-blue-400 mb-3" />
                <h2 className="text-white font-bold text-lg mb-1">Pacientes en Hospitales</h2>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                  Para que enfermeros y médicos registren personas ingresadas en centros de salud.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#DC143C] text-xs md:text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                Ingresos y reportes <ArrowRight size={14} />
              </div>
            </Link>


            {/* Card 3: Buscar Personas */}
            <Link
              href="/buscar-personas"
              className="group bg-[#1e293b] border border-white/10 hover:border-[#DC143C]/50 rounded-2xl p-5 transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between"
            >
              <div>
                <Search size={24} className="text-indigo-400 mb-3" />
                <h2 className="text-white font-bold text-lg mb-1">Buscar personas</h2>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                  Registra búsquedas de familiares no localizados o reporta noticias.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#DC143C] text-xs md:text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                Buscar personas <ArrowRight size={14} />
              </div>
            </Link>

            {/* Card 4: Centros de Acopio */}
            <Link
              href="/centros-acopio"
              className="group bg-[#1e293b] border border-white/10 hover:border-[#f1c40f]/50 rounded-2xl p-5 transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between"
            >
              <div>
                <Package size={24} className="text-[#f1c40f] mb-3" />
                <h2 className="text-white font-bold text-lg mb-1">Centros de Acopio</h2>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                  Puntos habilitados para recibir y distribuir ayuda. Repórtalo si conoces uno.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#f1c40f] text-xs md:text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                Ver centros <ArrowRight size={14} />
              </div>
            </Link>

            {/* Card 5: Emergencias */}
            <Link
              href="/emergencias"
              className="group bg-[#1e293b] border border-white/10 hover:border-[#DC143C]/50 rounded-2xl p-5 transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between"
            >
              <div>
                <Phone size={24} className="text-[#DC143C] mb-3" />
                <h2 className="text-white font-bold text-lg mb-1">Líneas de Emergencia</h2>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                  Números de Protección Civil, bomberos, operadoras y radio AM.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[#DC143C] text-xs md:text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                Ver líneas <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </section>

        {/* Section: Sobre RefugioVE */}
        <section className="border-t border-white/10 pt-10">
          <div className="flex items-center gap-2 mb-6">
            <Info className="text-[#DC143C]" size={22} />
            <h2 className="text-2xl font-black tracking-tight text-white">Sobre RefugioVE</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Col: Description & How it works */}
            <div className="space-y-6">
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                RefugioVE nació horas después del terremoto del 24 de junio de 2026 como respuesta a una necesidad concreta: miles de personas necesitaban encontrar un lugar seguro, localizar a un familiar o simplemente saber a quién llamar, y no había un lugar único donde buscar esa información. La plataforma es de uso libre, funciona en cualquier teléfono con internet y se actualiza en tiempo real gracias a los reportes de la propia comunidad.
              </p>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Cómo funciona
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  No hay una organización detrás verificando cada dato. Funciona igual que funcionan las comunidades en una crisis: alguien sabe algo, lo publica, y esa información llega a quien la necesita. Por eso pedimos no publicar información falsa — cada reporte erróneo puede desviar recursos que alguien más necesita.
                </p>
              </div>

              {/* Visual Emphasis Box */}
              <div className="border-l-4 border-[#DC143C] bg-white/5 p-4 rounded-r-xl">
                <p className="text-white text-sm font-semibold leading-relaxed">
                  Si un refugio ya está lleno, márcalo. Si una persona ya fue localizada, actualízalo. Mantener el mapa limpio salva vidas.
                </p>
              </div>
            </div>

            {/* Right Col: What you can do here */}
            <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-5">
                  Qué puedes hacer aquí
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      <span className="font-bold text-white">Encontrar un refugio cercano</span> — mapa interactivo con albergues reportados por ciudadanos, con información de capacidad, servicios disponibles y estado actual.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Megaphone className="text-sky-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      <span className="font-bold text-white">Reportar un refugio</span> — si conoces un punto habilitado para recibir familias, publícalo en segundos para que otros lo encuentren.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Search className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      <span className="font-bold text-white">Buscar a alguien</span> — si no tienes noticias de un familiar o conocido, publica su nombre y la comunidad te ayuda a localizarlo.
                    </p>
                  </li>
                   <li className="flex items-start gap-3">
                    <Hospital className="text-blue-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      <span className="font-bold text-white">Registrar pacientes</span> — canal para que médicos y enfermeros reporten ingresos en hospitales y faciliten la localización a familiares.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Package className="text-[#f1c40f] shrink-0 mt-0.5" size={18} />
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      <span className="font-bold text-white">Centros de acopio</span> — puntos habilitados para recibir y distribuir ayuda. Si conoces uno, publícalo en segundos para que más personas puedan acceder.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="text-[#DC143C] shrink-0 mt-0.5" size={18} />
                    <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                      <span className="font-bold text-white">Llamar directamente</span> — todos los números de emergencia, ambulancias y bomberos de Venezuela en un solo lugar, tappables desde el teléfono.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Cómo ayudar */}
        <section className="border-t border-white/10 pt-10">
          <div className="text-center md:text-left mb-6">
            <span className="text-xs uppercase tracking-wider text-[#DC143C] font-extrabold">Formas de contribuir</span>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">Cómo ayudar</h2>
            <p className="text-white/70 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              No tienes que estar en Venezuela para ayudar. Hay cosas concretas que puedes hacer desde donde estés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Difunde el mapa */}
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="text-sky-400" size={18} />
                  <h3 className="font-bold text-white text-base">Difunde el mapa</h3>
                </div>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  Comparte este sitio con venezolanos en tu red, especialmente con quienes tienen familiares en las zonas afectadas. La información llega donde llegue la gente.
                </p>
              </div>
              <div className="mt-5">
                <a
                  href="https://twitter.com/intent/tweet?text=RefugioVE%20-%20Mapa%20de%20refugios%20y%20pacientes%20afectados%20por%20el%20terremoto%20en%20Venezuela%202026&url=https%3A%2F%2Frefugiove.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 py-2 rounded-lg text-xs font-bold transition-all active:translate-y-px"
                >
                  Compartir en X →
                </a>
              </div>
            </div>

            {/* Card 2: Reporta lo que sabes */}
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="text-amber-400" size={18} />
                  <h3 className="font-bold text-white text-base">Reporta lo que sabes</h3>
                </div>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  Si tienes información sobre un edificio colapsado o una persona desaparecida, cada reporte ayuda a coordinar la respuesta. No necesitas estar seguro de todo.
                </p>
              </div>
              <div className="mt-5">
                <a
                  href="https://ee.kobotoolbox.org/x/eaEmQ9YW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 rounded-lg text-xs font-bold transition-all active:translate-y-px"
                >
                  Ir al formulario →
                </a>
              </div>
            </div>

            {/* Card 3: Verifica información */}
            <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="text-emerald-400" size={18} />
                  <h3 className="font-bold text-white text-base">Verifica información</h3>
                </div>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  Si puedes confirmar o corregir un reporte existente, escríbenos. La verificación cruzada hace el mapa más útil para los equipos de rescate.
                </p>
              </div>
              <div className="mt-5">
                <a
                  href="mailto:refugiove.app@outlook.com"
                  className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2 rounded-lg text-xs font-bold transition-all active:translate-y-px"
                >
                  Escribirnos →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <footer className="text-center md:text-left border-t border-white/10 pt-6 text-[10px] text-white/30 leading-relaxed max-w-xl mx-auto md:mx-0">
          <p>
            Datos aportados por la ciudadanía. No afiliados al gobierno venezolano ni a ningún partido político. Este sitio no tiene fines comerciales. El código es libre. Los datos son de quien los aporta.
          </p>
        </footer>

      </div>
    </main>
  );
}
