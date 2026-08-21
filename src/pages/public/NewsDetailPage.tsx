import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, MessageCircle, Copy, Check } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { NewsArticle } from '../../types';
import { NewsCard } from '../../components/public/NewsCard';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentSite, themeSettings } = useTenant();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentSite || !slug) return;
    const loadArticle = async () => {
      setLoading(true);
      try {
        const item = await dataStore.getNewsBySlug(currentSite.id, slug);
        setArticle(item);
        if (item) {
          // Update Page Title and meta for SEO
          document.title = `${item.title} | ${currentSite.name}`;
          const allNews = await dataStore.getNews(currentSite.id, true);
          setRelatedArticles(allNews.filter((n) => n.id !== item.id).slice(0, 3));
        }
      } catch (e) {
        console.error('Error loading article:', e);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [currentSite?.id, slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!article) return;
    const text = encodeURIComponent(`${article.title}\n\nLeia a matéria completa: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-500">Carregando notícia...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="text-2xl font-bold text-slate-900">Notícia não encontrada</h2>
        <p className="text-sm text-slate-600">A publicação procurada não existe ou foi despublicada.</p>
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Notícias</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div>
        <Link
          to="/noticias"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Todas as Notícias</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full">
          {article.category}
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          {article.title}
        </h1>

        {article.summary && (
          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">
            {article.summary}
          </p>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Publicado em {formattedDate}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-slate-400" />
                <span>Por {article.author}</span>
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> Compartilhar:
            </span>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
              title="Compartilhar no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold px-2.5"
              title="Copiar Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.image_url && (
        <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-md aspect-[16/9] w-full">
          <ImageWithFallback
            src={article.image_url}
            alt={article.title}
            fallbackCategory="news"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content */}
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line space-y-4">
        {article.content}
      </div>

      {/* Related News */}
      {relatedArticles.length > 0 && (
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Outras Notícias da Campanha
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <NewsCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
