import React from 'react';
import { useSalon } from '../context/SalonContext';
import { MapPin, Phone, Clock, Instagram, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useSalon();

  return (
    <footer className="bg-[#1E141A] text-white/90 pt-16 pb-12 border-t border-[#33222B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="font-editorial text-2xl font-semibold tracking-wide text-white block">
              Karito Villa <span className="text-[#C59B27] font-serif font-light text-xl italic">(Estudio)</span>
            </span>
            <p className="text-xs text-[#BFAEB8] leading-relaxed font-light">
              Estudio de alta gama especializado en manicura rusa combinada, sistemas esculturales, nail art editorial y rituales de spa. Transformamos cada detalle con precisión médica y elegancia artística.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#C59B27]">
              <ShieldCheck className="w-4 h-4" />
              <span>Autoclave Médico Grado B Certificado</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E7C970]">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs text-[#BFAEB8]">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Catálogo de Servicios & Precios
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Agendar Cita en Línea
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('loyalty');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Club VIP de Puntos de Lealtad
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('lookup');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Consultar o Reagendar Mi Reserva
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#C59B27] transition-colors cursor-pointer font-medium"
                >
                  Panel de Agenda del Estudio
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E7C970]">
              Horarios de Atención
            </h4>
            <ul className="space-y-2 text-xs text-[#BFAEB8]">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Lunes a Sábado:</strong>
                  <span>8:00 AM – 7:00 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Domingos & Festivos:</strong>
                  <span>Atención exclusiva VIP con reserva</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E7C970]">
              Ubicación & Contacto
            </h4>
            <div className="space-y-2 text-xs text-[#BFAEB8]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <span>Cra. 43A #1 Sur-220, El Poblado, Medellín, Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
                <a
                  href="https://api.whatsapp.com/send?phone=573128945672"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#25D366] transition-colors"
                >
                  WhatsApp: +57 312 894 5672
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>@karitovilla.estudio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#33222B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7582]">
          <p>
            © {new Date().getFullYear()} Karito Villa (Estudio). Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Diseñado con pasión para manos excepcionales</span>
            <Heart className="w-3 h-3 text-[#E7728E] inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
