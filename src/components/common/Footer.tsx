import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail, Phone, MessageCircle, Heart } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { SocialLink } from '../../types';
import { dataStore } from '../../services/data-store';

export const Footer: React.FC = () => {
  const { currentSite, siteSettings, themeSettings } = useTenant();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (currentSite) {
      dataStore.getSocialLinks(currentSite.id, true).then(setSocialLinks);
    }
  }, [currentSite?.id]);

  const whatsappNumber = siteSettings?.whatsapp?.replace(/\D/g, '') || '';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Candidate Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-base shadow-sm"
                style={{ backgroundColor: themeSettings?.primary_color || '#0284c7' }}
              >
                {siteSettings?.candidate_name?.charAt(0) || 'C'}
              </div>
              <div>
                <h4 className="font-bold text-white text-base leading-tight">
                  {siteSettings?.candidate_name}
                </h4>
                <p className="text-xs text-slate-400">
                  {siteSettings?.position} {siteSettings?.candidate_number ? `• ${siteSettings.candidate_number}` : ''}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {siteSettings?.slogan || 'Compromisso com o futuro e trabalho sério para nossa população.'}
            </p>

            {siteSettings?.coalition && (
              <p className="text-xs text-slate-500 font-medium">
                {siteSettings.coalition}
              </p>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navegação Rápida
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/propostas" className="hover:text-white transition-colors">
                  Plano de Propostas
                </Link>
              </li>
              <li>
                <Link to="/atuacao" className="hover:text-white transition-colors">
                  Atuação e Conquistas
                </Link>
              </li>
              <li>
                <Link to="/agenda" className="hover:text-white transition-colors">
                  Agenda de Eventos
                </Link>
              </li>
              <li>
                <Link to="/noticias" className="hover:text-white transition-colors">
                  Notícias e Artigos
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-white transition-colors">
                  Vídeos e Entrevistas
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="hover:text-white transition-colors">
                  Galeria de Fotos
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Canais Oficiais
            </h5>
            <ul className="space-y-3 text-sm">
              {siteSettings?.municipality && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{siteSettings.municipality} — {siteSettings.state}</span>
                </li>
              )}
              {siteSettings?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${siteSettings.email}`} className="hover:text-white transition-colors truncate">
                    {siteSettings.email}
                  </a>
                </li>
              )}
              {whatsappNumber && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/55${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors text-emerald-400 font-medium"
                  >
                    WhatsApp: {siteSettings?.whatsapp}
                  </a>
                </li>
              )}
            </ul>

            {/* Social Links Icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5 mt-5">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors text-xs font-semibold"
                    title={link.platform}
                  >
                    {link.platform.charAt(0).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 4: Legal Information (TSE Compliance) */}
          <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Informações Legais</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {siteSettings?.legal_information || 'Eleições 2026. Conteúdo informativo de prestação de contas e divulgação de propostas.'}
            </p>
            {siteSettings?.cnpj && (
              <div className="text-slate-400 font-mono text-[11px] pt-1">
                CNPJ da Campanha: <span className="text-slate-300">{siteSettings.cnpj}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Platform Credit & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteSettings?.candidate_name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Plataforma White-Label de Presença Digital</span>
            <span>•</span>
            <Link to="/admin" className="text-slate-400 hover:text-slate-200 transition-colors">
              Acesso Administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
