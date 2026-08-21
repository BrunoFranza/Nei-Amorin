import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const { themeSettings } = useTenant();
  const formattedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <article
      className={`bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2 md:gap-6' : ''
      }`}
    >
      <Link to={`/noticias/${article.slug}`} className="block overflow-hidden bg-slate-100 relative aspect-[16/9] w-full">
        {article.image_url ? (
          <ImageWithFallback
            src={article.image_url}
            alt={article.title}
            fallbackCategory="news"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
            <span className="text-xs font-semibold">Notícia da Campanha</span>
          </div>
        )}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 rounded-full shadow-xs">
          {article.category}
        </span>
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-1 truncate">
                <User className="w-3.5 h-3.5" />
                <span className="truncate">{article.author}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        </div>

        <Link
          to={`/noticias/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold pt-2 group-hover:gap-2.5 transition-all"
          style={{ color: primaryColor }}
        >
          <span>Ler notícia na íntegra</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
