import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { formatCOP } from '../utils/formatters';
import { TIME_SLOTS } from '../data/initialData';
import {
  Plus,
  Search,
  X,
} from 'lucide-react';

export const AdminAgendaDashboard: React.FC = () => {
  const {
    appointments,
    specialists,
    services,
    updateAppointmentStatus,
    cancelAppointment,
    createManualAppointment,
  } = useSalon();

  const [filterSpecialist, setFilterSpecialist] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchClient, setSearchClient] = useState<string>('');

  // Manual appointment modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: services[0]?.id || '',
    specialistId: specialists[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    notes: 'Agendado presencialmente en recepción del estudio.',
    depositPaid: true,
  });

  // Calculate Key Business Metrics
  const totalAppointments = appointments.length;
  const totalDepositsCollected = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.depositAmount, 0);
  const totalProjectedRevenue = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.totalPrice, 0);
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  // Filter Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchSpecialist = filterSpecialist === 'all' || apt.specialistId === filterSpecialist;
    const matchStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchSearch =
      !searchClient ||
      apt.clientName.toLowerCase().includes(searchClient.toLowerCase()) ||
      apt.bookingCode.toLowerCase().includes(searchClient.toLowerCase()) ||
      apt.clientPhone.includes(searchClient);
    return matchSpecialist && matchStatus && matchSearch;
  });

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    createManualAppointment(manualForm);
    setShowManualModal(false);
    setManualForm({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: services[0]?.id || '',
      specialistId: specialists[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM',
      notes: 'Agendado presencialmente en recepción del estudio.',
      depositPaid: true,
    });
  };

  return (
    <div className="py-10 bg-gradient-to-b from-[#FDF0F4] to-[#FCE4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Mode Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0BDD0]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#785163]">
              <span className="font-bold uppercase tracking-wider text-[#9E7114]">
                Panel de Administración & Agenda
              </span>
              <span aria-hidden="true">·</span>
              <span>Karito Villa (Estudio)</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#2E1621] mt-1">
              Control de Turnos, Especialistas & Abonos
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowManualModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#AD8218] rounded-xl hover:from-[#B58A1C] hover:to-[#976F12] shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar Turno Manual / Walk-in</span>
            </button>
          </div>
        </div>

        {/* 4 Financial & Agenda KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFF8FA] p-5 rounded-2xl border border-[#F3C5D6] shadow-xs space-y-1">
            <span className="text-xs font-medium text-[#785163] block">Citas Totales Registradas</span>
            <span className="font-serif text-3xl font-bold text-[#2E1621] block tabular-nums">
              {totalAppointments}
            </span>
            <span className="text-[11px] text-[#9E7114]">Agenda activa en tiempo real</span>
          </div>

          <div className="bg-[#FFF8FA] p-5 rounded-2xl border border-[#F3C5D6] shadow-xs space-y-1">
            <span className="text-xs font-medium text-[#785163] block">Abonos Recibidos</span>
            <span className="font-serif text-3xl font-bold text-emerald-700 block tabular-nums">
              {formatCOP(totalDepositsCollected)}
            </span>
            <span className="text-[11px] text-emerald-700">Fondos asegurados por pasarela</span>
          </div>

          <div className="bg-[#FFF8FA] p-5 rounded-2xl border border-[#F3C5D6] shadow-xs space-y-1">
            <span className="text-xs font-medium text-[#785163] block">Facturación Proyectada</span>
            <span className="font-serif text-3xl font-bold text-[#B88918] block tabular-nums">
              {formatCOP(totalProjectedRevenue)}
            </span>
            <span className="text-[11px] text-[#5C3445]">Total con servicios completados</span>
          </div>

          <div className="bg-[#FFF8FA] p-5 rounded-2xl border border-[#F3C5D6] shadow-xs space-y-1">
            <span className="text-xs font-medium text-[#785163] block">Servicios Completados</span>
            <span className="font-serif text-3xl font-bold text-[#2E1621] block tabular-nums">
              {completedCount}
            </span>
            <span className="text-[11px] text-[#9E7114]">Clientas fidelizadas con puntos</span>
          </div>
        </div>

        {/* Agenda Filters Bar */}
        <div className="bg-[#FFF8FA] p-5 rounded-2xl border border-[#F3C5D6] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#785163] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por nombre de cliente, teléfono o código..."
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#FFFBFD] border border-[#EBB8CB] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
              />
            </div>

            {/* Specialist Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#5C3445] whitespace-nowrap">Nail Artist:</span>
              <select
                value={filterSpecialist}
                onChange={(e) => setFilterSpecialist(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-[#EBB8CB] bg-[#FFFBFD] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
              >
                <option value="all">Todas las artistas</option>
                {specialists.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({sp.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#5C3445] whitespace-nowrap">Estado:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-[#EBB8CB] bg-[#FFFBFD] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
              >
                <option value="all">Todos los estados</option>
                <option value="confirmed">Confirmadas</option>
                <option value="completed">Completadas</option>
                <option value="pending_deposit">Pendiente Abono</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table / List */}
        <div className="bg-[#FFF8FA] rounded-2xl border border-[#F3C5D6] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#F3C5D6] flex items-center justify-between bg-[#FCE8EF]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E1621]">
              Listado de Citas en Agenda ({filteredAppointments.length})
            </h3>
            <span className="text-xs text-[#785163]">
              Ordenadas por fecha y turno programado
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FADCE6]/55 text-[#5C3445] uppercase tracking-wider border-b border-[#F3C5D6]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Código</th>
                  <th className="py-3 px-4 font-semibold">Cliente</th>
                  <th className="py-3 px-4 font-semibold">Servicio & Nail Artist</th>
                  <th className="py-3 px-4 font-semibold">Fecha & Turno</th>
                  <th className="py-3 px-4 font-semibold">Abono & Saldo</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold text-right">Acciones de Agenda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3C5D6]">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#5C3445]">
                      No se encontraron citas con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#FCE8EF]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#9E7114]">
                        {apt.bookingCode}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#2E1621]">{apt.clientName}</div>
                        <div className="text-[11px] text-[#5C3445]">{apt.clientPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#2E1621]">{apt.serviceName}</div>
                        <div className="text-[11px] text-[#9E7114] font-semibold">{apt.specialistName}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-[#2E1621] tabular-nums">{apt.date}</div>
                        <div className="text-[11px] text-[#5C3445] tabular-nums">{apt.timeSlot}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-emerald-700 tabular-nums">
                          Abono: {formatCOP(apt.depositAmount)}
                        </div>
                        <div className="text-[11px] text-[#5C3445] tabular-nums">
                          Saldo: {formatCOP(apt.remainingAmount)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'completed'
                              ? 'bg-purple-100 text-purple-800'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status === 'confirmed' && 'Confirmada'}
                          {apt.status === 'completed' && 'Completada'}
                          {apt.status === 'cancelled' && 'Cancelada'}
                          {apt.status === 'pending_deposit' && 'Pendiente'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              title="Marcar como atendida y completada"
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                            >
                              ✓ Completar
                            </button>
                          )}

                          {apt.status === 'pending_deposit' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              title="Confirmar recepción de abono"
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#9E7114] bg-[#FCF9EE] hover:bg-[#F7EFCF] rounded-md border border-[#F3DF9A] transition-colors cursor-pointer"
                            >
                              Confirmar Abono
                            </button>
                          )}

                          {apt.status !== 'cancelled' && (
                            <button
                              onClick={() => cancelAppointment(apt.id)}
                              title="Cancelar cita"
                              className="px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Walk-in Modal */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E1621]/55 backdrop-blur-xs p-4">
            <div className="bg-[#FFF8FA] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#F3C5D6] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3C5D6]">
                <h3 className="font-editorial text-2xl font-bold text-[#2E1621]">
                  Agendar Turno Manual en Estudio
                </h3>
                <button
                  onClick={() => setShowManualModal(false)}
                  className="text-[#785163] hover:text-[#2E1621] cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManual} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-[#2E1621] mb-1">Nombre de la Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carolina Ramírez"
                    value={manualForm.clientName}
                    onChange={(e) => setManualForm({ ...manualForm, clientName: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#FFFBFD] border border-[#EBB8CB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#2E1621] mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 3001234567"
                      value={manualForm.clientPhone}
                      onChange={(e) => setManualForm({ ...manualForm, clientPhone: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#FFFBFD] border border-[#EBB8CB]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#2E1621] mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="cliente@gmail.com"
                      value={manualForm.clientEmail}
                      onChange={(e) => setManualForm({ ...manualForm, clientEmail: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#FFFBFD] border border-[#EBB8CB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#2E1621] mb-1">Servicio *</label>
                    <select
                      value={manualForm.serviceId}
                      onChange={(e) => setManualForm({ ...manualForm, serviceId: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#FFFBFD] border border-[#EBB8CB]"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({formatCOP(s.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-[#2E1621] mb-1">Nail Artist *</label>
                    <select
                      value={manualForm.specialistId}
                      onChange={(e) => setManualForm({ ...manualForm, specialistId: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#FFFBFD] border border-[#EBB8CB]"
                    >
                      {specialists.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#2E1621] mb-1">Fecha</label>
                    <input
                      type="date"
                      value={manualForm.date}
                      onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#FFFBFD] border border-[#EBB8CB]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#2E1621] mb-1">Turno</label>
                    <select
                      value={manualForm.timeSlot}
                      onChange={(e) => setManualForm({ ...manualForm, timeSlot: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#FFFBFD] border border-[#EBB8CB]"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="depositPaidCheck"
                    checked={manualForm.depositPaid}
                    onChange={(e) => setManualForm({ ...manualForm, depositPaid: e.target.checked })}
                    className="rounded text-[#C59B27] focus:ring-[#C59B27]"
                  />
                  <label htmlFor="depositPaidCheck" className="text-xs text-[#2E1621]">
                    Abono pagado en efectivo o datáfono en recepción
                  </label>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="flex-1 py-2.5 rounded-lg bg-[#FCE4EC] border border-[#EBB8CB] text-[#5C3445] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#C59B27] to-[#AD8218] text-white font-semibold uppercase tracking-wider shadow-sm hover:from-[#B58A1C] hover:to-[#976F12] cursor-pointer"
                  >
                    Guardar Turno
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
