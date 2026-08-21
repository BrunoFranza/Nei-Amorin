import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Newspaper, Calendar, User, Eye, Image as ImageIcon } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { NewsArticle } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminNewsPage: React.FC = () => {
  const { currentSite, themeSettings } = useTenant();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<NewsArticle>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Geral',
    author: 'Assessoria de Comunicação',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0],
    is_published: true,
  });

  const loadNews = async () => {
    if (!currentSite) return;
    setLoading(true);
    const data = await dataStore.getNews(currentSite.id);
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, [currentSite?.id]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    if (!selectedArticle) {
      setForm({
        ...form,
        title: newTitle,
        slug: generateSlug(newTitle),
      });
    } else {
      setForm({ ...form, title: newTitle });
    }
  };

  const handleOpenCreate = () => {
    setSelectedArticle(null);
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: 'Geral',
      author: 'Assessoria de Comunicação',
      image_url: '',
      published_at: new Date().toISOString().split('T')[0],
      is_published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: NewsArticle) => {
    setSelectedArticle(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    if (selectedArticle) {
      await dataStore.updateNews({
        ...selectedArticle,
        ...form,
      } as NewsArticle);
    } else {
      await dataStore.createNews({
        ...form,
        site_id: currentSite.id,
      } as any);
    }

    setModalOpen(false);
    loadNews();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await dataStore.deleteNews(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
      loadNews();
    }
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Notícias, Artigos & Imprensa
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Gerencie os comunicados oficiais, matérias jornalísticas e posicionamentos da campanha.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Escrever Nova Matéria</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Carregando notícias...</p>
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group"
            >
              {item.image_url && (
                <div className="h-40 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                      {item.category}
                    </span>
                    <StatusBadge active={item.is_published} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{item.published_at}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500 truncate">/{item.slug}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={`/noticias/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver artigo</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
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
          <p className="text-sm font-bold text-slate-700">Nenhuma matéria publicada</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedArticle ? 'Editar Notícia' : 'Nova Matéria Jornalística'}
        maxWidth="3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Título da Notícia *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Candidato Apresenta Plano Estratégico de Saúde para 2026"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Slug da URL (Amigável para SEO) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Categoria / Editoria
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Propostas, Imprensa, Saúde"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Autor / Assessoria
              </label>
              <input
                type="text"
                value={form.author || ''}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Data de Publicação
              </label>
              <input
                type="date"
                value={form.published_at}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Resumo / Linha-Fina (Opcional)
            </label>
            <input
              type="text"
              value={form.summary || ''}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Uma síntese breve de uma a duas frases da matéria..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Conteúdo Completo do Artigo *
            </label>
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Escreva a matéria completa com parágrafos, aspas e informações..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Foto de Capa da Notícia (Supabase Storage)
            </label>
            <ImageUploader
              currentImageUrl={form.image_url}
              folder="news"
              onUploadSuccess={(url) => setForm({ ...form, image_url: url })}
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-700">Artigo publicado e público</span>
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
                className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Salvar Matéria
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
        title="Excluir Notícia"
        description="Tem certeza que deseja apagar esta matéria? O link /noticias/:slug deixará de existir."
      />
    </div>
  );
};
