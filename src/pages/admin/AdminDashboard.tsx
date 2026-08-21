import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Newspaper,
  Youtube,
  TrendingUp,
  Image,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Database,
  Plus
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { dataStore } from '../../services/data-store';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const { currentSite, siteSettings, themeSettings } = useTenant();
  const { user, currentRole } = useAuth();
  const [counts, setCounts] = useState({
    proposals: 0,
    actions: 0,
    events: 0,
    news: 0,
    videos: 0,
    gallery: 0,
    indicators: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;
    const loadCounts = async () => {
      setLoading(true);
      try {
        const [p, a, e, n, v, g, ind] = await Promise.all([
          dataStore.getProposals(currentSite.id),
          dataStore.getActions(currentSite.id),
          dataStore.getEvents(currentSite.id),
          dataStore.getNews(currentSite.id),
          dataStore.getVideos(currentSite.id),
          dataStore.getGallery(currentSite.id),
          dataStore.getIndicators(currentSite.id),
        ]);
        setCounts({
          proposals: p.length,
          actions: a.length,
          events: e.length,
          news: n.length,
          videos: v.length,
          gallery: g.length,
          indicators: ind.length,
        });
      } finally {
        setLoading(false);
      }
    };
    loadCounts();
  }, [currentSite?.id]);

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestão Oficial de Mandato & Presença Digital</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Olá, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-600">
            Você está gerenciando o site oficial de <strong className="text-slate-900">{currentSite?.name}</strong> (Perfil: <span className="uppercase text-sky-600 font-bold">{currentRole}</span>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Visualizar Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/admin/noticias"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Notícia / Ação</span>
          </Link>
        </div>
      </div>

      {/* Campaign Cloud & Database Status Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Banco de Dados e Armazenamento Conectados</h4>
            <p className="text-xs text-slate-400">
              ID da Campanha: <span className="font-mono text-emerald-400">{currentSite?.id}</span> • Domínio: <span className="font-mono text-slate-300">{currentSite?.domain || `${currentSite?.slug}.campanha.digital`}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Armazenamento Híbrido Ativo'}
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/admin/propostas"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Propostas</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{loading ? '...' : counts.proposals}</p>
          <span className="text-[11px] text-sky-600 font-semibold inline-flex items-center gap-1 mt-2">
            Gerenciar propostas <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/admin/agenda"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Agenda</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{loading ? '...' : counts.events}</p>
          <span className="text-[11px] text-amber-600 font-semibold inline-flex items-center gap-1 mt-2">
            Gerenciar eventos <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/admin/noticias"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Notícias</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{loading ? '...' : counts.news}</p>
          <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1 mt-2">
            Ver matérias <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/admin/videos"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Vídeos</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Youtube className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{loading ? '...' : counts.videos}</p>
          <span className="text-[11px] text-rose-600 font-semibold inline-flex items-center gap-1 mt-2">
            Canal YouTube <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/admin/galeria"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fotos</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{loading ? '...' : counts.gallery}</p>
          <span className="text-[11px] text-indigo-600 font-semibold inline-flex items-center gap-1 mt-2">
            Galeria de fotos <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/admin/indicadores"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Indicadores</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{loading ? '...' : counts.indicators}</p>
          <span className="text-[11px] text-purple-600 font-semibold inline-flex items-center gap-1 mt-2">
            Métricas de destaque <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Candidate Data Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Resumo Cadastral da Campanha
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-medium block">Nome do Candidato</span>
              <strong className="text-slate-900 font-bold text-sm">{siteSettings?.candidate_name}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-medium block">Número Eleitoral</span>
              <strong className="text-slate-900 font-bold text-sm">{siteSettings?.candidate_number}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-medium block">Cargo / Partido</span>
              <strong className="text-slate-900 font-bold text-sm">{siteSettings?.position} ({siteSettings?.party})</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-medium block">Município / Estado</span>
              <strong className="text-slate-900 font-bold text-sm">{siteSettings?.municipality} - {siteSettings?.state}</strong>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              to="/admin/configuracoes"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              <span>Editar dados gerais da campanha</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Dicas da Plataforma
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Todas as alterações são sincronizadas e salvas automaticamente na base de dados.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Você pode alternar entre temas pré-definidos (Moderno, Elegante, Minimalista) na aba Aparência.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Utilize a barra superior para alternar entre campanhas e testar o isolamento de dados.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
