import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, Calendar, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab } = useSalon();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDFB] via-[#FFF9FA] to-[#FFF5F8] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#F7E5EC]">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FCE7F3]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#FCF9EE]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDF2F4] border border-[#FAD3DF] rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="text-xs font-medium text-[#8F3D5B] tracking-wide">
                Estudio Especializado en El Poblado, Medellín
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#271A22] leading-[1.1] max-w-2xl">
              El arte de elevar tus manos a su <span className="italic text-[#C59B27] font-serif font-light">máxima expresión</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5A4552] leading-relaxed max-w-xl font-light">
              Bienvenida a <strong>Karito Villa (Estudio)</strong>. Perfeccionamos cada detalle con la técnica de manicura rusa combinada, esculpido escultural, spa botánico y nail art editorial. Reserva tu turno en tiempo real con abono digital garantizado.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setActiveTab('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] via-[#BD9221] to-[#A67D1C] rounded-md shadow-md hover:shadow-lg hover:from-[#B68B1F] hover:to-[#966F14] transition-all cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Cita en Línea</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#3D2B36] bg-white border border-[#EACBD9] rounded-md hover:bg-[#FDF2F4] transition-colors cursor-pointer"
              >
                <span>Ver Catálogo & Precios</span>
              </button>
            </div>

            {/* Quick trust notes without pill spam */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#725D6B]">
              <span className="font-medium text-[#271A22]">Abonos desde $20.000 COP</span>
              <span aria-hidden="true">·</span>
              <span>Cancelación flexible hasta 24h</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#A67D1C] font-semibold">Club VIP con Puntos</span>
            </div>
          </div>

          {/* Right Column: High-End Salon Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-[#FAD3DF]/60 bg-white">
              <img
                src="/src/assets/images/hero_karito_villa_studio_1794503670921.jpg"
                alt="Karito Villa Estudio interior luxury nail salon"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[460px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle glass badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDFB]/90 backdrop-blur-md p-4 rounded-xl border border-[#F4CEDF]/60 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#A67D1C] font-semibold">
                    Experiencia Karito Villa
                  </p>
                  <p className="text-sm font-semibold text-[#271A22]">
                    Atención personalizada 1 a 1
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#725D6B] block">Calificación</span>
                  <span className="text-sm font-bold text-[#C59B27] tabular-nums">4.9 / 5.0 ★</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Guarantee Strip (Strictly below the split) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#F7E5EC]">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-[#C59B27]">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-serif font-bold text-lg text-[#271A22] tabular-nums">100% Grado Médico</span>
            </div>
            <p className="text-xs text-[#725D6B] leading-relaxed">
              Esterilización hospitalaria en autoclave de calor húmedo para cada instrumental.
            </p>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-[#C59B27]">
              <Sparkles className="w-5 h-5" />
              <span className="font-serif font-bold text-lg text-[#271A22] tabular-nums">Técnica Rusa Pura</span>
            </div>
            <p className="text-xs text-[#725D6B] leading-relaxed">
              Cutículas limpias con fresas de diamante y nivelación de estructura sin grosor tosco.
            </p>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-[#C59B27]">
              <HeartHandshake className="w-5 h-5" />
              <span className="font-serif font-bold text-lg text-[#271A22] tabular-nums">Abono Protegido</span>
            </div>
            <p className="text-xs text-[#725D6B] leading-relaxed">
              Pasarela de abono 100% segura con recibo inmediato por WhatsApp y correo.
            </p>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-[#C59B27]">
              <Award className="w-5 h-5" />
              <span className="font-serif font-bold text-lg text-[#271A22] tabular-nums">Club Lealtad VIP</span>
            </div>
            <p className="text-xs text-[#725D6B] leading-relaxed">
              Acumula puntos en cada visita y canjea descuentos y servicios gratuitos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
