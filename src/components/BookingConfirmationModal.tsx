import React from 'react';
import { useSalon } from '../context/SalonContext';
import { formatCOP, formatDateSpanish, buildWhatsAppMessage } from '../utils/formatters';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Share2,
  Printer,
  Sparkles,
  Award,
  X,
  CreditCard,
  MapPin,
} from 'lucide-react';

export const BookingConfirmationModal: React.FC = () => {
  const { confirmedAppointment, setConfirmedAppointment, setActiveTab } = useSalon();

  if (!confirmedAppointment) return null;

  const handleOpenWhatsApp = () => {
    const textEncoded = buildWhatsAppMessage({
      bookingCode: confirmedAppointment.bookingCode,
      clientName: confirmedAppointment.clientName,
      serviceName: confirmedAppointment.serviceName,
      specialistName: confirmedAppointment.specialistName,
      date: confirmedAppointment.date,
      timeSlot: confirmedAppointment.timeSlot,
      depositAmount: confirmedAppointment.depositAmount,
      remainingAmount: confirmedAppointment.remainingAmount,
    });
    // Open in new tab or app
    window.open(`https://api.whatsapp.com/send?text=${textEncoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#FAD3DF] my-8 animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#A67D1C] p-6 text-white text-center relative">
          <button
            onClick={() => setConfirmedAppointment(null)}
            className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-wide">
            ¡Reserva Confirmada con Éxito!
          </h3>
          <p className="text-xs text-white/90 mt-1 uppercase tracking-widest font-medium">
            Karito Villa (Estudio) · Nail Art de Alta Gama
          </p>
        </div>

        {/* Voucher Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Booking Code Banner */}
          <div className="bg-[#FFF9FA] border border-[#FAD3DF] rounded-2xl p-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E7583] block">
              Código Único de Reserva
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#C59B27] tracking-wider block mt-0.5">
              {confirmedAppointment.bookingCode}
            </span>
            <span className="text-xs text-[#725D6B] block mt-1">
              Conserva este código para consultas o cambios en recepción.
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs border-b border-[#F7E5EC] pb-6">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#725D6B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                Servicio:
              </span>
              <span className="font-semibold text-[#271A22] text-right">
                {confirmedAppointment.serviceName}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#725D6B] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C59B27]" />
                Nail Artist:
              </span>
              <span className="font-semibold text-[#271A22]">
                {confirmedAppointment.specialistName}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#725D6B] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                Fecha:
              </span>
              <span className="font-semibold text-[#271A22]">
                {formatDateSpanish(confirmedAppointment.date)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#725D6B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                Horario:
              </span>
              <span className="font-semibold text-[#271A22]">
                {confirmedAppointment.timeSlot}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#725D6B] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                Abono Pagado ({confirmedAppointment.paymentMethod.toUpperCase()}):
              </span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {formatCOP(confirmedAppointment.depositAmount)} (Registrado)
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#725D6B]">Saldo a liquidar en el estudio:</span>
              <span className="font-bold text-[#271A22] tabular-nums">
                {formatCOP(confirmedAppointment.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Loyalty Reward Banner */}
          <div className="p-3 bg-[#FCF9EE] rounded-xl border border-[#F7EFCF] flex items-center gap-3">
            <Award className="w-6 h-6 text-[#C59B27] shrink-0" />
            <div className="text-left text-xs">
              <p className="font-bold text-[#271A22]">
                ¡Has acumulado +{confirmedAppointment.loyaltyPointsEarned} Puntos VIP!
              </p>
              <p className="text-[#725D6B] text-[11px]">
                Podrás redimirlos en tu siguiente visita para manicuras y nail art sin costo.
              </p>
            </div>
          </div>

          {/* Studio Location Note */}
          <div className="flex items-start gap-2 text-xs text-[#725D6B]">
            <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
            <span>
              <strong>Ubicación:</strong> Cra. 43A #1 Sur-220, El Poblado, Medellín. Se ruega llegar 5 minutos antes para brindarte una copa de bienvenida o infusión botánica.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BE5B] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Abrir Comprobante en WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePrint}
                className="py-3 px-4 bg-white border border-[#EACBD9] text-[#5A4552] hover:bg-[#FDF2F4] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedAppointment(null);
                  setActiveTab('loyalty');
                }}
                className="py-3 px-4 bg-[#271A22] text-white hover:bg-[#3D2B36] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#C59B27]" />
                <span>Ver Mi Club VIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
