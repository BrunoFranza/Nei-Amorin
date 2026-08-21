import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, Calendar, MapPin } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { ActionItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminActionsPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<ActionItem>>({
    title: '',
    description: '',
    category: 'Infraestrutura',
    date: new Date().toISOString().split('T')[0],
    municipality: '',
    image_url: '',
    external_url: '',
    display_order: 1,
    is_active: true,
  });

  const loadActions = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getActions(currentSite.id);
    setActions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadActions();
  }, [currentSite?.id]);

  const handleOpenCreate = () => {
    setSelectedAction(null);
    setForm({
      title: '',
      description: '',
      category: 'Infraestrutura',
      date: new Date().toISOString().split('T')[0],
      municipality: currentSite?.slug === 'site-mariana-dias' ? 'Campinas' : 'São Paulo',
      image_url: '',
      external_url: '',
      display_order: actions.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ActionItem) => {
    setSelectedAction(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (selectedAction) {
      await dataStore.updateAction({
        ...selectedAction,
        ...form,
      } as ActionItem);
    } else {
      await dataStore.createAction({
        ...form,
        site_id: currentSite.id,
      } as any);
    }

    setModalOpen(false);
    loadActions();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await dataStore.deleteAction(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadActions();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Atuação, Obras & Conquistas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Prestação de contas das realizações, projetos de lei e emendas destinadas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ação / Conquista</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando ações...</p>
        </div>
      ) : actions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group"
            >
              {act.image_url && (
                <div className="h-40 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={act.image_url}
                    alt={act.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                      {act.category}
                    </span>
                    <StatusBadge active={act.is_active} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {act.description}
                  </p>

                  {act.municipality && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      📍 {act.municipality} • {act.date}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Ordem: {act.display_order}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(act)}
                      className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItemToDelete(act.id);
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
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-sm font-bold text-slate-700">Nenhuma ação cadastrada</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAction ? 'Editar Ação / Conquista' : 'Nova Ação'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Título da Ação ou Conquista *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Reforma e Modernização da UPA Central"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Categoria
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Saúde, Educação, Segurança"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Data de Realização
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Município / Localidade
            </label>
            <input
              type="text"
              value={form.municipality || ''}
              onChange={(e) => setForm({ ...form, municipality: e.target.value })}
              placeholder="Ex: São Paulo - Zona Leste"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Detalhamento da Conquista *
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Explique os recursos empenhados, parcerias e impacto na população..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Foto da Ação (Supabase Storage)
            </label>
            <ImageUploader
              currentImageUrl={form.image_url}
              folder="actions"
              onUploadSuccess={(url) => setForm({ ...form, image_url: url })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link Externo (Opcional)
              </label>
              <input
                type="url"
                value={form.external_url || ''}
                onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                placeholder="https://diariooficial.gov.br/..."
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
                <span className="text-xs font-bold text-slate-700">Ativa no site</span>
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
              className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Salvar Ação
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Ação"
        description="Tem certeza que deseja remover esta ação do histórico da campanha?"
      />
    </div>
  );
};
