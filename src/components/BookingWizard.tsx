import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { TIME_SLOTS } from '../data/initialData';
import { formatCOP, formatDateSpanish } from '../utils/formatters';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Award,
  Phone,
  User,
  Mail,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const {
    services,
    specialists,
    appointments,
    bookingDraft,
    updateBookingDraft,
    confirmBooking,
    getLoyaltyProfile,
    showToast,
  } = useSalon();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'nequi' | 'daviplata' | 'pse'>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 9012',
    name: 'VALENTINA RESTREPO',
    expiry: '11/28',
    cvv: '891',
  });
  const [phoneQuery, setPhoneQuery] = useState('');
  const [loyaltyLookupDone, setLoyaltyLookupDone] = useState(false);

  const selectedService = services.find((s) => s.id === bookingDraft.serviceId) || services[0];
  const selectedSpecialist = specialists.find((sp) => sp.id === bookingDraft.specialistId) || specialists[0];

  // Available dates (today + next 14 days)
  const today = new Date();
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return {
      isoString: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('es-CO', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('es-CO', { month: 'short' }),
    };
  });

  // Calculate busy slots for the selected specialist and date
  const bookedSlotsForDay = appointments
    .filter(
      (apt) =>
        apt.date === bookingDraft.date &&
        apt.specialistId === bookingDraft.specialistId &&
        apt.status !== 'cancelled'
    )
    .map((apt) => apt.timeSlot);

  // Client Loyalty Check
  const clientLoyalty = bookingDraft.clientPhone ? getLoyaltyProfile(bookingDraft.clientPhone) : null;

  const handlePhoneCheck = () => {
    if (!phoneQuery) return;
    updateBookingDraft({ clientPhone: phoneQuery });
    const profile = getLoyaltyProfile(phoneQuery);
    setLoyaltyLookupDone(true);
    if (profile) {
      updateBookingDraft({ clientName: profile.name, clientEmail: profile.email });
      showToast(`¡Bienvenida ${profile.name}! Tienes ${profile.points} puntos en tu Club VIP.`);
    } else {
      showToast('Número no registrado aún. ¡Recibirás 50 puntos de bienvenida con tu reserva!', 'info');
    }
  };

  const handleApplyLoyaltyDiscount = (points: number, discountCOP: number) => {
    if (bookingDraft.loyaltyPointsToRedeem === points) {
      // Remove
      updateBookingDraft({ loyaltyPointsToRedeem: 0, loyaltyDiscountCOP: 0 });
      showToast('Descuento de lealtad removido.');
    } else {
      updateBookingDraft({ loyaltyPointsToRedeem: points, loyaltyDiscountCOP: discountCOP });
      showToast(`¡Aplicado descuento de ${formatCOP(discountCOP)} usando ${points} puntos!`);
    }
  };

  const handleFinalPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingDraft.clientName || !bookingDraft.clientPhone || !bookingDraft.clientEmail) {
      showToast('Por favor completa tus datos de contacto.', 'error');
      setStep(3);
      return;
    }

    setIsProcessingPayment(true);

    // Simulate real gateway latency & confirmation
    setTimeout(() => {
      setIsProcessingPayment(false);
      confirmBooking(paymentMethod);
    }, 1800);
  };

  const finalTotal = Math.max(0, selectedService.price - bookingDraft.loyaltyDiscountCOP);
  const remainingInStudio = Math.max(0, finalTotal - selectedService.depositAmount);

  return (
    <section className="py-12 sm:py-16 bg-[#FFFDFB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Stepper Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-[#FCE7F3] -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C59B27] transition-all duration-300 -z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Servicio' },
              { num: 2, label: 'Especialista & Horario' },
              { num: 3, label: 'Tus Datos & VIP' },
              { num: 4, label: 'Abono Seguro' },
            ].map((s) => {
              const isPast = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center bg-[#FFFDFB] px-2 z-10">
                  <button
                    onClick={() => {
                      if (isPast) setStep(s.num as any);
                    }}
                    disabled={!isPast && !isCurrent}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#C59B27] text-white ring-4 ring-[#F8ECC5]'
                        : isPast
                        ? 'bg-[#271A22] text-white'
                        : 'bg-[#FDF2F4] text-[#A67D1C] border border-[#FAD3DF]'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </button>
                  <span
                    className={`text-[11px] mt-1 font-medium whitespace-nowrap ${
                      isCurrent ? 'text-[#271A22] font-semibold' : 'text-[#8E7583]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-[#F7E5EC] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">Paso 1 de 4</span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#271A22] mt-1">
                Elige el servicio para tu cita
              </h2>
              <p className="text-xs sm:text-sm text-[#725D6B]">
                Selecciona la técnica deseada para reservar tiempo en la agenda del estudio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
                const isSelected = bookingDraft.serviceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => updateBookingDraft({ serviceId: service.id })}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex gap-4 ${
                      isSelected
                        ? 'border-[#C59B27] bg-[#FFFDF7] shadow-md'
                        : 'border-[#F7E5EC] hover:border-[#FAD3DF] bg-white'
                    }`}
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-semibold text-[#271A22] truncate">
                          {service.name}
                        </h4>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#725D6B] line-clamp-2 mt-1">
                        {service.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#271A22] tabular-nums">
                          {formatCOP(service.price)}
                        </span>
                        <span className="text-[11px] text-[#A67D1C] font-medium">
                          Abono {formatCOP(service.depositAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-lg shadow-sm hover:bg-[#B58A1C] transition-all cursor-pointer"
              >
                <span>Continuar a Especialista & Horario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SPECIALIST, DATE & TIME */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-[#F7E5EC] p-6 sm:p-8 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">Paso 2 de 4</span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#271A22] mt-1">
                Selecciona tu Nail Artist & Fecha
              </h2>
              <p className="text-xs sm:text-sm text-[#725D6B]">
                Nuestras artistas atienden de forma exclusiva con reserva anticipada.
              </p>
            </div>

            {/* Specialist Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#271A22] mb-3">
                1. Selecciona a tu Profesional:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {specialists.map((sp) => {
                  const isSelected = bookingDraft.specialistId === sp.id;
                  return (
                    <div
                      key={sp.id}
                      onClick={() => updateBookingDraft({ specialistId: sp.id })}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C59B27] bg-[#FFFDF7] shadow-md ring-2 ring-[#F8ECC5]'
                          : 'border-[#F7E5EC] hover:border-[#FAD3DF] bg-white'
                      }`}
                    >
                      <img
                        src={sp.avatar}
                        alt={sp.name}
                        className="w-16 h-16 rounded-full mx-auto object-cover mb-2 border-2 border-white shadow-xs"
                      />
                      <h4 className="text-sm font-bold text-[#271A22]">{sp.name}</h4>
                      <p className="text-[11px] text-[#C59B27] font-medium">{sp.role}</p>
                      <div className="mt-1 text-[11px] text-[#725D6B]">
                        ★ {sp.rating} ({sp.reviewsCount} reseñas)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Carousel/Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#271A22] mb-3">
                2. Selecciona la Fecha:
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {availableDates.map((d) => {
                  const isSelected = bookingDraft.date === d.isoString;
                  return (
                    <button
                      key={d.isoString}
                      onClick={() => updateBookingDraft({ date: d.isoString })}
                      className={`flex-shrink-0 w-18 py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C59B27] bg-[#C59B27] text-white shadow-sm'
                          : 'border-[#F7E5EC] bg-[#FFF9FA] text-[#5A4552] hover:border-[#FAD3DF]'
                      }`}
                    >
                      <span className="text-[11px] uppercase block tracking-wider font-medium opacity-80">
                        {d.dayName}
                      </span>
                      <span className="text-lg font-bold block tabular-nums">
                        {d.dayNumber}
                      </span>
                      <span className="text-[10px] uppercase block opacity-80">
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#271A22]">
                  3. Turnos Disponibles para {formatDateSpanish(bookingDraft.date)}:
                </label>
                <span className="text-xs text-[#725D6B] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Duración aproximada: {selectedService.durationMinutes} min
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlotsForDay.includes(slot);
                  const isSelected = bookingDraft.timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => updateBookingDraft({ timeSlot: slot })}
                      className={`py-3 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isBooked
                          ? 'bg-[#F5F2F4] text-[#B09FA9] border border-transparent cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#271A22] text-white shadow-sm ring-2 ring-[#C59B27]'
                          : 'bg-[#FFFDFB] text-[#3D2B36] border border-[#EACBD9] hover:bg-[#FDF2F4]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                      <span>{slot}</span>
                      {isBooked && <span className="text-[9px] no-underline block ml-1">(Ocupado)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#725D6B] hover:text-[#271A22]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Servicios</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-lg shadow-sm hover:bg-[#B58A1C] transition-all cursor-pointer"
              >
                <span>Continuar a Tus Datos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CLIENT DETAILS & LOYALTY POINTS */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-[#F7E5EC] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">Paso 3 de 4</span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#271A22] mt-1">
                Tus Datos de Contacto & Club de Lealtad
              </h2>
              <p className="text-xs sm:text-sm text-[#725D6B]">
                Enviaremos la confirmación oficial a tu WhatsApp y correo electrónico.
              </p>
            </div>

            {/* Quick Loyalty Phone Checker */}
            <div className="p-4 bg-gradient-to-r from-[#FFF5F8] to-[#FFF9F2] rounded-xl border border-[#FAD3DF]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A67D1C] uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>¿Eres cliente frecuente? Consulta tus Puntos VIP</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Ej: 3128945672 (Prueba: 3128945672)"
                  value={phoneQuery || bookingDraft.clientPhone}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                />
                <button
                  type="button"
                  onClick={handlePhoneCheck}
                  className="px-4 py-2 text-xs font-semibold bg-[#271A22] text-white rounded-lg hover:bg-[#3D2B36] transition-colors"
                >
                  Consultar Puntos
                </button>
              </div>

              {/* Loyalty Benefits Alert if Client exists */}
              {clientLoyalty && (
                <div className="mt-3 pt-3 border-t border-[#F8D2DF] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#271A22]">
                        ¡Hola {clientLoyalty.name}! Nivel: <span className="text-[#C59B27]">{clientLoyalty.tier}</span>
                      </p>
                      <p className="text-[11px] text-[#725D6B]">
                        Tienes <strong className="text-[#271A22]">{clientLoyalty.points} puntos</strong> acumulados en tu cuenta.
                      </p>
                    </div>
                  </div>

                  {/* Redeem Buttons if sufficient points */}
                  {clientLoyalty.points >= 80 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyLoyaltyDiscount(80, 15000)}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-colors ${
                          bookingDraft.loyaltyPointsToRedeem === 80
                            ? 'bg-[#C59B27] text-white border-[#C59B27]'
                            : 'bg-white text-[#271A22] border-[#C59B27] hover:bg-[#FDF9EE]'
                        }`}
                      >
                        {bookingDraft.loyaltyPointsToRedeem === 80
                          ? '✓ Descuento $15.000 aplicado (80 pts)'
                          : 'Usar 80 pts -> Descuento $15.000 COP'}
                      </button>

                      {clientLoyalty.points >= 150 && (
                        <button
                          type="button"
                          onClick={() => handleApplyLoyaltyDiscount(150, 30000)}
                          className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-colors ${
                            bookingDraft.loyaltyPointsToRedeem === 150
                              ? 'bg-[#C59B27] text-white border-[#C59B27]'
                              : 'bg-white text-[#271A22] border-[#C59B27] hover:bg-[#FDF9EE]'
                          }`}
                        >
                          {bookingDraft.loyaltyPointsToRedeem === 150
                            ? '✓ Descuento $30.000 aplicado (150 pts)'
                            : 'Usar 150 pts -> Descuento $30.000 COP'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Client Inputs Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#271A22] mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8E7583] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. María Camila Gómez"
                    value={bookingDraft.clientName}
                    onChange={(e) => updateBookingDraft({ clientName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#271A22] mb-1">
                    Número de WhatsApp / Móvil *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8E7583] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 3128945672"
                      value={bookingDraft.clientPhone}
                      onChange={(e) => updateBookingDraft({ clientPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#271A22] mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8E7583] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={bookingDraft.clientEmail}
                      onChange={(e) => updateBookingDraft({ clientEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#271A22] mb-1">
                  Notas Especiales o Preferencias de Diseño (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Tengo retiro de sistema anterior, me gustan los colores nude con destellos dorados..."
                  value={bookingDraft.notes}
                  onChange={(e) => updateBookingDraft({ notes: e.target.value })}
                  className="w-full p-3 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#725D6B] hover:text-[#271A22]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Fecha & Hora</span>
              </button>

              <button
                onClick={() => {
                  if (!bookingDraft.clientName || !bookingDraft.clientPhone || !bookingDraft.clientEmail) {
                    showToast('Por favor diligencia nombre, WhatsApp y correo.', 'error');
                    return;
                  }
                  setStep(4);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-lg shadow-sm hover:bg-[#B58A1C] transition-all cursor-pointer"
              >
                <span>Continuar a Pasarela de Abono</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT GATEWAY (PASARELA DE ABONO) */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-[#F7E5EC] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">Paso 4 de 4 · Pasarela Segura</span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#271A22] mt-1">
                Realiza el abono para confirmar tu turno
              </h2>
              <p className="text-xs sm:text-sm text-[#725D6B]">
                Para garantizar la exclusividad de tu espacio en la agenda, el estudio requiere un abono que se descuenta del valor total del servicio.
              </p>
            </div>

            {/* Summary Breakdown Box */}
            <div className="bg-[#FFFDFB] rounded-xl border border-[#FAD3DF] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#F7E5EC]">
                <div>
                  <h4 className="text-sm font-bold text-[#271A22]">{selectedService.name}</h4>
                  <p className="text-xs text-[#725D6B]">
                    Con {selectedSpecialist.name} · {formatDateSpanish(bookingDraft.date)} a las {bookingDraft.timeSlot}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#271A22] tabular-nums">
                  {formatCOP(selectedService.price)}
                </span>
              </div>

              {bookingDraft.loyaltyDiscountCOP > 0 && (
                <div className="flex items-center justify-between text-xs text-[#C59B27] font-semibold">
                  <span>Descuento Club VIP ({bookingDraft.loyaltyPointsToRedeem} pts)</span>
                  <span className="tabular-nums">-{formatCOP(bookingDraft.loyaltyDiscountCOP)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#725D6B]">
                <span>Valor Final del Servicio:</span>
                <span className="font-medium text-[#271A22] tabular-nums">{formatCOP(finalTotal)}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F7E5EC] bg-[#FFF5F8] -mx-4 -mb-3 p-4 rounded-b-xl">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#A67D1C] font-bold block">
                    Abono Requerido Hoy:
                  </span>
                  <span className="text-[11px] text-[#725D6B]">
                    Saldo restante en el estudio: {formatCOP(remainingInStudio)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#C59B27] font-serif tabular-nums">
                    {formatCOP(selectedService.depositAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#271A22] mb-3">
                Selecciona tu Método de Pago para el Abono:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'card', label: 'Tarjetas Crédito/Débito', icon: CreditCard },
                  { id: 'nequi', label: 'Nequi Colombia', icon: QrCode },
                  { id: 'daviplata', label: 'Daviplata', icon: QrCode },
                  { id: 'pse', label: 'PSE Transferencia', icon: Lock },
                ].map((m) => {
                  const isSelected = paymentMethod === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C59B27] bg-[#FFFDF7] ring-2 ring-[#F8ECC5]'
                          : 'border-[#F7E5EC] hover:border-[#FAD3DF] bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-[#C59B27]' : 'text-[#8E7583]'}`} />
                      <span className="text-xs font-semibold block text-[#271A22]">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form Fields */}
            {paymentMethod === 'card' && (
              <div className="bg-[#FFFDFB] p-4 rounded-xl border border-[#F7E5EC] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#725D6B] pb-2 border-b border-[#F7E5EC]">
                  <span className="flex items-center gap-1.5 font-medium text-[#271A22]">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    Transacción cifrada SSL 256-bit
                  </span>
                  <span>Visa, Mastercard, Amex</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#271A22] mb-1">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-medium text-[#271A22] mb-1">
                      Nombre en la Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#271A22] mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                    />
                  </div>
                </div>
              </div>
            )}

            {(paymentMethod === 'nequi' || paymentMethod === 'daviplata') && (
              <div className="bg-[#FFFDFB] p-5 rounded-xl border border-[#F7E5EC] flex flex-col sm:flex-row items-center gap-5">
                <div className="w-32 h-32 bg-white p-2 rounded-lg border border-[#EACBD9] shadow-xs flex flex-col items-center justify-center text-center">
                  <QrCode className="w-20 h-20 text-[#271A22]" />
                  <span className="text-[10px] font-bold text-[#A67D1C] uppercase mt-1">Escanea en App</span>
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-xs font-bold text-[#271A22] uppercase tracking-wide">
                    Pago Directo {paymentMethod.toUpperCase()} Karito Villa
                  </p>
                  <p className="text-xs text-[#725D6B]">
                    Número de cuenta estudio: <strong className="text-[#271A22] font-mono">312 894 5672</strong>
                  </p>
                  <p className="text-xs text-[#725D6B]">
                    Monto exacto de abono: <strong className="text-[#C59B27]">{formatCOP(selectedService.depositAmount)}</strong>
                  </p>
                  <p className="text-[11px] text-[#A67D1C] italic pt-1">
                    Al confirmar, el sistema asocia automáticamente tu comprobante con tu código de reserva.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'pse' && (
              <div className="bg-[#FFFDFB] p-4 rounded-xl border border-[#F7E5EC] space-y-2">
                <p className="text-xs font-semibold text-[#271A22]">
                  Selecciona tu entidad bancaria para débito PSE:
                </p>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]">
                  <option>Bancolombia</option>
                  <option>Davivienda</option>
                  <option>Banco de Bogotá</option>
                  <option>Scotiabank Colpatria</option>
                  <option>BBVA Colombia</option>
                  <option>Nu Colombia</option>
                </select>
              </div>
            )}

            {/* Final Action Button */}
            <div className="pt-4 flex items-center justify-between border-t border-[#F7E5EC]">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#725D6B] hover:text-[#271A22]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Datos</span>
              </button>

              <button
                type="button"
                onClick={handleFinalPayment}
                disabled={isProcessingPayment}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#B3871E] rounded-lg shadow-md hover:from-[#B58A1C] hover:to-[#9F7414] transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Procesando Abono Seguro...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pagar Abono de {formatCOP(selectedService.depositAmount)} & Confirmar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
