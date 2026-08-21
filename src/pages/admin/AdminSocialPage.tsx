import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Share2, Globe, ExternalLink } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { SocialLink } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';

const PLATFORMS = [
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'whatsapp',
  'twitter',
  'linkedin',
  'telegram',
  'spotify',
];

export const AdminSocialPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<SocialLink>>({
    platform: 'instagram',
    url: '',
    username: '',
    display_order: 1,
    is_active: true,
  });

  const loadLinks = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getSocialLinks(currentSite.id);
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, [currentSite?.id]);

  const handleOpenCreate = () => {
    setSelectedLink(null);
    setForm({
      platform: 'instagram',
      url: '',
      username: '',
      display_order: links.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: SocialLink) => {
    setSelectedLink(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (selectedLink) {
      await dataStore.updateSocialLink({
        ...selectedLink,
        ...form,
      } as SocialLink);
    } else {
      await dataStore.createSocialLink({
        ...form,
        site_id: currentSite.id,
      } as any);
    }

    setModalOpen(false);
    loadLinks();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await dataStore.deleteSocialLink(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadLinks();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Redes Sociais Oficiais
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Gerencie os canais de engajamento social da campanha exibidos no cabeçalho e rodapé.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Canal Social</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando redes sociais...</p>
        </div>
      ) : links.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {link.platform.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm capitalize">{link.platform}</h3>
                    <p className="text-xs text-slate-500">{link.username || link.url}</p>
                  </div>
                </div>
                <StatusBadge active={link.is_active} />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Acessar perfil</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(link)}
                    className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setItemToDelete(link.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-sm font-bold text-slate-700">Nenhuma rede social cadastrada</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedLink ? 'Editar Rede Social' : 'Nova Rede Social'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Plataforma *
            </label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm capitalize text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              URL Completa do Perfil *
            </label>
            <input
              type="url"
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://instagram.com/candidato_oficial"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nome de Usuário / @
            </label>
            <input
              type="text"
              value={form.username || ''}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="@candidatooficial"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
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
              Salvar Canal
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Rede Social"
        description="Tem certeza que deseja remover este link de rede social?"
      />
    </div>
  );
};
