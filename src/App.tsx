import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

// Layouts
import { PublicLayout } from './components/public/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ProposalsPage } from './pages/public/ProposalsPage';
import { ActionsPage } from './pages/public/ActionsPage';
import { EventsPage } from './pages/public/EventsPage';
import { NewsPage } from './pages/public/NewsPage';
import { NewsDetailPage } from './pages/public/NewsDetailPage';
import { VideosPage } from './pages/public/VideosPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';
import { PressKitPage } from './pages/public/PressKitPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHeroPage } from './pages/admin/AdminHeroPage';
import { AdminAboutPage } from './pages/admin/AdminAboutPage';
import { AdminIndicatorsPage } from './pages/admin/AdminIndicatorsPage';
import { AdminProposalsPage } from './pages/admin/AdminProposalsPage';
import { AdminActionsPage } from './pages/admin/AdminActionsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminSocialPage } from './pages/admin/AdminSocialPage';
import { AdminContactPage } from './pages/admin/AdminContactPage';
import { AdminThemePage } from './pages/admin/AdminThemePage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSitesPage } from './pages/admin/AdminSitesPage';
import { AdminSqlPage } from './pages/admin/AdminSqlPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans">
      <div className="max-w-md space-y-4">
        <span className="text-6xl font-black text-sky-400">404</span>
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="text-sm text-slate-400">
          O endereço solicitado não foi localizado neste site de campanha.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Voltar ao Início
          </Link>
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Acessar Painel Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            {/* Public Candidate Pages */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/biografia" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/sobre" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/propostas" element={<PublicLayout><ProposalsPage /></PublicLayout>} />
            <Route path="/atuacao" element={<PublicLayout><ActionsPage /></PublicLayout>} />
            <Route path="/conquistas" element={<PublicLayout><ActionsPage /></PublicLayout>} />
            <Route path="/agenda" element={<PublicLayout><EventsPage /></PublicLayout>} />
            <Route path="/eventos" element={<PublicLayout><EventsPage /></PublicLayout>} />
            <Route path="/noticias" element={<PublicLayout><NewsPage /></PublicLayout>} />
            <Route path="/noticias/:slug" element={<PublicLayout><NewsDetailPage /></PublicLayout>} />
            <Route path="/videos" element={<PublicLayout><VideosPage /></PublicLayout>} />
            <Route path="/galeria" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/fotos" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/materiais" element={<PublicLayout><PressKitPage /></PublicLayout>} />
            <Route path="/imprensa" element={<PublicLayout><PressKitPage /></PublicLayout>} />
            <Route path="/contato" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/fale-conosco" element={<PublicLayout><ContactPage /></PublicLayout>} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Pages */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/hero" element={<ProtectedRoute><AdminHeroPage /></ProtectedRoute>} />
            <Route path="/admin/sobre" element={<ProtectedRoute><AdminAboutPage /></ProtectedRoute>} />
            <Route path="/admin/biografia" element={<ProtectedRoute><AdminAboutPage /></ProtectedRoute>} />
            <Route path="/admin/indicadores" element={<ProtectedRoute><AdminIndicatorsPage /></ProtectedRoute>} />
            <Route path="/admin/propostas" element={<ProtectedRoute><AdminProposalsPage /></ProtectedRoute>} />
            <Route path="/admin/atuacao" element={<ProtectedRoute><AdminActionsPage /></ProtectedRoute>} />
            <Route path="/admin/agenda" element={<ProtectedRoute><AdminEventsPage /></ProtectedRoute>} />
            <Route path="/admin/noticias" element={<ProtectedRoute><AdminNewsPage /></ProtectedRoute>} />
            <Route path="/admin/videos" element={<ProtectedRoute><AdminVideosPage /></ProtectedRoute>} />
            <Route path="/admin/galeria" element={<ProtectedRoute><AdminGalleryPage /></ProtectedRoute>} />
            <Route path="/admin/redes" element={<ProtectedRoute><AdminSocialPage /></ProtectedRoute>} />
            <Route path="/admin/redes-sociais" element={<ProtectedRoute><AdminSocialPage /></ProtectedRoute>} />
            <Route path="/admin/contato" element={<ProtectedRoute><AdminContactPage /></ProtectedRoute>} />
            <Route path="/admin/tema" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/aparencia" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/configuracoes" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
            <Route path="/admin/geral" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/equipe" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/sites" element={<ProtectedRoute><AdminSitesPage /></ProtectedRoute>} />
            <Route path="/admin/tenants" element={<ProtectedRoute><AdminSitesPage /></ProtectedRoute>} />
            <Route path="/admin/sql" element={<ProtectedRoute><AdminSqlPage /></ProtectedRoute>} />
            <Route path="/admin/database" element={<ProtectedRoute><AdminSqlPage /></ProtectedRoute>} />
            <Route path="/admin/banco-sql" element={<ProtectedRoute><AdminSqlPage /></ProtectedRoute>} />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
