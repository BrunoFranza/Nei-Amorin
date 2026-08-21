import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { GalleryItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminGalleryPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<GalleryItem>>({
    caption: '',
    image_url: '',
    display_order: 1,
    is_active: true,
  });

  const loadGallery = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getGallery(currentSite.id);
    setGallery(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
  }, [currentSite?.id]);

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setForm({
      caption: '',
      image_url: '',
      display_order: gallery.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (!form.image_url) {
      alert('Faça o upload ou informe a URL da foto antes de salvar.');
      return;
    }

    if (selectedItem) {
      await dataStore.updateGalleryItem({
        ...selectedItem,
        ...form,
      } as GalleryItem);
    } else {
      await dataStore.createGalleryItem({
        ...form,
        site_id: currentSite.id,
      } as any);
    }

    setModalOpen(false);
    loadGallery();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await dataStore.deleteGalleryItem(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadGallery();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Galeria de Fotos da Campanha
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Armazenamento em nuvem no Supabase Storage com suporte a drag-and-drop e ordenação.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Foto à Galeria</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando fotos...</p>
        </div>
      ) : gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group"
            >
              <div className="aspect-square w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.caption || 'Foto'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 right-2.5">
                  <StatusBadge active={item.is_active} />
                </div>
              </div>

              <div className="p-3.5 space-y-2">
                <p className="text-xs text-slate-700 font-medium line-clamp-2 min-h-[32px]">
                  {item.caption || <span className="text-slate-400 italic">Sem legenda</span>}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">Ordem: {item.display_order}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItemToDelete(item.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-sm font-bold text-slate-700">Nenhuma foto cadastrada</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedItem ? 'Editar Foto da Galeria' : 'Nova Foto'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Upload da Foto (Supabase Storage) *
            </label>
            <ImageUploader
              currentImageUrl={form.image_url}
              folder="gallery"
              onUploadSuccess={(url) => setForm({ ...form, image_url: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Legenda / Descrição da Imagem
            </label>
            <input
              type="text"
              value={form.caption || ''}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Ex: Encontro com moradores e lideranças no bairro Jardim Esperança"
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
              Salvar Foto
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Foto"
        description="Tem certeza que deseja remover esta foto da galeria da campanha?"
      />
    </div>
  );
};
