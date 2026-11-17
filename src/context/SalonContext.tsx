import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Service,
  Specialist,
  Appointment,
  AppointmentStatus,
  LoyaltyProfile,
  LoyaltyReward,
  LoyaltyTier,
} from '../types';
import {
  INITIAL_SERVICES,
  SPECIALISTS,
  INITIAL_APPOINTMENTS,
  INITIAL_LOYALTY_PROFILES,
  LOYALTY_REWARDS,
} from '../data/initialData';
import { generateBookingCode } from '../utils/formatters';

export interface BookingDraft {
  serviceId: string;
  specialistId: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  loyaltyPointsToRedeem: number;
  loyaltyDiscountCOP: number;
}

interface SalonContextType {
  // Navigation
  activeTab: 'home' | 'catalog' | 'booking' | 'loyalty' | 'lookup' | 'admin';
  setActiveTab: (tab: 'home' | 'catalog' | 'booking' | 'loyalty' | 'lookup' | 'admin') => void;

  // Data
  services: Service[];
  specialists: Specialist[];
  appointments: Appointment[];
  loyaltyProfiles: LoyaltyProfile[];
  loyaltyRewards: LoyaltyReward[];

  // Booking Flow
  bookingDraft: BookingDraft;
  updateBookingDraft: (updates: Partial<BookingDraft>) => void;
  startBookingWithService: (serviceId: string) => void;
  resetBookingDraft: () => void;
  confirmBooking: (paymentMethod: 'card' | 'nequi' | 'daviplata' | 'pse') => Appointment;
  createManualAppointment: (data: {
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    serviceId: string;
    specialistId: string;
    date: string;
    timeSlot: string;
    notes: string;
    depositPaid: boolean;
  }) => Appointment;

  // Appointment Actions
  updateAppointmentStatus: (id: string, newStatus: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, timeSlot: string) => void;
  findAppointmentByCodeOrPhone: (query: string) => Appointment[];

  // Loyalty Program
  getLoyaltyProfile: (phone: string) => LoyaltyProfile | undefined;
  createOrUpdateLoyaltyProfile: (phone: string, name: string, email: string) => LoyaltyProfile;
  redeemPointsForDiscount: (phone: string, points: number, discountCOP: number, bookingCode?: string) => boolean;

  // Modals & Notifications
  confirmedAppointment: Appointment | null;
  setConfirmedAppointment: (apt: Appointment | null) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const INITIAL_DRAFT: BookingDraft = {
  serviceId: 'manicura-rusa-semi',
  specialistId: 'karito-villa',
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
  timeSlot: '10:00 AM',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  notes: '',
  loyaltyPointsToRedeem: 0,
  loyaltyDiscountCOP: 0,
};

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'booking' | 'loyalty' | 'lookup' | 'admin'>('home');

  // Load appointments from localStorage or initial
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('karito_villa_appointments_v1');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Load loyalty profiles from localStorage or initial
  const [loyaltyProfiles, setLoyaltyProfiles] = useState<LoyaltyProfile[]>(() => {
    try {
      const saved = localStorage.getItem('karito_villa_loyalty_v1');
      return saved ? JSON.parse(saved) : INITIAL_LOYALTY_PROFILES;
    } catch {
      return INITIAL_LOYALTY_PROFILES;
    }
  });

