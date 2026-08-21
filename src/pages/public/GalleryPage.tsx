import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { GalleryItem } from '../../types';
import { GalleryGrid } from '../../components/public/GalleryGrid';

export const GalleryPage: React.FC = () => {
  const { currentSite } = useTenant();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;
    const loadGallery = async () => {
      setLoading(true);
      try {
        const data = await dataStore.getGallery(currentSite.id, true);
        setGallery(data);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, [currentSite?.id]);

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-xs font-bold text-sky-700 border border-sky-100">
          <Camera className="w-3.5 h-3.5" />
          <span>Registros e Imagens</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Galeria de Fotos da Campanha
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Momentos com o povo, visitas aos bairros, reuniões de trabalho e atos de mobilização popular.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando galeria...</p>
        </div>
      ) : (
        <GalleryGrid items={gallery} />
      )}
    </div>
  );
};
