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
    <section className="py-16 sm:py-20 bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C59B27] block mb-2">
            Catálogo Exclusivo
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#271A22] tracking-tight">
            Servicios diseñados para realzar tu distinción
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#725D6B] font-light leading-relaxed">
            Cada tratamiento incluye preparación higiénica de alta gama, productos prémium importados y garantía de durabilidad.
          </p>

          {/* Interactive Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#FDF2F4] rounded-xl border border-[#FAD3DF] max-w-2xl mx-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-[#271A22] font-semibold shadow-sm border border-[#F4CEDF]'
                      : 'text-[#725D6B] hover:text-[#271A22]'
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
              className="group bg-white rounded-2xl border border-[#F7E5EC] overflow-hidden hover:shadow-xl hover:border-[#F2CBDD] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Slot */}
                <div className="relative h-56 w-full overflow-hidden bg-[#FDF2F4]">
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
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-[#E7C970]" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#A67D1C] font-medium uppercase tracking-wider mb-2">
                    <span>{service.category.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>+{service.pointsEarned} pts VIP</span>
                  </div>

                  <h3 className="font-editorial text-2xl font-semibold text-[#271A22] leading-snug mb-2 group-hover:text-[#C59B27] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#5A4552] line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Key Perks */}
                  <div className="space-y-1.5 pt-2 border-t border-[#FBF0F4]">
                    {service.perks.slice(0, 3).map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#725D6B]">
                        <Check className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0 mt-2">
                <div className="bg-[#FFFDFB] p-3 rounded-xl border border-[#F7E5EC] mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8E7583] block">Valor Total</span>
                    <span className="text-lg font-bold text-[#271A22] font-serif tabular-nums">
                      {formatCOP(service.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#A67D1C] font-medium block">Abono requerido</span>
                    <span className="text-sm font-semibold text-[#C59B27] tabular-nums">
                      {formatCOP(service.depositAmount)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDetailsModalService(service)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#5A4552] bg-[#FDF2F4] rounded-lg hover:bg-[#FBE4ED] transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-[#A67D1C]" />
                    <span>Ver Detalles</span>
                  </button>

                  <button
                    onClick={() => startBookingWithService(service.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#B3871E] rounded-lg hover:from-[#B58A1C] hover:to-[#9F7414] shadow-sm transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FAD3DF]">
            <div className="relative h-48 bg-[#FDF2F4]">
              <img
                src={detailsModalService.image}
                alt={detailsModalService.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailsModalService(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">
                  {detailsModalService.category} · {detailsModalService.durationMinutes} minutos
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#271A22] mt-1">
                  {detailsModalService.name}
                </h3>
              </div>

              <p className="text-sm text-[#5A4552] leading-relaxed">
                {detailsModalService.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#271A22] mb-2">
                  Lo que incluye tu cita:
                </h4>
                <div className="space-y-1.5">
                  {detailsModalService.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#5A4552]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FFF9FA] rounded-xl border border-[#FAD3DF] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8E7583] block">Inversión Total</span>
                  <span className="text-xl font-bold text-[#271A22] font-serif tabular-nums">
                    {formatCOP(detailsModalService.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#A67D1C] font-semibold block">Abono Inicial</span>
                  <span className="text-sm font-bold text-[#C59B27] tabular-nums">
                    {formatCOP(detailsModalService.depositAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDetailsModalService(null)}
                  className="flex-1 py-3 text-xs font-semibold text-[#5A4552] border border-[#EACBD9] rounded-lg hover:bg-[#FDF2F4]"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    const id = detailsModalService.id;
                    setDetailsModalService(null);
                    startBookingWithService(id);
                  }}
                  className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#C59B27] rounded-lg shadow-sm hover:bg-[#B68B1F]"
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
