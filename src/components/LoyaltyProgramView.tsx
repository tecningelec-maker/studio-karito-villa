import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { formatCOP } from '../utils/formatters';
import {
  Award,
  Crown,
  Sparkles,
  Search,
  CheckCircle2,
  Gift,
  ArrowRight,
  TrendingUp,
  Clock,
  Phone,
} from 'lucide-react';

export const LoyaltyProgramView: React.FC = () => {
  const {
    loyaltyProfiles,
    loyaltyRewards,
    getLoyaltyProfile,
    redeemPointsForDiscount,
    startBookingWithService,
    showToast,
  } = useSalon();

  const [phoneSearch, setPhoneSearch] = useState('3128945672'); // Seeded demo client
  const [activeProfile, setActiveProfile] = useState(() => getLoyaltyProfile('3128945672'));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getLoyaltyProfile(phoneSearch);
    if (found) {
      setActiveProfile(found);
      showToast(`¡Perfil de ${found.name} encontrado!`);
    } else {
      showToast('No encontramos puntos asociados a este número. ¡Haz una reserva para unirte y ganar 50 pts!', 'info');
      setActiveProfile(undefined);
    }
  };

  const handleClaimReward = (rewardId: string, requiredPoints: number, discountCOP: number) => {
    if (!activeProfile) {
      showToast('Por favor consulta tu número de teléfono primero.', 'error');
      return;
    }
    if (activeProfile.points < requiredPoints) {
      showToast(`Necesitas ${requiredPoints} puntos para este beneficio. Tienes ${activeProfile.points}.`, 'error');
      return;
    }

    const success = redeemPointsForDiscount(activeProfile.phone, requiredPoints, discountCOP);
    if (success) {
      showToast(`¡Canje exitoso! Descuento de ${formatCOP(discountCOP)} reservado en tu billetera VIP.`);
      setActiveProfile(getLoyaltyProfile(activeProfile.phone));
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FCF9EE] border border-[#F3DF9A] rounded-full mb-3">
            <Award className="w-4 h-4 text-[#C59B27]" />
            <span className="text-xs font-semibold text-[#845F16] tracking-wide uppercase">
              Club VIP Karito Villa
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#271A22] tracking-tight">
            Premia tu fidelidad con tratamientos exclusivos
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#725D6B] font-light">
            Gana 1 punto por cada $1.000 COP invertidos en tu belleza. Canjea descuentos directos, diseños de autor y servicios gratuitos.
          </p>
        </div>

        {/* Client Wallet Search Box */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#F7E5EC] p-6 shadow-md">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#271A22] mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C59B27]" />
            <span>Consulta tu Billetera de Puntos & Nivel VIP:</span>
          </h3>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="tel"
              placeholder="Ingresa tu número de WhatsApp (Ej: 3128945672)"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EACBD9] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-xl hover:bg-[#B58A1C] transition-colors cursor-pointer"
            >
              Consultar
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#725D6B]">
            <span>Pruebas rápidas:</span>
            <button
              type="button"
              onClick={() => {
                setPhoneSearch('3128945672');
                setActiveProfile(getLoyaltyProfile('3128945672'));
              }}
              className="text-[#C59B27] hover:underline cursor-pointer"
            >
              María (420 pts)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setPhoneSearch('3156789012');
                setActiveProfile(getLoyaltyProfile('3156789012'));
              }}
              className="text-[#C59B27] hover:underline cursor-pointer"
            >
              Daniela (650 pts - Diamante)
            </button>
          </div>
        </div>

        {/* Active Member Status Card (If searched) */}
        {activeProfile && (
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FFF9FA] via-white to-[#FCF9EE] rounded-3xl border-2 border-[#F3DF9A] p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C59B27] text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Miembro Nivel {activeProfile.tier}</span>
                </div>

                <h2 className="font-editorial text-3xl font-bold text-[#271A22]">
                  {activeProfile.name}
                </h2>

                <p className="text-xs text-[#725D6B]">
                  WhatsApp: <strong className="text-[#271A22]">{activeProfile.phone}</strong> · {activeProfile.totalAppointments} citas completadas en Karito Villa
                </p>

                {/* Progress bar to next tier */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-medium text-[#725D6B] mb-1">
                    <span>Progreso de Nivel</span>
                    <span>{activeProfile.points} / 500 Puntos para Nivel Diamante</span>
                  </div>
                  <div className="h-2 w-full bg-[#FCE7F3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C59B27] to-[#D4AF37] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (activeProfile.points / 500) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Big Points Badge */}
              <div className="bg-white p-6 rounded-2xl border border-[#FAD3DF] text-center shadow-sm">
                <span className="text-xs uppercase tracking-wider text-[#A67D1C] font-semibold block">
                  Puntos Disponibles
                </span>
                <span className="font-serif text-5xl font-bold text-[#C59B27] block my-1 tabular-nums">
                  {activeProfile.points}
                </span>
                <span className="text-[11px] text-[#725D6B] block">
                  Equivalente a hasta {formatCOP(Math.floor(activeProfile.points / 5) * 1000)} en beneficios
                </span>
              </div>
            </div>

            {/* Points History */}
            {activeProfile.history.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#F7E5EC]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#271A22] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C59B27]" />
                  <span>Historial de Movimientos Recientes</span>
                </h4>

                <div className="space-y-2">
                  {activeProfile.history.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between text-xs py-2 px-3 bg-white/70 rounded-lg border border-[#FBF0F4]"
                    >
                      <div>
                        <span className="font-medium text-[#271A22] block">{tx.description}</span>
                        <span className="text-[10px] text-[#8E7583]">{tx.date}</span>
                      </div>
                      <span
                        className={`font-bold tabular-nums ${
                          tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3 VIP Tiers Explanation */}
        <div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#271A22] text-center mb-8">
            Niveles de Membresía VIP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-white rounded-2xl border border-[#FAD3DF] p-6 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF5F8] flex items-center justify-center text-[#F472B6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#8E7583] font-semibold uppercase tracking-wider">0 a 199 Puntos</span>
                <h4 className="text-xl font-bold text-[#271A22] font-serif">Rosa Pastel</h4>
              </div>
              <ul className="text-xs text-[#5A4552] space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>50 Puntos de bienvenida en tu primera cita</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>1 punto por cada $1.000 COP gastados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Canje de descuentos en citas a partir de 80 pts</span>
                </li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="bg-gradient-to-b from-[#FFFDF7] to-white rounded-2xl border-2 border-[#C59B27] p-6 text-left space-y-4 shadow-md relative">
              <div className="absolute -top-3 right-4 bg-[#C59B27] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Más Popular
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#FCF9EE] flex items-center justify-center text-[#C59B27]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#A67D1C] font-semibold uppercase tracking-wider">200 a 499 Puntos</span>
                <h4 className="text-xl font-bold text-[#271A22] font-serif">Oro Rosa</h4>
              </div>
              <ul className="text-xs text-[#5A4552] space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Multiplicador 1.2x en acumulación de puntos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Regalo especial en el mes de tu cumpleaños</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Nail art de cortesía en 4 uñas al canjear</span>
                </li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="bg-white rounded-2xl border border-[#FAD3DF] p-6 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF9FA] flex items-center justify-center text-[#271A22]">
                <Crown className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div>
                <span className="text-xs text-[#8E7583] font-semibold uppercase tracking-wider">500+ Puntos</span>
                <h4 className="text-xl font-bold text-[#271A22] font-serif">Diamante Karito</h4>
              </div>
              <ul className="text-xs text-[#5A4552] space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Prioridad exclusiva de agenda en horarios alta demanda</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>1 Manicura Rusa 100% gratis por año</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Copa de espumoso, té orgánico & chocolates artesanales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rewards Redeem Catalog */}
        <div className="pt-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#271A22]">
              Catálogo de Recompensas Disponibles
            </h3>
            <p className="text-xs sm:text-sm text-[#725D6B] mt-1">
              Canjea tus puntos para obtener descuentos inmediatos o añadirlos a tu próxima cita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyaltyRewards.map((reward) => {
              const canAfford = activeProfile ? activeProfile.points >= reward.pointsRequired : false;
              return (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl border border-[#F7E5EC] p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#A67D1C] uppercase tracking-wider">
                        {reward.tag}
                      </span>
                      <span className="text-xs font-bold text-[#C59B27] tabular-nums">
                        {reward.pointsRequired} Puntos
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#271A22] mb-1">
                      {reward.title}
                    </h4>

                    <p className="text-xs text-[#725D6B] leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#FBF0F4] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8E7583] block">Equivalente</span>
                      <span className="text-sm font-bold text-[#271A22] tabular-nums">
                        {formatCOP(reward.discountCOP)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleClaimReward(reward.id, reward.pointsRequired, reward.discountCOP)}
                      disabled={!canAfford}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-[#C59B27] text-white hover:bg-[#B58A1C]'
                          : 'bg-[#FDF2F4] text-[#B09FA9] cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Canjear Ahora' : 'Puntos Insuficientes'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
