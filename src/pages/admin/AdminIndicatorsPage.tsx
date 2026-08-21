import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, Sparkles, Save, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { Indicator } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';

const AVAILABLE_ICONS = [
  'TrendingUp',
  'Award',
  'Users',
  'CheckCircle2',
  'GraduationCap',
  'HeartPulse',
  'ShieldCheck',
  'Coins',
  'Building2',
  'Briefcase',
  'Star',
  'Zap'
];

export const AdminIndicatorsPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Indicator>>({
    value: '',
    title: '',
    description: '',
    icon: 'TrendingUp',
    display_order: 1,
    is_active: true,
  });

  const loadIndicators = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getIndicators(currentSite.id);
    setIndicators(data);
    setLoading(false);
  };

  useEffect(() => {
    loadIndicators();
  }, [currentSite?.id]);

  const handleOpenCreate = () => {
    setSelectedIndicator(null);
    setForm({
      value: '',
      title: '',
      description: '',
      icon: 'TrendingUp',
      display_order: indicators.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Indicator) => {
    setSelectedIndicator(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (selectedIndicator) {
      await dataStore.updateIndicator({
        ...selectedIndicator,
        ...form,
      } as Indicator);
    } else {
      await dataStore.createIndicator({
        ...form,
        site_id: currentSite.id,
      } as any);
    }

    setModalOpen(false);
    loadIndicators();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await dataStore.deleteIndicator(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadIndicators();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Indicadores e Métricas (KPIs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Cadastre os números de destaque da campanha (projetos entregues, recursos investidos, aprovação).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Indicador</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando indicadores...</p>
        </div>
      ) : indicators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.map((ind) => {
            const IconComp = (Icons as any)[ind.icon] || Icons.TrendingUp;
            return (
              <div
                key={ind.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <StatusBadge active={ind.is_active} />
                  </div>

                  <div>
                    <span className="text-2xl font-black text-slate-900 block">{ind.value}</span>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{ind.title}</h4>
                    {ind.description && (
                      <p className="text-xs text-slate-500 mt-1">{ind.description}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Ordem: {ind.display_order}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ind)}
                      className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItemToDelete(ind.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-sm font-bold text-slate-700">Nenhum indicador cadastrado</p>
          <p className="text-xs text-slate-500 mt-1">Adicione métricas de impacto para demonstrar resultados aos eleitores.</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedIndicator ? 'Editar Indicador' : 'Novo Indicador'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Valor em Destaque *
            </label>
            <input
              type="text"
              required
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="Ex: R$ 42M+, 1.200+, 98%"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Título / Rótulo do Indicador *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Investidos em Saúde e UBSs"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Descrição Complementar (Opcional)
            </label>
            <input
              type="text"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Recursos federais e estaduais garantidos"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Ícone Representativo
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((iconName) => {
                const Icon = (Icons as any)[iconName] || Icons.TrendingUp;
                const isSelected = form.icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setForm({ ...form, icon: iconName })}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50 text-sky-600 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] truncate max-w-[60px]">{iconName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Ordem de Exibição
              </label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-700">Ativo no site público</span>
              </label>
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
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Salvar Indicador
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Indicador"
        description="Tem certeza que deseja remover este indicador? Esta ação não poderá ser desfeita."
      />
    </div>
  );
};
