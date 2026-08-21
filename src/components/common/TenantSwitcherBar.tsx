import React from 'react';
import { Layers, ShieldCheck, Database, ArrowRight, UserCheck, ExternalLink } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Link, useLocation } from 'react-router-dom';

export const TenantSwitcherBar: React.FC = () => {
  const { allSites, currentSite, setCurrentSiteId } = useTenant();
  const { user, currentRole, switchUser } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Platform Multi-Tenant Branding & Mode */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-white tracking-wide">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>PLATAFORMA WHITE-LABEL ELEITORAL</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>{isSupabaseConfigured ? 'Supabase Conectado' : 'Supabase Multi-Tenant Engine'}</span>
          </div>
        </div>

        {/* Center/Right: Tenant Switcher and Quick Role Switch */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Site Tenant Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400 font-medium">Cliente/Campanha:</span>
            <select
              value={currentSite?.id || ''}
              onChange={(e) => setCurrentSiteId(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
              aria-label="Selecionar Campanha / Site"
            >
              {allSites.map((site) => (
                <option key={site.id} value={site.id} className="bg-slate-800 text-white">
                  {site.name} ({site.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Demo User Switcher */}
          {isAdmin && (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-slate-300">
              <UserCheck className="w-3 h-3 text-sky-400" />
              <span className="text-slate-400">Usuário:</span>
              <select
                value={user?.id || ''}
                onChange={(e) => switchUser(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer text-[11px]"
                aria-label="Alternar Usuário para Testes de Permissão"
              >
                <option value="user-admin-a-uuid" className="bg-slate-800 text-white">
                  Roberto Mendes (Coord. Ney Amorim)
                </option>
                <option value="user-admin-b-uuid" className="bg-slate-800 text-white">
                  Juliana Castro (Coord. Mariana)
                </option>
                <option value="user-editor-a-uuid" className="bg-slate-800 text-white">
                  Felipe Alcantara (Comunicação Ney Amorim)
                </option>
                <option value="user-superadmin-uuid" className="bg-slate-800 text-white">
                  Super Admin (Acesso Geral)
                </option>
              </select>
            </div>
          )}

          {/* Toggle between Public Site and Admin Panel */}
          {isAdmin ? (
            <Link
              to="/"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition-colors"
            >
              <span>Ver Site Público</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          ) : (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              <span>Painel Admin</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
