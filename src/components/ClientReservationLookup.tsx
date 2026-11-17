import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { formatCOP, formatDateSpanish, buildWhatsAppMessage } from '../utils/formatters';
import { Appointment } from '../types';
import { TIME_SLOTS } from '../data/initialData';
import {
  Search,
  Calendar,
  Clock,
  User,
  CreditCard,
  Share2,
  Printer,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Sparkles,
} from 'lucide-react';

export const ClientReservationLookup: React.FC = () => {
  const {
    findAppointmentByCodeOrPhone,
    cancelAppointment,
    rescheduleAppointment,
    showToast,
  } = useSalon();

  const [query, setQuery] = useState('KV-8831B');
  const [searchResults, setSearchResults] = useState<Appointment[]>(() =>
    findAppointmentByCodeOrPhone('KV-8831B')
  );
  const [hasSearched, setHasSearched] = useState(true);

  // Reschedule modal state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = findAppointmentByCodeOrPhone(query);
    setSearchResults(results);
    setHasSearched(true);
    if (results.length === 0) {
      showToast('No se encontraron reservas con ese código o teléfono.', 'info');
    }
  };

  const handleCancel = (id: string, code: string) => {
    if (window.confirm(`¿Estás segura de que deseas cancelar la cita con código ${code}?`)) {
      cancelAppointment(id);
      setSearchResults((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    }
  };

  const handleOpenReschedule = (apt: Appointment) => {
    setReschedulingApt(apt);
    setNewDate(apt.date);
    setNewSlot(apt.timeSlot);
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApt || !newDate || !newSlot) return;
    rescheduleAppointment(reschedulingApt.id, newDate, newSlot);
    setSearchResults((prev) =>
      prev.map((a) =>
        a.id === reschedulingApt.id
          ? { ...a, date: newDate, timeSlot: newSlot, status: 'confirmed' }
          : a
      )
    );
    setReschedulingApt(null);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FFFDFB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
            Gestión de Clientes
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#271A22] tracking-tight">
            Consulta y gestiona tu reserva
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#725D6B]">
            Ingresa tu código de reserva (ej: KV-8831B) o número de WhatsApp registrado para ver los detalles, reagendar o descargar tu comprobante.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-[#F7E5EC] p-6 shadow-md">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8E7583] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Código (KV-8831B) o teléfono celular..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-xl hover:bg-[#B58A1C] transition-colors cursor-pointer"
            >
              Buscar
            </button>
          </form>

          <div className="mt-2 text-[11px] text-[#725D6B] flex items-center gap-2">
            <span>Pruebas rápidas:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('KV-8831B');
                setSearchResults(findAppointmentByCodeOrPhone('KV-8831B'));
              }}
              className="text-[#C59B27] hover:underline cursor-pointer"
            >
              KV-8831B
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setQuery('KV-4190C');
                setSearchResults(findAppointmentByCodeOrPhone('KV-4190C'));
              }}
              className="text-[#C59B27] hover:underline cursor-pointer"
            >
              KV-4190C
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-4">
            {searchResults.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#F7E5EC] p-8 text-center text-xs text-[#725D6B]">
                <AlertCircle className="w-8 h-8 text-[#C59B27] mx-auto mb-2" />
                <p className="font-semibold text-sm text-[#271A22]">No encontramos reservas con ese dato.</p>
                <p className="mt-1">Verifica si el código está bien escrito o intenta con tu número celular.</p>
              </div>
            ) : (
              searchResults.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-[#FAD3DF] p-6 shadow-md space-y-4"
                >
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#F7E5EC]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67D1C]">
                        Código de Reserva
                      </span>
                      <h3 className="font-mono text-xl font-bold text-[#271A22]">{apt.bookingCode}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : apt.status === 'completed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.status === 'confirmed' && 'Confirmada con Abono'}
                        {apt.status === 'cancelled' && 'Cancelada'}
                        {apt.status === 'completed' && 'Completada'}
                        {apt.status === 'pending_deposit' && 'Pendiente de Abono'}
                      </span>
                    </div>
                  </div>

                  {/* Grid of info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#8E7583] block">Servicio:</span>
                      <strong className="text-[#271A22] text-sm font-semibold">{apt.serviceName}</strong>
                    </div>

                    <div>
                      <span className="text-[#8E7583] block">Especialista:</span>
                      <strong className="text-[#271A22] text-sm font-semibold">{apt.specialistName}</strong>
                    </div>

                    <div>
                      <span className="text-[#8E7583] block">Fecha & Turno:</span>
                      <strong className="text-[#271A22] text-sm font-semibold">
                        {formatDateSpanish(apt.date)} · {apt.timeSlot}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#8E7583] block">Cliente:</span>
                      <span className="text-[#271A22] font-medium">{apt.clientName} ({apt.clientPhone})</span>
                    </div>

                    <div>
                      <span className="text-[#8E7583] block">Abono Registrado:</span>
                      <span className="font-bold text-emerald-700 tabular-nums">
                        {formatCOP(apt.depositAmount)} ({apt.paymentMethod.toUpperCase()})
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8E7583] block">Saldo Restante en Estudio:</span>
                      <span className="font-bold text-[#271A22] tabular-nums">
                        {formatCOP(apt.remainingAmount)}
                      </span>
                    </div>
                  </div>

                  {apt.notes && (
                    <div className="p-3 bg-[#FFF9FA] rounded-lg text-xs text-[#725D6B] border border-[#FAD3DF]">
                      <strong>Notas del servicio:</strong> {apt.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#F7E5EC] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const text = buildWhatsAppMessage({
                            bookingCode: apt.bookingCode,
                            clientName: apt.clientName,
                            serviceName: apt.serviceName,
                            specialistName: apt.specialistName,
                            date: apt.date,
                            timeSlot: apt.timeSlot,
                            depositAmount: apt.depositAmount,
                            remainingAmount: apt.remainingAmount,
                          });
                          window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#25D366] bg-[#E8FBF0] rounded-lg hover:bg-[#D4F6E3] transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Reenviar a WhatsApp</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5A4552] bg-[#FDF2F4] rounded-lg hover:bg-[#FBE4ED] transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimir</span>
                      </button>
                    </div>

                    {apt.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenReschedule(apt)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#C59B27] bg-[#FCF9EE] border border-[#EEDFA0] rounded-lg hover:bg-[#F7EFCF] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Reagendar Turno</span>
                        </button>

                        <button
                          onClick={() => handleCancel(apt.id, apt.bookingCode)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelar Cita</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reschedule Modal */}
        {reschedulingApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#FAD3DF] space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-[#271A22]">
                Reagendar Cita {reschedulingApt.bookingCode}
              </h3>
              <p className="text-xs text-[#725D6B]">
                Tu abono de {formatCOP(reschedulingApt.depositAmount)} se conserva intacto para tu nueva fecha.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase text-[#271A22] mb-1">
                  Nueva Fecha:
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#271A22] mb-1">
                  Nuevo Horario:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewSlot(slot)}
                      className={`py-2 px-3 text-xs rounded-lg border font-semibold ${
                        newSlot === slot
                          ? 'bg-[#C59B27] text-white border-[#C59B27]'
                          : 'bg-white text-[#271A22] border-[#EACBD9] hover:bg-[#FDF2F4]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="flex-1 py-2.5 text-xs font-semibold text-[#725D6B] border border-[#EACBD9] rounded-lg"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-lg shadow-sm hover:bg-[#B58A1C]"
                >
                  Confirmar Cambio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
