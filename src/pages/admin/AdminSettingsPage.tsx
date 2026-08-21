import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { SiteSettings } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminSettingsPage: React.FC = () => {
  const { currentSite, siteSettings, refreshTenantData, themeSettings } = useTenant();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (siteSettings) {
      setSettings(siteSettings);
      setLoading(false);
    }
  }, [siteSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await dataStore.updateSiteSettings(settings);
      await refreshTenantData();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  if (loading || !settings) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Carregando configurações gerais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Configurações Gerais & Legais da Campanha
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Defina o número eleitoral, coligação, partido, CNPJ e informações de conformidade eleitoral do TSE.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nome de Urna do Candidato *
              </label>
              <input
                type="text"
                required
                value={settings.candidate_name}
                onChange={(e) => setSettings({ ...settings, candidate_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Número de Urna (TSE) *
              </label>
              <input
                type="text"
                required
                value={settings.candidate_number}
                onChange={(e) => setSettings({ ...settings, candidate_number: e.target.value })}
                placeholder="Ex: 77000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cargo Pleiteado *
              </label>
              <input
                type="text"
                required
                value={settings.position}
                onChange={(e) => setSettings({ ...settings, position: e.target.value })}
                placeholder="Ex: Deputado Estadual, Prefeito, Deputada Federal"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sigla do Partido *
              </label>
              <input
                type="text"
                required
                value={settings.party}
                onChange={(e) => setSettings({ ...settings, party: e.target.value })}
                placeholder="Ex: PSB, UNIÃO, PSD"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Coligação Partidária / Federação
            </label>
            <input
              type="text"
              value={settings.coalition || ''}
              onChange={(e) => setSettings({ ...settings, coalition: e.target.value })}
              placeholder="Ex: Coligação 'O Futuro É Agora' (PSB / UNIÃO / PSD)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Município Principal
              </label>
              <input
                type="text"
                value={settings.municipality || ''}
                onChange={(e) => setSettings({ ...settings, municipality: e.target.value })}
                placeholder="Ex: São Paulo"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Estado (UF)
              </label>
              <input
                type="text"
                value={settings.state || ''}
                onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                placeholder="SP"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Slogan Oficial da Campanha
            </label>
            <input
              type="text"
              value={settings.slogan || ''}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              placeholder="Ex: Experiência, Coragem e Trabalho Sério por São Paulo"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          {/* Legal / CNPJ */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Conformidade Legal & Resoluções do TSE</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                CNPJ da Campanha Eleitoral
              </label>
              <input
                type="text"
                value={settings.cnpj || ''}
                onChange={(e) => setSettings({ ...settings, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Texto de Informações Legais (Rodapé)
              </label>
              <textarea
                rows={2}
                value={settings.legal_information || ''}
                onChange={(e) => setSettings({ ...settings, legal_information: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
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
              <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
            </button>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sky-600" />
              <span>Logo Oficial da Campanha (Supabase Storage)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Formato PNG ou SVG com fundo transparente para exibição no cabeçalho do site.
            </p>

            <ImageUploader
              currentImageUrl={settings.logo_url}
              folder="logo"
              onUploadSuccess={(url) => setSettings({ ...settings, logo_url: url })}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
