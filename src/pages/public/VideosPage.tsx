import React, { useEffect, useState } from 'react';
import { Youtube, Search } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { VideoItem } from '../../types';
import { VideoCard } from '../../components/public/VideoCard';

export const VideosPage: React.FC = () => {
  const { currentSite } = useTenant();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;
    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await dataStore.getVideos(currentSite.id, true);
        setVideos(data);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, [currentSite?.id]);

  const categories = Array.from(new Set(videos.map((v) => v.category).filter(Boolean)));

  const filteredVideos = videos.filter((v) => {
    return selectedCategory === 'all' || v.category === selectedCategory;
  });

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-xs font-bold text-rose-700 border border-rose-100">
          <Youtube className="w-3.5 h-3.5" />
          <span>Canal de Vídeos</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Vídeos, Entrevistas e Lives
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Acompanhe nossos pronunciamentos, debates, propostas e reportagens em vídeo.
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex justify-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos os Vídeos ({videos.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Videos grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando vídeos...</p>
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-base font-bold text-slate-700">Nenhum vídeo disponível no momento</p>
        </div>
      )}
    </div>
  );
};
