import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, Calendar, Award, Search, LayoutDashboard, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'Servicios', icon: Sparkles },
    { id: 'booking', label: 'Agendar Cita', icon: Calendar },
    { id: 'loyalty', label: 'Puntos VIP', icon: Award },
    { id: 'lookup', label: 'Mi Reserva', icon: Search },
    { id: 'admin', label: 'Gestión Agenda', icon: LayoutDashboard },
  ] as const;

  const handleNavClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFB]/95 backdrop-blur-md border-b border-[#F7E5EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-wide text-[#271A22] block whitespace-nowrap">
            Karito Villa <span className="text-[#C59B27] font-serif font-light text-xl italic">(Estudio)</span>
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#A67D1C] font-medium block">
            Nail Art & Spa de Alta Gama
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A4552]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#C59B27] cursor-pointer py-1 ${
                  isActive
                    ? 'text-[#C59B27] font-semibold border-b-2 border-[#C59B27]'
                    : 'text-[#5A4552]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('booking')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#B3871E] rounded-md hover:from-[#B58A1C] hover:to-[#9F7414] shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-98"
          >
            Reservar Cita
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#5A4552] hover:text-[#271A22] hover:bg-[#FDF2F4] transition-colors focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#F7E5EC] bg-[#FFFDFB] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FDF2F4] text-[#C59B27] font-semibold'
                    : 'text-[#5A4552] hover:bg-[#FBF6F8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C59B27]' : 'text-[#8E7583]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('booking')}
              className="w-full py-3 text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-lg shadow-sm"
            >
              Reservar Cita Ahora
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
