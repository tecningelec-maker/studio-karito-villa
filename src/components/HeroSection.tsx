import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, Calendar, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab } = useSalon();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF0F4] via-[#FCE5ED] to-[#FADCE6] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#F3C5D6]">
      {/* Subtle pastel rose & champagne ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F8BDD2]/45 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#F9E7B2]/45 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-[#F3C5D6] shadow-xl p-6 sm:p-8 lg:p-10 text-left">
            {/* Background studio image */}
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-16_at_21.45.04__1__583959d2.jpeg"
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Balanced translucent pastel blush scrim for legibility while keeping the background clearly visible */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-[#FDF0F4]/82 via-[#FCE6EE]/72 to-[#FADCE6]/58 backdrop-blur-[1px]"
            />

            <div className="relative z-10 space-y-6">
              <p className="text-xs font-bold text-[#8A2E52] tracking-widest uppercase">
                Nail Art & Spa de Alta Gama · El Poblado, Medellín
              </p>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#2E1621] leading-[1.1] max-w-2xl [text-wrap:balance]">
                El arte de elevar tus manos a su <span className="italic text-[#9E7114] font-serif font-normal">máxima expresión</span>
              </h1>

              <p className="text-base sm:text-lg text-[#3D1D2B] leading-relaxed max-w-xl font-normal">
                Bienvenida a <strong>Karito Villa (Estudio)</strong>. Perfeccionamos cada detalle con la técnica de manicura rusa combinada, esculpido escultural, spa botánico y nail art editorial. Reserva tu turno en tiempo real con abono digital garantizado.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setActiveTab('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] via-[#BD9221] to-[#A67D1C] rounded-lg shadow-md hover:shadow-lg hover:from-[#B68B1F] hover:to-[#966F14] transition-all cursor-pointer active:scale-98 whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Cita en Línea</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#4A2233] bg-[#FFF7FA]/95 border border-[#EBB8CB] rounded-lg hover:bg-[#FCE4EC] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <span>Ver Catálogo & Precios</span>
                </button>
              </div>

              {/* Quick trust notes */}
              <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#4A2233] font-medium">
                <span className="font-bold text-[#2E1621]">Abonos desde $20.000 COP</span>
                <span aria-hidden="true">·</span>
                <span>Cancelación flexible hasta 24h</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8E6310] font-bold">Club VIP con Puntos</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Salon Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-[#F3C5D6] bg-[#FFF7FA]">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-16_at_21.45.04_1734f18c.jpeg"
                alt="Karito Villa Estudio interior real"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[460px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
              {/* Subtle blush glass badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#FDF0F4]/92 backdrop-blur-md p-4 rounded-xl border border-[#F3C5D6] flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9E7114] font-semibold">
                    Experiencia Karito Villa
                  </p>
                  <p className="text-sm font-semibold text-[#2E1621]">
                    Atención personalizada 1 a 1
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#6E4557] block">Calificación</span>
                  <span className="text-sm font-bold text-[#B88918] tabular-nums">4.9 / 5.0 ★</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Guarantee Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#F0BDD0]">
          <div className="space-y-1.5 text-left bg-[#FFF7FA]/75 p-4 rounded-xl border border-[#F3C5D6]/80">
            <div className="flex items-center gap-2 text-[#B88918]">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span className="font-serif font-bold text-base sm:text-lg text-[#2E1621] tabular-nums">100% Grado Médico</span>
            </div>
            <p className="text-xs text-[#6E4557] leading-relaxed">
              Esterilización hospitalaria en autoclave de calor húmedo para cada instrumental.
            </p>
          </div>

          <div className="space-y-1.5 text-left bg-[#FFF7FA]/75 p-4 rounded-xl border border-[#F3C5D6]/80">
            <div className="flex items-center gap-2 text-[#B88918]">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span className="font-serif font-bold text-base sm:text-lg text-[#2E1621] tabular-nums">Técnica Rusa Pura</span>
            </div>
            <p className="text-xs text-[#6E4557] leading-relaxed">
              Cutículas limpias con fresas de diamante y nivelación de estructura sin grosor tosco.
            </p>
          </div>

          <div className="space-y-1.5 text-left bg-[#FFF7FA]/75 p-4 rounded-xl border border-[#F3C5D6]/80">
            <div className="flex items-center gap-2 text-[#B88918]">
              <HeartHandshake className="w-5 h-5 shrink-0" />
              <span className="font-serif font-bold text-base sm:text-lg text-[#2E1621] tabular-nums">Abono Protegido</span>
            </div>
            <p className="text-xs text-[#6E4557] leading-relaxed">
              Pasarela de abono 100% segura con recibo inmediato por WhatsApp y correo.
            </p>
          </div>

          <div className="space-y-1.5 text-left bg-[#FFF7FA]/75 p-4 rounded-xl border border-[#F3C5D6]/80">
            <div className="flex items-center gap-2 text-[#B88918]">
              <Award className="w-5 h-5 shrink-0" />
              <span className="font-serif font-bold text-base sm:text-lg text-[#2E1621] tabular-nums">Club Lealtad VIP</span>
            </div>
            <p className="text-xs text-[#6E4557] leading-relaxed">
              Acumula puntos en cada visita y canjea descuentos y servicios gratuitos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
