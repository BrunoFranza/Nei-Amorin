import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const AdminLoginPage: React.FC = () => {
  const {
    login,
    verify2FACode,
    send2FACode,
    pending2FAUser,
    cancel2FA,
  } = useAuth();
  const { currentSite, siteSettings } = useTenant();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // UI states
  const [step, setStep] = useState<'form' | '2fa'>(pending2FAUser ? '2fa' : 'form');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [codeNotice, setCodeNotice] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const candidateName = siteSettings?.candidate_name || currentSite?.name || 'Campanha Oficial';

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor, informe seu e-mail e senha de acesso.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      setStep('2fa');
      const savedCode = sessionStorage.getItem('wl_2fa_code');
      if (savedCode) {
        setCodeNotice(`Código enviado! Para testes imediatos seu código é: ${savedCode}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciais inválidas ou e-mail não autorizado.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setErrorMsg('Digite o código de 6 dígitos recebido.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await verify2FACode(verificationCode);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Código de verificação incorreto ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    const targetEmail = pending2FAUser?.email || email;
    if (!targetEmail) return;

    setResending(true);
    setErrorMsg(null);
    try {
      const res = await send2FACode(targetEmail);
      if (res.simulatedCode) {
        setCodeNotice(`Novo código gerado: ${res.simulatedCode}`);
      }
    } catch (err: any) {
      setErrorMsg('Falha ao reenviar código.');
    } finally {
      setResending(false);
    }
  };

  const handleBackToForm = () => {
    cancel2FA();
    setStep('form');
    setVerificationCode('');
    setErrorMsg(null);
    setCodeNotice(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30 font-bold text-xl">
          {candidateName.charAt(0)}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {step === 'form' ? 'Acesso Administrativo' : 'Autenticação em 2 Etapas (2FA)'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {step === 'form' ? (
            <>Site Oficial de <span className="text-sky-400 font-bold">{candidateName}</span></>
          ) : (
            <>Enviamos um código de segurança para <span className="text-sky-400 font-bold">{pending2FAUser?.email || email}</span></>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 2FA Code Helper / Notification */}
          {codeNotice && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{codeNotice}</span>
            </div>
          )}

          {/* STEP 1: Login Form (Email + Password) */}
          {step === 'form' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
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

              <div className="p-3 bg-sky-950/40 border border-sky-900/60 rounded-xl text-sky-300 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
                <span>
                  Área protegida da coordenação. Após a senha, você confirmará o código 2FA enviado ao seu e-mail.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Verificando...' : 'Entrar com 2FA'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Two-Factor Authentication (2FA) Code Verification */
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300">
                  Insira o código de 6 dígitos enviado para:
                </p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">
                  {pending2FAUser?.email || email}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 text-center">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length < 6}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Validando código...' : 'Confirmar e Entrar no Painel'}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Trocar e-mail</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Reenviando...' : 'Reenviar código'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step Back to Public Site link */}
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
