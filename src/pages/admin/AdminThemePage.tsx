import React, { useEffect, useState } from 'react';
import { Palette, Save, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { ThemeSettings } from '../../types';

const THEME_PRESETS = [
  {
    id: 'moderno',
    name: 'Moderno & Dinâmico',
    description: 'Azul vibrante e âmbar enérgico, ideal para renovação e juventude.',
    primary_color: '#0284c7',
    secondary_color: '#0f172a',
    accent_color: '#f59e0b',
    button_style: 'rounded-full',
  },
  {
    id: 'elegante',
    name: 'Elegante & Sustentável',
    description: 'Verde esmeralda sofisticado e ouro nobre, ideal para causas ambientais e transparência.',
    primary_color: '#059669',
    secondary_color: '#064e3b',
    accent_color: '#d97706',
    button_style: 'rounded-xl',
  },
  {
    id: 'institucional',
    name: 'Institucional & Seguro',
    description: 'Azul marinho profundo e rubi clássico, transmite solidez e experiência pública.',
    primary_color: '#1e3a8a',
    secondary_color: '#0f172a',
    accent_color: '#e11d48',
    button_style: 'rounded-md',
  },
  {
    id: 'progressista',
    name: 'Inovador & Acolhedor',
    description: 'Púrpura real e coral moderno, comunica pluralidade e futuro.',
    primary_color: '#7c3aed',
    secondary_color: '#1e1b4b',
    accent_color: '#f43f5e',
    button_style: 'rounded-2xl',
  },
];

export const AdminThemePage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!currentSite) return;
    const loadTheme = async () => {
      setLoading(true);
      const data = await dataStore.getThemeSettings(currentSite.id);
      setTheme(data);
      setLoading(false);
    };
    loadTheme();
  }, [currentSite?.id]);

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    if (!theme) return;
    setTheme({
      ...theme,
      theme_name: preset.name,
      primary_color: preset.primary_color,
      secondary_color: preset.secondary_color,
      accent_color: preset.accent_color,
      button_style: preset.button_style,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;
    setSaving(true);
    try {
      await dataStore.updateThemeSettings(theme);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !theme) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Carregando configurações de tema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Aparência, Cores & Identidade Visual
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Personalize a identidade visual e as cores do site público com paletas completas e pré-visualização instantânea.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Tema salvo com sucesso!</span>
          </div>
        )}
      </div>

      {/* Preset Theme Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Paletas e Presets Prontos</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {THEME_PRESETS.map((p) => {
            const isCurrent = theme.primary_color === p.primary_color && theme.accent_color === p.accent_color;
            return (
              <div
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`p-4 rounded-2xl border bg-white cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'border-sky-600 ring-2 ring-sky-500/20 shadow-sm'
                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary_color }} />
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.secondary_color }} />
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent_color }} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{p.description}</p>
                </div>

                <button
                  type="button"
                  className={`w-full py-1.5 text-xs font-bold rounded-xl transition-colors ${
                    isCurrent
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isCurrent ? 'Tema Ativo' : 'Aplicar Paleta'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Theme Editor */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900">
            Ajuste Fino de Cores e Estilos
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cor Primária *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primary_color}
                    onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.primary_color}
                    onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cor Secundária *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.secondary_color}
                    onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.secondary_color}
                    onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cor de Destaque / Número *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accent_color}
                    onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.accent_color}
                    onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Família Tipográfica
              </label>
              <select
                value={theme.font_family}
                onChange={(e) => setTheme({ ...theme, font_family: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              >
                <option value="Inter, system-ui, sans-serif">Inter (Clássico, Moderno & Neutro)</option>
                <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Geométrico & Premium)</option>
                <option value="'Outfit', sans-serif">Outfit (Impactante & Limpo)</option>
                <option value="'Playfair Display', serif">Playfair Display (Elegante & Nobre)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Formato dos Botões
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Pílula (Full)', val: 'rounded-full' },
                  { label: 'Arredondado (XL)', val: 'rounded-2xl' },
                  { label: 'Médio (LG)', val: 'rounded-xl' },
                  { label: 'Reto (MD)', val: 'rounded-md' },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setTheme({ ...theme, button_style: s.val })}
                    className={`py-2 px-3 text-xs font-bold border transition-all ${
                      theme.button_style === s.val
                        ? 'border-sky-600 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    } ${s.val}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: theme.primary_color }}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Configurações Visuais'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Theme Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Prévia dos Componentes em Tempo Real
          </h3>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Candidato Exemplo</span>
              <span
                className="px-2.5 py-1 text-xs font-extrabold text-white rounded-lg shadow-2xs"
                style={{ backgroundColor: theme.accent_color }}
              >
                77000
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                className={`w-full py-3 text-sm font-bold text-white shadow-sm transition-all ${theme.button_style}`}
                style={{ backgroundColor: theme.primary_color }}
              >
                Botão Primário (CTA Principal)
              </button>

              <button
                type="button"
                className={`w-full py-3 text-sm font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition-all ${theme.button_style}`}
              >
                Botão Secundário (Transparente)
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: theme.primary_color }}
              >
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Card de Indicador / Meta</p>
                <p className="text-[11px] text-slate-500">Métrica representativa no layout</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
