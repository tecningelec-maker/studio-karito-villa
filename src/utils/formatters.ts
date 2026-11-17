/**
 * Utility formatters for Karito Villa Estudio
 */

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'KV-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDateSpanish(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDateSpanish(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CO', {
    month: 'short',
    day: 'numeric',
  });
}

export function buildWhatsAppMessage(appointment: {
  bookingCode: string;
  clientName: string;
  serviceName: string;
  specialistName: string;
  date: string;
  timeSlot: string;
  depositAmount: number;
  remainingAmount: number;
}): string {
  const text = `✨ *CONFIRMACIÓN DE CITA - KARITO VILLA (ESTUDIO)* ✨\n\n` +
    `¡Hola ${appointment.clientName}! Tu reserva ha sido registrada con éxito.\n\n` +
    `📌 *Código de Reserva:* ${appointment.bookingCode}\n` +
    `💅 *Servicio:* ${appointment.serviceName}\n` +
    `👩‍🎨 *Especialista:* ${appointment.specialistName}\n` +
    `📅 *Fecha:* ${formatDateSpanish(appointment.date)}\n` +
    `⏰ *Hora:* ${appointment.timeSlot}\n\n` +
    `💳 *Abono Pagado:* ${formatCOP(appointment.depositAmount)}\n` +
    `💵 *Saldo restante en estudio:* ${formatCOP(appointment.remainingAmount)}\n\n` +
    `📍 *Ubicación:* Cra. 43A #1 Sur-220, El Poblado, Medellín\n` +
    `⚠️ *Política:* Cancelaciones o reagendamientos con mínimo 24h de anticipación.\n\n` +
    `¡Te esperamos para consentirte como mereces! 🌸`;

  return encodeURIComponent(text);
}
