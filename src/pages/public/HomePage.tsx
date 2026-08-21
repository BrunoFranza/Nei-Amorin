import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import {
  HeroSection,
  Indicator,
  AboutSection,
  Proposal,
  ActionItem,
  CampaignEvent,
  NewsArticle,
  VideoItem,
  GalleryItem
} from '../../types';
import { PublicHero } from '../../components/public/PublicHero';
import { IndicatorCard } from '../../components/public/IndicatorCard';
import { ProposalCard } from '../../components/public/ProposalCard';
import { ActionCard } from '../../components/public/ActionCard';
import { EventCard } from '../../components/public/EventCard';
import { NewsCard } from '../../components/public/NewsCard';
import { VideoCard } from '../../components/public/VideoCard';
import { GalleryGrid } from '../../components/public/GalleryGrid';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export const HomePage: React.FC = () => {
  const { currentSite, siteSettings, themeSettings } = useTenant();
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [
          heroData,
          indData,
          aboutData,
          propData,
          actData,
          eventData,
          newsData,
          vidData,
          galData
        ] = await Promise.all([
          dataStore.getHero(currentSite.id),
          dataStore.getIndicators(currentSite.id, true),
          dataStore.getAbout(currentSite.id),
          dataStore.getProposals(currentSite.id, true),
          dataStore.getActions(currentSite.id, true),
          dataStore.getEvents(currentSite.id, true),
          dataStore.getNews(currentSite.id, true),
          dataStore.getVideos(currentSite.id, true),
          dataStore.getGallery(currentSite.id, true),
        ]);

        setHero(heroData);
        setIndicators(indData);
        setAbout(aboutData);
        setProposals(propData.slice(0, 4));
        setActions(actData.slice(0, 3));
        setEvents(eventData.slice(0, 3));
        setNews(newsData.slice(0, 3));
        setVideos(vidData.slice(0, 3));
        setGallery(galData.slice(0, 4));
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentSite?.id]);

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  if (loading || !hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Carregando informações da campanha...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <PublicHero hero={hero} />

      {/* 2. INDICATORS (KPIS) */}
      {indicators.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {indicators.map((ind) => (
              <IndicatorCard key={ind.id} indicator={ind} />
            ))}
          </div>
        </section>
      )}

      {/* 3. ABOUT SECTION */}
      {about && about.is_active && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5] bg-white border-2 border-white">
                <ImageWithFallback
                  src={about.image_url || hero?.image_url}
                  alt={about.title}
                  fallbackCategory="candidate"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Trajetória e Compromisso</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {about.title}
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                {about.biography}
              </p>

              {about.trajectory && (
                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                  <strong className="block font-bold text-slate-900 mb-1">Histórico de Atuação:</strong>
                  {about.trajectory}
                </div>
              )}

              {about.quote && (
                <blockquote className="border-l-4 pl-4 py-1 italic text-slate-700 text-sm font-medium" style={{ borderColor: primaryColor }}>
                  {about.quote}
                </blockquote>
              )}

              <div className="pt-2">
                <Link
                  to="/propostas"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full shadow-sm hover:shadow transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>Conhecer Nossas Metas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURED PROPOSALS */}
      {proposals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Plano de Trabalho
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Principais Propostas para Nossa Gente
              </h2>
            </div>
            <Link
              to="/propostas"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 self-start sm:self-auto"
            >
              <span>Ver todas as propostas</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. ACTIONS / ACHIEVEMENTS */}
      {actions.length > 0 && (
        <section className="bg-slate-50 py-16 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
                  Prestação de Contas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Atuação e Resultados Concretos
                </h2>
              </div>
              <Link
                to="/atuacao"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 self-start sm:self-auto"
              >
                <span>Ver histórico completo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {actions.map((act) => (
                <ActionCard key={act.id} action={act} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. UPCOMING EVENTS */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Mobilização Popular
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Próximos Encontros da Agenda
              </h2>
            </div>
            <Link
              to="/agenda"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 self-start sm:self-auto"
            >
              <span>Ver agenda completa</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </section>
      )}

      {/* 7. LATEST NEWS */}
      {news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Comunicação Oficial
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Notícias e Informes da Campanha
              </h2>
            </div>
            <Link
              to="/noticias"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 self-start sm:self-auto"
            >
              <span>Ver todas as notícias</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}

      {/* 8. FEATURED VIDEOS */}
      {videos.length > 0 && (
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  Canal Oficial no YouTube
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Pronunciamentos e Entrevistas
                </h2>
              </div>
              <Link
                to="/videos"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-400 hover:text-rose-300 self-start sm:self-auto"
              >
                <span>Ver todos os vídeos</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <VideoCard key={vid.id} video={vid} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. PHOTO GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Registros Fotográficos
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Galeria da Caminhada
              </h2>
            </div>
            <Link
              to="/galeria"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 self-start sm:self-auto"
            >
              <span>Ver todas as fotos</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <GalleryGrid items={gallery} />
        </section>
      )}

      {/* 10. PRESS KIT & DOWNLOADS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Mobilização & Imprensa
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Baixe os Materiais Oficiais de {siteSettings?.candidate_name || 'Campanha'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Santinhos digitais, fotos em alta resolução, logos vetoriais e jingles oficiais liberados para download gratuito.
            </p>
          </div>

          <Link
            to="/materiais"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-colors shrink-0"
          >
            <span>Acessar Central de Downloads</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 11. DIRECT WHATSAPP / CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Faça Parte Deste Movimento pela Mudança
            </h3>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Envie suas sugestões, conheça nossos comitês de voluntários e receba materiais digitais de campanha diretamente no seu celular.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {siteSettings?.whatsapp && (
              <a
                href={`https://wa.me/55${siteSettings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-md transition-all text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </a>
            )}
            <Link
              to="/contato"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full shadow-md transition-all text-sm"
            >
              <span>Página de Contato</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
