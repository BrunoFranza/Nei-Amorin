import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Layers, Tag, Image as ImageIcon } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { Proposal, ProposalCategory } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminProposalsPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [categories, setCategories] = useState<ProposalCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Proposal modal state
  const [propModalOpen, setPropModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [propForm, setPropForm] = useState<Partial<Proposal>>({
    title: '',
    description: '',
    category_id: '',
    image_url: '',
    icon: 'FileText',
    display_order: 1,
    is_active: true,
  });

  // Category modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatOrder, setNewCatOrder] = useState(1);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadData = async () => {
    if (!currentSite) return;
    setLoading(true);
    const [propData, catData] = await Promise.all([
      dataStore.getProposals(currentSite.id),
      dataStore.getProposalCategories(currentSite.id),
    ]);
    setProposals(propData);
    setCategories(catData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentSite?.id]);

  const handleOpenCreateProposal = () => {
    setSelectedProposal(null);
    setPropForm({
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      icon: 'FileText',
      display_order: proposals.length + 1,
      is_active: true,
    });
    setPropModalOpen(true);
  };

  const handleOpenEditProposal = (p: Proposal) => {
    setSelectedProposal(p);
    setPropForm(p);
    setPropModalOpen(true);
  };

  const handleSaveProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (selectedProposal) {
      await dataStore.updateProposal({
        ...selectedProposal,
        ...propForm,
      } as Proposal);
    } else {
      await dataStore.createProposal({
        ...propForm,
        site_id: currentSite.id,
      } as any);
    }

    setPropModalOpen(false);
    loadData();
  };

  const handleDeleteProposal = async () => {
    if (itemToDelete) {
      await dataStore.deleteProposal(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadData();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite || !newCatName.trim()) return;

    await dataStore.createProposalCategory({
      site_id: currentSite.id,
      name: newCatName.trim(),
      display_order: newCatOrder,
      is_active: true,
    });

    setNewCatName('');
    setCatModalOpen(false);
    loadData();
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Propostas & Eixos Programáticos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Organize o plano de metas em eixos temáticos (Saúde, Educação, Mobilidade, etc.).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCatModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-sky-600" />
            <span>Gerenciar Eixos / Categorias</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateProposal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Nova Proposta</span>
          </button>
        </div>
      </div>

      {/* Proposals List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando propostas...</p>
        </div>
      ) : proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group"
            >
              {p.image_url && (
                <div className="h-36 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                      {p.category?.name || 'Geral'}
                    </span>
                    <StatusBadge active={p.is_active} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Ordem: {p.display_order}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProposal(p)}
                      className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItemToDelete(p.id);
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
          <p className="text-sm font-bold text-slate-700">Nenhuma proposta cadastrada</p>
          <p className="text-xs text-slate-500 mt-1">Cadastre as propostas que serão divulgadas no site da campanha.</p>
        </div>
      )}

      {/* Proposal Create / Edit Modal */}
      <Modal
        isOpen={propModalOpen}
        onClose={() => setPropModalOpen(false)}
        title={selectedProposal ? 'Editar Proposta' : 'Nova Proposta'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveProposal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Título da Proposta *
            </label>
            <input
              type="text"
              required
              value={propForm.title}
              onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
              placeholder="Ex: Ampliação do Horário de Atendimento das UBSs até 22h"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Eixo / Categoria *
            </label>
            <select
              required
              value={propForm.category_id}
              onChange={(e) => setPropForm({ ...propForm, category_id: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              <option value="">Selecione um eixo...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Descrição e Detalhamento da Proposta *
            </label>
            <textarea
              required
              rows={4}
              value={propForm.description}
              onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
              placeholder="Explique os objetivos, metas e impacto social desta proposta..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          {/* Proposal Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Imagem Ilustrativa (Opcional - Supabase Storage)
            </label>
            <ImageUploader
              currentImageUrl={propForm.image_url}
              folder="proposals"
              onUploadSuccess={(url) => setPropForm({ ...propForm, image_url: url })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Ordem de Exibição
              </label>
              <input
                type="number"
                value={propForm.display_order}
                onChange={(e) => setPropForm({ ...propForm, display_order: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={propForm.is_active}
                  onChange={(e) => setPropForm({ ...propForm, is_active: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-700">Ativa no site</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPropModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Salvar Proposta
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Manager Modal */}
      <Modal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title="Eixos Programáticos e Categorias"
      >
        <div className="space-y-4">
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Novo eixo (ex: Meio Ambiente)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-500 transition-colors"
            >
              Adicionar
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800">{c.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">Ordem: {c.display_order}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setCatModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Concluir
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteProposal}
        title="Excluir Proposta"
        description="Tem certeza que deseja remover esta proposta do site da campanha?"
      />
    </div>
  );
};
