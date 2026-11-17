export type ServiceCategory = 'todos' | 'manicura' | 'esculpidas' | 'pedicura' | 'nail_art';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number; // in COP
  depositAmount: number; // Abono requerido in COP
  description: string;
  image: string;
  popular?: boolean;
  perks: string[];
  pointsEarned: number;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  colorTag: string; // for agenda calendar
}

export type AppointmentStatus = 'confirmed' | 'pending_deposit' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  bookingCode: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  specialistId: string;
  specialistName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  totalPrice: number;
  depositAmount: number;
  remainingAmount: number;
  status: AppointmentStatus;
  notes?: string;
  loyaltyPointsUsed: number;
  loyaltyDiscount: number;
  loyaltyPointsEarned: number;
  paymentMethod: 'card' | 'nequi' | 'daviplata' | 'pse';
  paymentReference: string;
  createdAt: string;
}

export type LoyaltyTier = 'Rosa Pastel' | 'Oro Rosa' | 'Diamante Karito';

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  points: number; // positive for earned, negative for redeemed
  bookingCode?: string;
}

export interface LoyaltyProfile {
  phone: string;
  name: string;
  email: string;
  points: number;
  tier: LoyaltyTier;
  totalAppointments: number;
  history: LoyaltyTransaction[];
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsRequired: number;
  description: string;
  discountCOP: number;
  minTier: LoyaltyTier;
  tag: string;
}
