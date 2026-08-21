import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const AdminLoginPage: React.FC = () => {
  const { login, switchUser, error } = useAuth();
  const { currentSite, siteSettings } = useTenant();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@neyamorim.com.br');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setLocalError(err.message || 'Erro ao efetuar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userId: string, siteId: string) => {
    switchUser(userId);
    navigate('/admin');
  };

  const candidateName = siteSettings?.candidate_name || currentSite?.name || 'Campanha Oficial';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30 font-bold text-xl">
          {candidateName.charAt(0)}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Painel de Gestão
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Site Oficial de <span className="text-sky-400 font-bold">{candidateName}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {(localError || error) && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                E-mail de Acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campanha.com.br"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Entrando...' : 'Acessar Painel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Acesso Rápido para Avaliação:</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user-admin-a-uuid', 'site-ney-amorim')}
                className="w-full text-left p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors text-xs text-slate-300 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">Roberto Mendes (Coord. Ney Amorim)</p>
                  <p className="text-[11px] text-slate-400">Acesso completo ao painel de Ney Amorim</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  Entrar
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('user-admin-b-uuid', 'site-mariana-dias')}
                className="w-full text-left p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors text-xs text-slate-300 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">Juliana Castro (Admin Mariana)</p>
                  <p className="text-[11px] text-slate-400">Acesso exclusivo ao Site B (Mariana Dias)</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Entrar
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('user-superadmin-uuid', 'site-ney-amorim')}
                className="w-full text-left p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors text-xs text-slate-300 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">Super Administrador (Geral)</p>
                  <p className="text-[11px] text-slate-400">Acesso a todos os clientes e sites</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  Entrar
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
            ← Voltar para o site público
          </Link>
        </div>
      </div>
    </div>
  );
};
