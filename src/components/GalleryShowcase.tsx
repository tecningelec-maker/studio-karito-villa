import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { ArrowRight, Eye, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'rusa' | 'editorial' | 'spa';
  categoryLabel: string;
  image: string;
  description: string;
  serviceId: string;
}

export const GalleryShowcase: React.FC = () => {
  const { startBookingWithService } = useSalon();
  const [activeFilter, setActiveFilter] = useState<'all' | 'rusa' | 'editorial' | 'spa'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Manicura Rusa Nude & Láminas de Oro 24K',
      category: 'editorial',
      categoryLabel: 'Nail Art Editorial',
      image: '/src/assets/images/nail_art_russian_manicure_1794503671768.jpg',
      description: 'Lámina ungueal perfectamente nivelada con base rubber rosa translúcido y finos toques orgánicos de pan de oro.',
      serviceId: 'manicura-rusa-semi',
    },
    {
      id: 'g-2',
      title: 'Escultural Almendra & Cristalería Fina',
      category: 'editorial',
      categoryLabel: 'Sistemas Esculpidos',
      image: '/src/assets/images/nail_art_sculpted_luxury_1794503672826.jpg',
      description: 'Estructura escultural de acrílico con líneas geométricas doradas y micropiedras Swarovski que reflejan la luz con pureza.',
      serviceId: 'esculpidas-acrilico-luxury',
    },
    {
      id: 'g-3',
      title: 'Spa Pedicura con Pétalos & Parafina de Rosas',
      category: 'spa',
      categoryLabel: 'Spa & Cuidado',
      image: '/src/assets/images/pedicure_spa_luxury_1794503671904.jpg',
      description: 'Ritual relajante para descanso absoluto: sales del Mar Muerto, hidratación con parafina caliente y esmaltado semipermanente de larga duración.',
      serviceId: 'spa-pedicura-rosa-oro',
    },
    {
      id: 'g-4',
      title: 'Instalaciones & Estaciones Karito Villa',
      category: 'rusa',
      categoryLabel: 'El Estudio',
      image: '/src/assets/images/hero_karito_villa_studio_1794503670921.jpg',
      description: 'Espacio diseñado con tonalidades rosa pastel, detalles en oro cepillado y comodidades prémium para consentirte.',
      serviceId: 'manicura-rusa-semi',
    },
  ];

  const filtered = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter((i) => i.category === activeFilter);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FCE6EE] to-[#FADCE6] border-t border-[#F3C5D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#B88918] block mb-2">
            Portafolio de Autor
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2E1621] tracking-tight [text-wrap:balance]">
            Inspiración en cada trazo y detalle
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5C3445]">
            Explora algunos de los trabajos realizados por Karito Villa y nuestro equipo de artistas máster.
          </p>

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'Todo el Portafolio' },
              { id: 'editorial', label: 'Arte Editorial & Oro' },
              { id: 'spa', label: 'Spa Terapéutico' },
              { id: 'rusa', label: 'El Estudio' },
            ].map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#6E2C47] text-white shadow-xs'
                      : 'bg-[#FFF8FA] text-[#5C3445] border border-[#F0BDD0] hover:bg-[#FCE4EC]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#FFF8FA] rounded-2xl overflow-hidden border border-[#F3C5D6] shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <div className="h-72 w-full overflow-hidden bg-[#FCE4EC] relative">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D1827]/85 via-[#3D1827]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2D98D]">
                    {item.categoryLabel}
                  </span>
                  <h4 className="font-editorial text-lg font-bold leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-3 py-1.5 bg-white/25 hover:bg-white/35 backdrop-blur-xs rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Ampliado</span>
                    </button>
                    <button
                      onClick={() => startBookingWithService(item.serviceId)}
                      className="px-3 py-1.5 bg-[#C59B27] hover:bg-[#B58A1C] rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Agendar</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:hidden bg-[#FFF8FA]">
                <h4 className="text-xs font-bold text-[#2E1621]">{item.title}</h4>
                <button
                  onClick={() => startBookingWithService(item.serviceId)}
                  className="mt-2 text-xs text-[#B88918] font-semibold flex items-center gap-1"
                >
                  <span>Agendar este diseño</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Zoom */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E1621]/65 backdrop-blur-xs p-4">
          <div className="bg-[#FFF8FA] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#F3C5D6] space-y-4">
            <div className="relative h-80 bg-[#3D1827]">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 p-1.5 bg-[#3D1827]/70 text-white rounded-full hover:bg-[#3D1827]/90 cursor-pointer"
                aria-label="Cerrar imagen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 pt-2 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B88918]">
                {selectedItem.categoryLabel}
              </span>
              <h3 className="font-editorial text-2xl font-bold text-[#2E1621]">
                {selectedItem.title}
              </h3>
              <p className="text-xs text-[#5C3445] leading-relaxed">
                {selectedItem.description}
              </p>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-2.5 text-xs font-medium text-[#5C3445] bg-[#FCE4EC] border border-[#EBB8CB] rounded-lg hover:bg-[#FAD4E1] cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    const sid = selectedItem.serviceId;
                    setSelectedItem(null);
                    startBookingWithService(sid);
                  }}
                  className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C59B27] to-[#AD8218] rounded-lg shadow-sm hover:from-[#B58A1C] hover:to-[#976F12] cursor-pointer"
                >
                  Agendar este Diseño
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
