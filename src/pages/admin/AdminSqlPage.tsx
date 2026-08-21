import React, { useState } from 'react';
import { Database, Copy, Check, Terminal, Shield, ExternalLink } from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../../services/schema-sql';

export const AdminSqlPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Script SQL & Estrutura do Supabase
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Script DDL completo com todas as 11 tabelas, índices e políticas de Row Level Security (RLS) prontas para o Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'SQL Copiado para a Área de Transferência!' : 'Copiar Script SQL'}</span>
        </button>
      </div>

      {/* Steps Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 font-black text-sm flex items-center justify-center">
            1
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Abra o Supabase</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Crie ou acesse seu projeto no painel do Supabase e navegue até a aba <b>SQL Editor</b>.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm flex items-center justify-center">
            2
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Cole e Execute o Script</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cole o script SQL abaixo e clique em <b>RUN</b>. Todas as tabelas e políticas RLS serão criadas.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 font-black text-sm flex items-center justify-center">
            3
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Configure as Chaves</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Adicione <code className="text-purple-600 font-mono">VITE_SUPABASE_URL</code> e <code className="text-purple-600 font-mono">VITE_SUPABASE_ANON_KEY</code> no seu arquivo <b>.env</b>.
          </p>
        </div>
      </div>

      {/* SQL Code View */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl overflow-hidden text-slate-300 font-mono text-xs leading-relaxed">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200 text-xs">schema.sql • 11 Tabelas & RLS Completo</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        <pre className="overflow-x-auto max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          <code>{SUPABASE_SCHEMA_SQL}</code>
        </pre>
      </div>
    </div>
  );
};
