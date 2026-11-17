import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Service, ServiceCategory } from '../types';
import { formatCOP } from '../utils/formatters';
import { Clock, Check, ArrowRight, Sparkles, Info, X } from 'lucide-react';

export const ServiceCatalog: React.FC = () => {
  const { services, startBookingWithService } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('todos');
  const [detailsModalService, setDetailsModalService] = useState<Service | null>(null);

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'todos', label: 'Todos los Servicios' },
    { id: 'manicura', label: 'Manicura Rusa & Semipermanente' },
    { id: 'esculpidas', label: 'Sistemas Esculpidos (Gel & Acrílico)' },
    { id: 'pedicura', label: 'Spa Pedicura Terapéutica' },
    { id: 'nail_art', label: 'Nail Art de Autor' },
  ];

  const filteredServices = selectedCategory === 'todos'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <section className="py-16 sm:py-20 bg-[#FDF0F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#B88918] block mb-2">
            Catálogo Exclusivo
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2E1621] tracking-tight [text-wrap:balance]">
            Servicios diseñados para realzar tu distinción
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5C3445] font-light leading-relaxed">
            Cada tratamiento incluye preparación higiénica de alta gama, productos prémium importados y garantía de durabilidad.
          </p>

          {/* Interactive Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#FADDE7] rounded-xl border border-[#F0BDD0] max-w-2xl mx-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#FFF8FA] text-[#2E1621] font-semibold shadow-sm border border-[#EBB8CB]'
                      : 'text-[#5C3445] hover:text-[#2E1621]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Product/Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-[#FFF8FA] rounded-2xl border border-[#F3C5D6] overflow-hidden hover:shadow-xl hover:border-[#E79DB9] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Slot */}
                <div className="relative h-56 w-full overflow-hidden bg-[#FCE4EC]">
                  <img
                    src={service.image}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {service.popular && (
                    <div className="absolute top-3 left-3 bg-[#C59B27] text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                      Más Solicitado
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-[#3D1827]/75 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-[#E7C970]" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#9E7114] font-medium uppercase tracking-wider mb-2">
                    <span>{service.category.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>+{service.pointsEarned} pts VIP</span>
                  </div>

                  <h3 className="font-editorial text-2xl font-semibold text-[#2E1621] leading-snug mb-2 group-hover:text-[#B88918] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#5C3445] line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Key Perks */}
                  <div className="space-y-1.5 pt-2 border-t border-[#F7DCE6]">
                    {service.perks.slice(0, 3).map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#6E4557]">
                        <Check className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0 mt-2">
                <div className="bg-[#FCE8EF] p-3 rounded-xl border border-[#F3C5D6] mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#785163] block">Valor Total</span>
                    <span className="text-lg font-bold text-[#2E1621] font-serif tabular-nums">
                      {formatCOP(service.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#9E7114] font-medium block">Abono requerido</span>
                    <span className="text-sm font-semibold text-[#B88918] tabular-nums">
                      {formatCOP(service.depositAmount)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDetailsModalService(service)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#5C3445] bg-[#FADCE6] rounded-lg hover:bg-[#F5C6D7] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Info className="w-3.5 h-3.5 text-[#9E7114]" />
                    <span>Ver Detalles</span>
                  </button>

                  <button
                    onClick={() => startBookingWithService(service.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#AD8218] rounded-lg hover:from-[#B58A1C] hover:to-[#976F12] shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Agendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      {detailsModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E1621]/55 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFF8FA] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#F3C5D6]">
            <div className="relative h-48 bg-[#FCE4EC]">
              <img
                src={detailsModalService.image}
                alt={detailsModalService.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailsModalService(null)}
                className="absolute top-3 right-3 p-1.5 bg-[#3D1827]/70 text-white rounded-full hover:bg-[#3D1827]/90 transition-colors cursor-pointer"
                aria-label="Cerrar detalle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B88918]">
                  {detailsModalService.category.replace('_', ' ')} · {detailsModalService.durationMinutes} minutos
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#2E1621] mt-1">
                  {detailsModalService.name}
                </h3>
              </div>

              <p className="text-sm text-[#5C3445] leading-relaxed">
                {detailsModalService.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E1621] mb-2">
                  Lo que incluye tu cita:
                </h4>
                <div className="space-y-1.5">
                  {detailsModalService.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#5C3445]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FCE8EF] rounded-xl border border-[#F3C5D6] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#785163] block">Inversión Total</span>
                  <span className="text-xl font-bold text-[#2E1621] font-serif tabular-nums">
                    {formatCOP(detailsModalService.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#9E7114] font-semibold block">Abono Inicial</span>
                  <span className="text-sm font-bold text-[#B88918] tabular-nums">
                    {formatCOP(detailsModalService.depositAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDetailsModalService(null)}
                  className="flex-1 py-3 text-xs font-semibold text-[#5C3445] bg-[#FCE4EC] border border-[#EBB8CB] rounded-lg hover:bg-[#FAD4E1] transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    const id = detailsModalService.id;
                    setDetailsModalService(null);
                    startBookingWithService(id);
                  }}
                  className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#AD8218] rounded-lg shadow-sm hover:from-[#B58A1C] hover:to-[#976F12] transition-all cursor-pointer"
                >
                  Agendar Turno Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
