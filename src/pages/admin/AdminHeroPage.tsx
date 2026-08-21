import React, { useEffect, useState } from 'react';
import { Sparkles, Save, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { HeroSection } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminHeroPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!currentSite) return;
    const loadHero = async () => {
      setLoading(true);
      const data = await dataStore.getHero(currentSite.id);
      setHero(data);
      setLoading(false);
    };
    loadHero();
  }, [currentSite?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setSaving(true);
    try {
      await dataStore.updateHero(hero);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  if (loading || !hero) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Carregando dados do Hero...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Candidato & Seção Hero
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Configure a foto oficial principal, títulos de destaque, slogan e botões de chamada para ação (CTAs).
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Alterações salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nome de Urna do Candidato *
              </label>
              <input
                type="text"
                required
                value={hero.candidate_name}
                onChange={(e) => setHero({ ...hero, candidate_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Título de Destaque no Hero *
              </label>
              <input
                type="text"
                required
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="Ex: Trabalho, Verdade e Futuro para Nossa Gente"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Subtítulo / Descrição Resumida
              </label>
              <textarea
                rows={3}
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Texto do Badge / Selo Superior
              </label>
              <input
                type="text"
                value={hero.badge_text || ''}
                onChange={(e) => setHero({ ...hero, badge_text: e.target.value })}
                placeholder="Ex: Campanha Oficial 2026"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Texto do Botão Primário
                </label>
                <input
                  type="text"
                  value={hero.primary_button_text}
                  onChange={(e) => setHero({ ...hero, primary_button_text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link do Botão Primário
                </label>
                <input
                  type="text"
                  value={hero.primary_button_url}
                  onChange={(e) => setHero({ ...hero, primary_button_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Texto do Botão Secundário
                </label>
                <input
                  type="text"
                  value={hero.secondary_button_text}
                  onChange={(e) => setHero({ ...hero, secondary_button_text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link do Botão Secundário
                </label>
                <input
                  type="text"
                  value={hero.secondary_button_url}
                  onChange={(e) => setHero({ ...hero, secondary_button_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Image Upload & Storage */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sky-600" />
              <span>Foto Oficial do Hero (Supabase Storage)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Recomendamos uma foto em alta definição com enquadramento vertical ou de meio-corpo.
            </p>

            <ImageUploader
              currentImageUrl={hero.image_url}
              folder="hero"
              onUploadSuccess={(url) => setHero({ ...hero, image_url: url })}
            />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Vídeo de Fundo no Hero (Loop Silencioso)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Caminho local (ex: <code className="text-sky-600 font-mono">/hero.mp4</code>) ou link direto de vídeo MP4 em nuvem.
            </p>
            <input
              type="text"
              placeholder="/hero.mp4"
              value={hero.background_video_url || ''}
              onChange={(e) => setHero({ ...hero, background_video_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
