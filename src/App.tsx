import React from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServiceCatalog } from './components/ServiceCatalog';
import { BookingWizard } from './components/BookingWizard';
import { LoyaltyProgramView } from './components/LoyaltyProgramView';
import { ClientReservationLookup } from './components/ClientReservationLookup';
import { AdminAgendaDashboard } from './components/AdminAgendaDashboard';
import { GalleryShowcase } from './components/GalleryShowcase';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { Footer } from './components/Footer';
import { Sparkles, Calendar, Award, Star, CheckCircle2, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, toast } = useSalon();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-[#271A22]">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-medium border ${
              toast.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : toast.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-[#FCF9EE] text-[#845F16] border-[#F3DF9A]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Header />

      {/* Main Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <ServiceCatalog />
            <GalleryShowcase />

            {/* Client Testimonials Section */}
            <section className="py-16 bg-[#FFF9FA] border-t border-[#F7E5EC]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
                    Testimonios Reales
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#271A22]">
                    La experiencia contada por nuestras clientas
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-[#FAD3DF] shadow-xs space-y-3">
                    <div className="flex text-[#C59B27]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[#5A4552] italic leading-relaxed">
                      "La manicura rusa de Karito Villa es inigualable. Mis uñas duran 4 semanas intactas sin un solo levantamiento. Además poder apartar el turno con el abono en Nequi y recibir todo por WhatsApp hace que sea súper organizado."
                    </p>
                    <div className="pt-2 border-t border-[#FBF0F4] text-xs">
                      <strong className="text-[#271A22] block font-semibold">María Camila Gómez</strong>
                      <span className="text-[11px] text-[#A67D1C]">Clienta VIP Oro Rosa (7 visitas)</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#FAD3DF] shadow-xs space-y-3">
                    <div className="flex text-[#C59B27]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[#5A4552] italic leading-relaxed">
                      "Tenía miedo de los esculpidos porque en otros lugares me debilitaban la uña natural. Aquí Valentina me hizo Soft Gel y fue una maravilla: liviano, delicado y con un nail art precioso con pan de oro."
                    </p>
                    <div className="pt-2 border-t border-[#FBF0F4] text-xs">
                      <strong className="text-[#271A22] block font-semibold">Laura Restrepo</strong>
                      <span className="text-[11px] text-[#A67D1C]">Clienta Nivel Rosa Pastel</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#FAD3DF] shadow-xs space-y-3">
                    <div className="flex text-[#C59B27]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[#5A4552] italic leading-relaxed">
                      "El ritual de pedicura spa en la tina dorada con pétalos de rosas y parafina caliente es el mejor descanso de la semana. Ya he canjeado 2 servicios gratis con los puntos del Club VIP."
                    </p>
                    <div className="pt-2 border-t border-[#FBF0F4] text-xs">
                      <strong className="text-[#271A22] block font-semibold">Daniela Salazar</strong>
                      <span className="text-[11px] text-[#A67D1C]">Miembro Diamante Karito (12 visitas)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="mt-12 text-center bg-gradient-to-r from-[#FFF5F8] via-[#FCF9EE] to-[#FFF5F8] p-8 rounded-3xl border border-[#FAD3DF] max-w-3xl mx-auto">
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#271A22]">
                    ¿Lista para vivir la experiencia Karito Villa?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#725D6B] mt-2 max-w-lg mx-auto">
                    Selecciona tu horario favorito en tiempo real. Abono seguro y confirmación inmediata en tu celular.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('booking');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-5 inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-xl shadow-sm hover:bg-[#B58A1C] transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reservar Mi Turno Ahora</span>
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'catalog' && <ServiceCatalog />}
        {activeTab === 'booking' && <BookingWizard />}
        {activeTab === 'loyalty' && <LoyaltyProgramView />}
        {activeTab === 'lookup' && <ClientReservationLookup />}
        {activeTab === 'admin' && <AdminAgendaDashboard />}
      </main>

      {/* Confirmation Modal */}
      <BookingConfirmationModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <MainContent />
    </SalonProvider>
  );
}