  const [bookingDraft, setBookingDraft] = useState<BookingDraft>(INITIAL_DRAFT);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('karito_villa_appointments_v1', JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('karito_villa_loyalty_v1', JSON.stringify(loyaltyProfiles));
    } catch (e) {
      console.error(e);
    }
  }, [loyaltyProfiles]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const updateBookingDraft = (updates: Partial<BookingDraft>) => {
    setBookingDraft((prev) => ({ ...prev, ...updates }));
  };

  const startBookingWithService = (serviceId: string) => {
    updateBookingDraft({ serviceId });
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetBookingDraft = () => {
    setBookingDraft(INITIAL_DRAFT);
  };

  const getTierFromPoints = (points: number): LoyaltyTier => {
    if (points >= 500) return 'Diamante Karito';
    if (points >= 200) return 'Oro Rosa';
    return 'Rosa Pastel';
  };

  const getLoyaltyProfile = (phone: string): LoyaltyProfile | undefined => {
    const cleanPhone = phone.replace(/\D/g, '');
    return loyaltyProfiles.find((p) => p.phone.replace(/\D/g, '') === cleanPhone);
  };

  const createOrUpdateLoyaltyProfile = (phone: string, name: string, email: string): LoyaltyProfile => {
    const cleanPhone = phone.replace(/\D/g, '');
    const existing = loyaltyProfiles.find((p) => p.phone.replace(/\D/g, '') === cleanPhone);
    if (existing) {
      return existing;
    }
    const newProfile: LoyaltyProfile = {
      phone: cleanPhone,
      name,
      email,
      points: 50, // Welcome bonus!
      tier: 'Rosa Pastel',
      totalAppointments: 0,
      history: [
        {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: 'Bono de bienvenida Club Karito Villa',
          points: 50,
        },
      ],
    };
    setLoyaltyProfiles((prev) => [newProfile, ...prev]);
    return newProfile;
  };

  const redeemPointsForDiscount = (
    phone: string,
    points: number,
    discountCOP: number,
    bookingCode?: string
  ): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    const profile = loyaltyProfiles.find((p) => p.phone.replace(/\D/g, '') === cleanPhone);
    if (!profile || profile.points < points) return false;

    setLoyaltyProfiles((prev) =>
      prev.map((p) => {
        if (p.phone.replace(/\D/g, '') !== cleanPhone) return p;
        const newPoints = p.points - points;
        return {
          ...p,
          points: newPoints,
          tier: getTierFromPoints(newPoints),
          history: [
            {
              id: `tx-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              description: `Canje de descuento en cita (${discountCOP.toLocaleString()} COP)`,
              points: -points,
              bookingCode,
            },
            ...p.history,
          ],
        };
      })
    );
    return true;
  };

  const confirmBooking = (paymentMethod: 'card' | 'nequi' | 'daviplata' | 'pse'): Appointment => {
    const service = INITIAL_SERVICES.find((s) => s.id === bookingDraft.serviceId) || INITIAL_SERVICES[0];
    const specialist = SPECIALISTS.find((sp) => sp.id === bookingDraft.specialistId) || SPECIALISTS[0];

    const totalPrice = Math.max(0, service.price - bookingDraft.loyaltyDiscountCOP);
    const depositAmount = service.depositAmount;
    const remainingAmount = Math.max(0, totalPrice - depositAmount);
    const bookingCode = generateBookingCode();
    const pointsToEarn = Math.round(service.price / 1000); // 1 pt per 1000 COP

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingCode,
      clientName: bookingDraft.clientName || 'Cliente Karito Villa',
      clientPhone: bookingDraft.clientPhone,
      clientEmail: bookingDraft.clientEmail,
      serviceId: service.id,
      serviceName: service.name,
      specialistId: specialist.id,
      specialistName: specialist.name,
      date: bookingDraft.date,
      timeSlot: bookingDraft.timeSlot,
      totalPrice,
      depositAmount,
      remainingAmount,
      status: 'confirmed',
      notes: bookingDraft.notes,
      loyaltyPointsUsed: bookingDraft.loyaltyPointsToRedeem,
      loyaltyDiscount: bookingDraft.loyaltyDiscountCOP,
      loyaltyPointsEarned: pointsToEarn,
      paymentMethod,
      paymentReference: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };

    // Add to appointments
    setAppointments((prev) => [newAppointment, ...prev]);

    // Handle loyalty account
    if (bookingDraft.clientPhone) {
      const cleanPhone = bookingDraft.clientPhone.replace(/\D/g, '');
      const existing = loyaltyProfiles.find((p) => p.phone.replace(/\D/g, '') === cleanPhone);

      if (existing) {
        setLoyaltyProfiles((prev) =>
          prev.map((p) => {
            if (p.phone.replace(/\D/g, '') !== cleanPhone) return p;
            let currentPoints = p.points;
            if (bookingDraft.loyaltyPointsToRedeem > 0) {
              currentPoints -= bookingDraft.loyaltyPointsToRedeem;
            }
            currentPoints += pointsToEarn;

            const newHistory = [...p.history];
            if (bookingDraft.loyaltyPointsToRedeem > 0) {
              newHistory.unshift({
                id: `tx-${Date.now()}-redeem`,
                date: new Date().toISOString().split('T')[0],
                description: `Descuento canjeado en cita ${bookingCode}`,
                points: -bookingDraft.loyaltyPointsToRedeem,
                bookingCode,
              });
            }
            newHistory.unshift({
              id: `tx-${Date.now()}-earn`,
              date: new Date().toISOString().split('T')[0],
              description: `Puntos ganados en cita ${bookingCode} (${service.name})`,
              points: pointsToEarn,
              bookingCode,
            });

            return {
              ...p,
              points: currentPoints,
              totalAppointments: p.totalAppointments + 1,
              tier: getTierFromPoints(currentPoints),
              history: newHistory,
            };
          })
        );
      } else {
        // Create new profile with welcome + earned points
        const initialPts = 50 + pointsToEarn - bookingDraft.loyaltyPointsToRedeem;
        const newProf: LoyaltyProfile = {
          phone: cleanPhone,
          name: bookingDraft.clientName,
          email: bookingDraft.clientEmail,
          points: initialPts,
          tier: getTierFromPoints(initialPts),
          totalAppointments: 1,
          history: [
            {
              id: `tx-${Date.now()}-welcome`,
              date: new Date().toISOString().split('T')[0],
              description: 'Bono de bienvenida Club Karito Villa',
              points: 50,
            },
            {
              id: `tx-${Date.now()}-first`,
              date: new Date().toISOString().split('T')[0],
              description: `Puntos ganados en cita ${bookingCode}`,
              points: pointsToEarn,
              bookingCode,
            },
          ],
        };
        setLoyaltyProfiles((prev) => [newProf, ...prev]);
      }
    }

    setConfirmedAppointment(newAppointment);
    showToast(`¡Cita ${bookingCode} confirmada con éxito! Abono registrado.`);
    resetBookingDraft();
    return newAppointment;
  };

  const createManualAppointment = (data: {
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    serviceId: string;
    specialistId: string;
    date: string;
    timeSlot: string;
    notes: string;
    depositPaid: boolean;
  }): Appointment => {
    const service = INITIAL_SERVICES.find((s) => s.id === data.serviceId) || INITIAL_SERVICES[0];
    const specialist = SPECIALISTS.find((sp) => sp.id === data.specialistId) || SPECIALISTS[0];
    const depositAmount = data.depositPaid ? service.depositAmount : 0;
    const remainingAmount = Math.max(0, service.price - depositAmount);
    const bookingCode = generateBookingCode();
    const pointsToEarn = Math.round(service.price / 1000);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingCode,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientEmail: data.clientEmail,
      serviceId: service.id,
      serviceName: service.name,
      specialistId: specialist.id,
      specialistName: specialist.name,
      date: data.date,
      timeSlot: data.timeSlot,
      totalPrice: service.price,
      depositAmount,
      remainingAmount,
      status: data.depositPaid ? 'confirmed' : 'pending_deposit',
      notes: data.notes,
      loyaltyPointsUsed: 0,
      loyaltyDiscount: 0,
      loyaltyPointsEarned: pointsToEarn,
      paymentMethod: 'card',
      paymentReference: data.depositPaid ? `REC-${Math.floor(100000 + Math.random() * 900000)}` : 'PENDIENTE',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(`Turno ${bookingCode} registrado con éxito para ${data.clientName}`);
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    showToast(`Estado de cita actualizado a: ${newStatus}`);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    showToast('La cita ha sido cancelada.', 'info');
  };

  const rescheduleAppointment = (id: string, date: string, timeSlot: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, date, timeSlot, status: 'confirmed' } : apt
      )
    );
    showToast(`Cita reagendada para el ${date} a las ${timeSlot}`);
  };

  const findAppointmentByCodeOrPhone = (query: string): Appointment[] => {
    const clean = query.trim().toLowerCase();
    const cleanDigits = query.replace(/\D/g, '');
    if (!clean) return [];

    return appointments.filter((apt) => {
      const matchCode = apt.bookingCode.toLowerCase().includes(clean);
      const matchPhone = cleanDigits && apt.clientPhone.replace(/\D/g, '').includes(cleanDigits);
      const matchEmail = apt.clientEmail.toLowerCase().includes(clean);
      return matchCode || matchPhone || matchEmail;
    });
  };

  return (
    <SalonContext.Provider
      value={{
        activeTab,
        setActiveTab,
        services: INITIAL_SERVICES,
        specialists: SPECIALISTS,
        appointments,
        loyaltyProfiles,
        loyaltyRewards: LOYALTY_REWARDS,
        bookingDraft,
        updateBookingDraft,
        startBookingWithService,
        resetBookingDraft,
        confirmBooking,
        createManualAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        rescheduleAppointment,
        findAppointmentByCodeOrPhone,
        getLoyaltyProfile,
        createOrUpdateLoyaltyProfile,
        redeemPointsForDiscount,
        confirmedAppointment,
        setConfirmedAppointment,
        toast,
        showToast,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
