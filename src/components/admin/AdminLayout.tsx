import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  User,
  FileText,
  Briefcase,
  Calendar,
  Newspaper,
  Youtube,
  Image,
  Share2,
  Phone,
  Palette,
  Settings,
  Users,
  Layers,
  Database,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { TenantSwitcherBar } from '../common/TenantSwitcherBar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, currentRole, logout, accessibleSites } = useAuth();
  const { currentSite, themeSettings } = useTenant();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Candidato & Hero', path: '/admin/hero', icon: Sparkles },
    { name: 'Indicadores (KPIs)', path: '/admin/indicadores', icon: TrendingUp },
    { name: 'Sobre / Biografia', path: '/admin/sobre', icon: User },
    { name: 'Propostas', path: '/admin/propostas', icon: FileText },
    { name: 'Atuação / Ações', path: '/admin/atuacao', icon: Briefcase },
    { name: 'Agenda de Eventos', path: '/admin/agenda', icon: Calendar },
    { name: 'Notícias', path: '/admin/noticias', icon: Newspaper },
    { name: 'Vídeos (YouTube)', path: '/admin/videos', icon: Youtube },
    { name: 'Galeria de Fotos', path: '/admin/galeria', icon: Image },
    { name: 'Redes Sociais', path: '/admin/redes-sociais', icon: Share2 },
    { name: 'Contato & WhatsApp', path: '/admin/contato', icon: Phone },
    { name: 'Configurações Gerais', path: '/admin/configuracoes', icon: Settings, minRole: 'admin' },
    { name: 'Equipe & Acessos', path: '/admin/usuarios', icon: Users, minRole: 'owner' },
    { name: 'Banco SQL & RLS', path: '/admin/banco-sql', icon: Database },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-950 border-r border-slate-800/80 shrink-0">
          {/* Active Site Header in Sidebar */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-base"
                style={{ backgroundColor: primaryColor }}
              >
                {currentSite?.name.charAt(0) || 'C'}
              </div>
              <div className="truncate">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Painel de Mandato</p>
                <h4 className="text-sm font-bold text-white truncate leading-tight">
                  {currentSite?.name || 'Campanha'}
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-400 font-mono truncate">{currentSite?.slug}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  style={isActive ? { backgroundColor: primaryColor } : {}}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card & Role */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt={user?.full_name}
                  className="w-8 h-8 rounded-full bg-slate-700 object-cover"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate leading-tight">{user?.full_name}</p>
                  <span className="inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                    {currentRole || 'Editor'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                title="Sair do painel"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header & Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-100 overflow-y-auto">
          {/* Mobile Admin Header */}
          <header className="lg:hidden bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between text-white">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
                {currentSite?.name}
              </span>
            </div>

            <Link
              to="/"
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              title="Site público"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </header>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
              <div className="relative w-64 bg-slate-900 text-white flex flex-col h-full z-10">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-sm">Menu Administrativo</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold ${
                        location.pathname === item.path
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Desktop Top Header Bar */}
          <header className="hidden lg:flex bg-white border-b border-slate-200/80 px-6 py-3.5 items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">
                  {currentSite?.name}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500 font-mono">
                {currentSite?.domain || `${currentSite?.slug}.campanha.digital`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                <span>Ver Site Público</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>

          {/* Main Workspace Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
