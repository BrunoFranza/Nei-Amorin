import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Youtube, Play, ExternalLink } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { VideoItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '../../lib/storage-service';

export const AdminVideosPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<VideoItem>>({
    title: '',
    description: '',
    youtube_url: '',
    category: 'Pronunciamento',
    display_order: 1,
    is_active: true,
  });

  const loadVideos = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getVideos(currentSite.id);
    setVideos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadVideos();
  }, [currentSite?.id]);

  const handleOpenCreate = () => {
    setSelectedVideo(null);
    setForm({
      title: '',
      description: '',
      youtube_url: '',
      category: 'Pronunciamento',
      display_order: videos.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: VideoItem) => {
    setSelectedVideo(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (selectedVideo) {
      await dataStore.updateVideo({
        ...selectedVideo,
        ...form,
      } as VideoItem);
    } else {
      await dataStore.createVideo({
        ...form,
        site_id: currentSite.id,
      } as any);
    }

    setModalOpen(false);
    loadVideos();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await dataStore.deleteVideo(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadVideos();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Vídeos & Canal do YouTube
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Cadastre os vídeos oficiais da campanha apenas colando a URL do YouTube (o sistema obtém thumbnail e embed automaticamente).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Vídeo</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando vídeos...</p>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const thumb = vid.thumbnail_url || getYouTubeThumbnail(vid.youtube_url);
            return (
              <div
                key={vid.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group"
              >
                <div className="aspect-video w-full bg-slate-900 relative">
                  <img
                    src={thumb}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                    {vid.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <StatusBadge active={vid.is_active} />
                      <span className="text-[11px] text-slate-400 font-mono">Ordem: {vid.display_order}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {vid.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={vid.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline flex items-center gap-1 font-semibold text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver no YouTube</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(vid)}
                        className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setItemToDelete(vid.id);
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
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <p className="text-sm font-bold text-slate-700">Nenhum vídeo cadastrado</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedVideo ? 'Editar Vídeo' : 'Novo Vídeo do YouTube'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Link do Vídeo no YouTube *
            </label>
            <input
              type="url"
              required
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Título do Vídeo *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Discurso Oficial de Lançamento das Propostas"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Categoria do Vídeo
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Ex: Pronunciamento, Entrevista, Debate"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Descrição do Vídeo
            </label>
            <textarea
              rows={3}
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Resumo do tema debatido no vídeo..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          {/* Live Preview if valid URL */}
          {form.youtube_url && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">Prévia da Thumbnail:</span>
              <img
                src={getYouTubeThumbnail(form.youtube_url)}
                alt="Preview"
                className="w-40 h-auto rounded-lg shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-700">Ativo no site público</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-xs transition-colors"
              >
                Salvar Vídeo
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Vídeo"
        description="Tem certeza que deseja remover este vídeo do site da campanha?"
      />
    </div>
  );
};
