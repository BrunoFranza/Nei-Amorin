import React, { useEffect, useState } from 'react';
import { Plus, Globe, ExternalLink, Layers, CheckCircle2, Shield, Sparkles, Building2 } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { Site } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminSitesPage: React.FC = () => {
  const { sites, currentSite, setCurrentSite, isSuperAdmin, themeSettings, refreshTenantData } = useTenant();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    custom_domain: '',
    candidate_name: '',
    candidate_number: '',
    party: '',
    position: 'Deputado Estadual',
  });

  const generateSlug = (text: string) => {
    return (
      'site-' +
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: generateSlug(name),
      candidate_name: name,
    });
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return;

    const newSite = await dataStore.createSite({
      name: form.name,
      slug: form.slug,
      custom_domain: form.custom_domain || undefined,
      is_active: true,
    });

    // Also bootstrap site_settings
    await dataStore.updateSiteSettings({
      id: `settings-${newSite.id}`,
      site_id: newSite.id,
      candidate_name: form.candidate_name || form.name,
      candidate_number: form.candidate_number || '10000',
      party: form.party || 'PARTIDO',
      position: form.position,
      legal_information: `Eleição 2026 • Campanha de ${form.candidate_name}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await refreshTenantData();
    setCurrentSite(newSite);
    setModalOpen(false);
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gerenciador de Tenants (Sites Multi-Campanha)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Provisione novos sites de campanha independentes na plataforma White-Label com isolamento absoluto via RLS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Provisionar Novo Site / Cliente</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-[11px] border border-sky-500/30">
              Arquitetura White-Label Multi-Tenant
            </span>
            <span className="text-xs text-slate-300 font-medium">PostgreSQL + Supabase RLS</span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Cada site possui seu próprio identificador <code className="text-sky-300 font-mono">site_id</code>. Todas as queries de propostas, fotos, notícias e métricas são blindadas no banco de dados.
          </p>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => {
          const isSelected = currentSite?.id === site.id;
          return (
            <div
              key={site.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
                isSelected
                  ? 'border-sky-600 ring-2 ring-sky-500/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      <Building2 className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {site.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-500">/{site.slug}</span>
                    </div>
                  </div>
                  <StatusBadge active={site.is_active} />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Domínio / Host:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {site.custom_domain || `${site.slug}.campanha.digital`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">ID do Tenant:</span>
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[120px]">
                      {site.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentSite(site)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isSelected ? '✓ Gerenciando Este Site' : 'Alternar para Este Site'}
                </button>

                <a
                  href={`/?tenant=${site.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-xl transition-colors"
                  title="Abrir site público"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provision New Site Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Provisionar Novo Site de Campanha (Tenant)"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nome da Campanha / Candidato *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Ney Amorim 2026"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Slug do Tenant (URL) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Domínio Próprio (Opcional)
              </label>
              <input
                type="text"
                value={form.custom_domain}
                onChange={(e) => setForm({ ...form, custom_domain: e.target.value })}
                placeholder="neyamorim.com.br"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Número de Urna
              </label>
              <input
                type="text"
                value={form.candidate_number}
                onChange={(e) => setForm({ ...form, candidate_number: e.target.value })}
                placeholder="Ex: 40123"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Partido
              </label>
              <input
                type="text"
                value={form.party}
                onChange={(e) => setForm({ ...form, party: e.target.value })}
                placeholder="Ex: PSB"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cargo
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Deputado"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Criar e Ativar Site
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
