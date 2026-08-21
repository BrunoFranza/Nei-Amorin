import React, { useEffect, useState } from 'react';
import { User, Save, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { AboutSection } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminAboutPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!currentSite) return;
    const loadAbout = async () => {
      setLoading(true);
      const data = await dataStore.getAbout(currentSite.id);
      setAbout(data);
      setLoading(false);
    };
    loadAbout();
  }, [currentSite?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;
    setSaving(true);
    try {
      await dataStore.updateAbout(about);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  if (loading || !about) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Carregando dados da biografia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sobre o Candidato & Biografia
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Apresente a história de vida, formação profissional, trajetória pública e princípios do candidato.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Biografia salva com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Título da Seção *
            </label>
            <input
              type="text"
              required
              value={about.title}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Biografia Principal *
            </label>
            <textarea
              required
              rows={5}
              value={about.biography}
              onChange={(e) => setAbout({ ...about, biography: e.target.value })}
              placeholder="Descreva a história e vocação do candidato..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Histórico / Trajetória Pública
            </label>
            <textarea
              rows={4}
              value={about.trajectory || ''}
              onChange={(e) => setAbout({ ...about, trajectory: e.target.value })}
              placeholder="Cargos exercidos, projetos liderados, histórico acadêmico..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Citação em Destaque (Frase de Efeito)
            </label>
            <input
              type="text"
              value={about.quote || ''}
              onChange={(e) => setAbout({ ...about, quote: e.target.value })}
              placeholder="Ex: Não há transformação real sem escuta atenta da nossa população."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={about.is_active}
                onChange={(e) => setAbout({ ...about, is_active: e.target.checked })}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-700">Exibir seção 'Sobre' na página inicial</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Biografia'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sky-600" />
              <span>Foto do Perfil / Trajetória</span>
            </h3>
            <p className="text-xs text-slate-500">
              Esta foto ilustra a biografia oficial do candidato na página inicial e institucional.
            </p>

            <ImageUploader
              currentImageUrl={about.image_url}
              folder="about"
              onUploadSuccess={(url) => setAbout({ ...about, image_url: url })}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
