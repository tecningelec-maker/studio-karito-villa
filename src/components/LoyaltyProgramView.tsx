import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { formatCOP } from '../utils/formatters';
import {
  Award,
  Crown,
  Sparkles,
  CheckCircle2,
  Clock,
  Phone,
} from 'lucide-react';

export const LoyaltyProgramView: React.FC = () => {
  const {
    loyaltyRewards,
    getLoyaltyProfile,
    redeemPointsForDiscount,
    showToast,
  } = useSalon();

  const [phoneSearch, setPhoneSearch] = useState('3128945672');
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

  const handleClaimReward = (requiredPoints: number, discountCOP: number) => {
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
    <div className="py-12 sm:py-16 bg-gradient-to-b from-[#FDF0F4] to-[#FCE4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FCF9EE] border border-[#F3DF9A] rounded-full mb-3">
            <Award className="w-4 h-4 text-[#C59B27]" />
            <span className="text-xs font-semibold text-[#845F16] tracking-wide uppercase">
              Club VIP Karito Villa
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2E1621] tracking-tight [text-wrap:balance]">
            Premia tu fidelidad con tratamientos exclusivos
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5C3445] font-light">
            Gana 1 punto por cada $1.000 COP invertidos en tu belleza. Canjea descuentos directos, diseños de autor y servicios gratuitos.
          </p>
        </div>

        {/* Client Wallet Search Box */}
        <div className="max-w-2xl mx-auto bg-[#FFF8FA] rounded-2xl border border-[#F3C5D6] p-6 shadow-md">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E1621] mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C59B27]" />
            <span>Consulta tu Billetera de Puntos & Nivel VIP:</span>
          </h3>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="tel"
              placeholder="Ingresa tu número de WhatsApp (Ej: 3128945672)"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#FFFBFD] border border-[#EBB8CB] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#AD8218] rounded-xl hover:from-[#B58A1C] hover:to-[#976F12] transition-colors cursor-pointer"
            >
              Consultar
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#5C3445]">
            <span>Pruebas rápidas:</span>
            <button
              type="button"
              onClick={() => {
                setPhoneSearch('3128945672');
                setActiveProfile(getLoyaltyProfile('3128945672'));
              }}
              className="text-[#9E7114] font-semibold hover:underline cursor-pointer"
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
              className="text-[#9E7114] font-semibold hover:underline cursor-pointer"
            >
              Daniela (650 pts - Diamante)
            </button>
          </div>
        </div>

        {/* Active Member Status Card */}
        {activeProfile && (
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FADCE6] via-[#FFF8FA] to-[#FCF6E8] rounded-3xl border-2 border-[#E7C970] p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C59B27] text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Miembro Nivel {activeProfile.tier}</span>
                </div>

                <h2 className="font-editorial text-3xl font-bold text-[#2E1621]">
                  {activeProfile.name}
                </h2>

                <p className="text-xs text-[#5C3445]">
                  WhatsApp: <strong className="text-[#2E1621]">{activeProfile.phone}</strong> · {activeProfile.totalAppointments} citas completadas en Karito Villa
                </p>

                {/* Progress bar to next tier */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-medium text-[#5C3445] mb-1">
                    <span>Progreso de Nivel</span>
                    <span>{activeProfile.points} / 500 Puntos para Nivel Diamante</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#F6C8D9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C59B27] to-[#D4AF37] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (activeProfile.points / 500) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Big Points Badge */}
              <div className="bg-[#FFF8FA] p-6 rounded-2xl border border-[#F3C5D6] text-center shadow-sm">
                <span className="text-xs uppercase tracking-wider text-[#9E7114] font-semibold block">
                  Puntos Disponibles
                </span>
                <span className="font-serif text-5xl font-bold text-[#B88918] block my-1 tabular-nums">
                  {activeProfile.points}
                </span>
                <span className="text-[11px] text-[#5C3445] block">
                  Equivalente a hasta {formatCOP(Math.floor(activeProfile.points / 5) * 1000)} en beneficios
                </span>
              </div>
            </div>

            {/* Points History */}
            {activeProfile.history.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#F0BDD0]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E1621] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C59B27]" />
                  <span>Historial de Movimientos Recientes</span>
                </h4>

                <div className="space-y-2">
                  {activeProfile.history.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between text-xs py-2.5 px-3.5 bg-[#FFF8FA]/85 rounded-lg border border-[#F3C5D6]"
                    >
                      <div>
                        <span className="font-medium text-[#2E1621] block">{tx.description}</span>
                        <span className="text-[10px] text-[#785163]">{tx.date}</span>
                      </div>
                      <span
                        className={`font-bold tabular-nums ${
                          tx.points > 0 ? 'text-emerald-700' : 'text-rose-700'
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
          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#2E1621] text-center mb-8">
            Niveles de Membresía VIP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-[#FFF8FA] rounded-2xl border border-[#F3C5D6] p-6 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FADCE6] flex items-center justify-center text-[#B83B6B]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#785163] font-semibold uppercase tracking-wider">0 a 199 Puntos</span>
                <h4 className="text-xl font-bold text-[#2E1621] font-serif">Rosa Pastel</h4>
              </div>
              <ul className="text-xs text-[#5C3445] space-y-2">
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
            <div className="bg-gradient-to-b from-[#FCF6E8] to-[#FFF8FA] rounded-2xl border-2 border-[#C59B27] p-6 text-left space-y-4 shadow-md relative">
              <div className="absolute -top-3 right-4 bg-[#C59B27] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Más Popular
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F7EFCF] flex items-center justify-center text-[#B88918]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#9E7114] font-semibold uppercase tracking-wider">200 a 499 Puntos</span>
                <h4 className="text-xl font-bold text-[#2E1621] font-serif">Oro Rosa</h4>
              </div>
              <ul className="text-xs text-[#5C3445] space-y-2">
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
            <div className="bg-[#FFF8FA] rounded-2xl border border-[#F3C5D6] p-6 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FADCE6] flex items-center justify-center text-[#6E2C47]">
                <Crown className="w-5 h-5 text-[#B88918]" />
              </div>
              <div>
                <span className="text-xs text-[#785163] font-semibold uppercase tracking-wider">500+ Puntos</span>
                <h4 className="text-xl font-bold text-[#2E1621] font-serif">Diamante Karito</h4>
              </div>
              <ul className="text-xs text-[#5C3445] space-y-2">
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
            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#2E1621]">
              Catálogo de Recompensas Disponibles
            </h3>
            <p className="text-xs sm:text-sm text-[#5C3445] mt-1">
              Canjea tus puntos para obtener descuentos inmediatos o añadirlos a tu próxima cita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyaltyRewards.map((reward) => {
              const canAfford = activeProfile ? activeProfile.points >= reward.pointsRequired : false;
              return (
                <div
                  key={reward.id}
                  className="bg-[#FFF8FA] rounded-2xl border border-[#F3C5D6] p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#9E7114] uppercase tracking-wider">
                        {reward.tag}
                      </span>
                      <span className="text-xs font-bold text-[#B88918] tabular-nums">
                        {reward.pointsRequired} Puntos
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#2E1621] mb-1">
                      {reward.title}
                    </h4>

                    <p className="text-xs text-[#5C3445] leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#F7DCE6] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#785163] block">Equivalente</span>
                      <span className="text-sm font-bold text-[#2E1621] tabular-nums">
                        {formatCOP(reward.discountCOP)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleClaimReward(reward.pointsRequired, reward.discountCOP)}
                      disabled={!canAfford}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-gradient-to-r from-[#C59B27] to-[#AD8218] text-white hover:from-[#B58A1C] hover:to-[#976F12]'
                          : 'bg-[#FADCE6] text-[#9E7887] cursor-not-allowed'
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
