import React, { useState } from 'react';
import { Download, Sparkles, FileText, Image, Music, Check, Copy, Share2, Printer, Shield, ArrowRight } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const PressKitPage: React.FC = () => {
  const { siteSettings, themeSettings } = useTenant();
  const [copiedBio, setCopiedBio] = useState(false);
  const primaryColor = themeSettings?.primary_color || '#0284c7';

  const candidateName = siteSettings?.candidate_name || 'Ney Amorim';
  const candidateNumber = siteSettings?.candidate_number || '1577';
  const position = siteSettings?.position || 'Deputado Federal';
  const party = siteSettings?.party || 'MDB';
  const coalition = siteSettings?.coalition || 'Pelo Futuro do Acre';

  const bioPressText = `${candidateName} (${party}) é candidato a ${position} pelo estado do ${siteSettings?.state || 'Acre'}. Com ampla trajetória em defesa dos serviços públicos, da infraestrutura regional e valorização do povo acreano, tem como principais bandeiras o desenvolvimento regional, a melhoria da BR-364 e a geração de empregos. Concorrendo sob o número oficial ${candidateNumber} pelo ${party}.`;

  const handleCopyBio = () => {
    navigator.clipboard.writeText(bioPressText);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 3000);
  };

  const materials = [
    {
      title: 'Santinho Digital Oficial 2026',
      category: 'Material de Impressão e WhatsApp',
      type: 'PDF / PNG',
      size: '2.4 MB',
      description: 'Arte frente e verso com número de urna, propostas centrais e foto oficial em alta resolução.',
      downloadUrl: '#',
      icon: Printer,
    },
    {
      title: 'Pack de Fotos Oficiais em Alta Definição',
      category: 'Imprensa & Mídia',
      type: 'ZIP',
      size: '48 MB',
      description: 'Retratos de estúdio, fotos de campo, atendimentos e eventos para matérias jornalísticas.',
      downloadUrl: '#',
      icon: Image,
    },
    {
      title: 'Manual de Identidade Visual e Logos',
      category: 'Design & Comunicação',
      type: 'ZIP (PNG + SVG)',
      size: '8.1 MB',
      description: 'Logotipos oficiais, tipografias, paleta de cores e variações com fundo transparente.',
      downloadUrl: '#',
      icon: Sparkles,
    },
    {
      title: 'Jingle Oficial da Campanha (Áudio)',
      category: 'Rádio, Carro de Som & Redes',
      type: 'MP3',
      size: '5.2 MB',
      description: 'Gravação em estúdio com versão completa de 30s e 1min para divulgação e carreatas.',
      downloadUrl: '#',
      icon: Music,
    },
    {
      title: 'Plano de Metas & Propostas Completo',
      category: 'Documento Programático',
      type: 'PDF',
      size: '3.8 MB',
      description: 'Documento integral protocolado com todos os compromissos para o mandato legislativo.',
      downloadUrl: '#',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-12 py-8 pb-20">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-bold rounded-full border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kit de Mídia & Materiais Oficiais</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Materiais de Campanha & Sala de Imprensa
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Baixe fotos em alta resolução, santinhos digitais, logos oficiais e jingles de <strong className="text-white">{candidateName}</strong> para uso em veículos de imprensa, apoiadores e redes sociais.
            </p>
          </div>
        </div>
      </section>

      {/* Release Rápido para Jornalistas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Sala de Imprensa</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Minibiografia Oficial para Redações & Veículos
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCopyBio}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
            >
              {copiedBio ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Texto para Notícia</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed font-sans">
            {bioPressText}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span><strong>Número de Urna:</strong> {candidateNumber}</span>
            <span>•</span>
            <span><strong>Partido:</strong> {party}</span>
            <span>•</span>
            <span><strong>Cargo:</strong> {position}</span>
            <span>•</span>
            <span><strong>CNPJ da Campanha:</strong> {siteSettings?.cnpj || 'Consulte prestação de contas'}</span>
          </div>
        </div>
      </section>

      {/* Grid de Materiais para Download */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Download Gratuito</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Arquivos & Artes Oficiais Prontas para Uso
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat, idx) => {
            const Icon = mat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                      {mat.type} • {mat.size}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wide block">
                      {mat.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">
                      {mat.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => alert(`Iniciando download de: ${mat.title}`)}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-sky-600" />
                    <span>Baixar Arquivo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Seção de Adesivos & Material Físico */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-50 rounded-3xl p-8 border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">
              <Shield className="w-4 h-4" />
              <span>Apoio Popular e Mobilização</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Quer receber adesivos e materiais em sua casa?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Entre em contato direto com nosso comitê central pelo WhatsApp para solicitar adesivos de carro, bandeiras ou agendar uma visita da equipe de {candidateName}.
            </p>
          </div>

          <a
            href={`https://wa.me/55${siteSettings?.whatsapp?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(`Olá! Gostaria de receber materiais físicos de campanha de ${candidateName}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all shrink-0 flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <span>Pedir Material no WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};
