import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ChevronRight, Shield } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const Navbar: React.FC = () => {
  const { siteSettings, themeSettings } = useTenant();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Biografia', path: '/biografia' },
    { name: 'Propostas', path: '/propostas' },
    { name: 'Atuação', path: '/atuacao' },
    { name: 'Agenda', path: '/agenda' },
    { name: 'Notícias', path: '/noticias' },
    { name: 'Vídeos', path: '/videos' },
    { name: 'Galeria', path: '/galeria' },
    { name: 'Materiais', path: '/materiais' },
    { name: 'Contato', path: '/contato' },
  ];

  const whatsappNumber = siteSettings?.whatsapp?.replace(/\D/g, '') || '';
  const whatsappUrl = whatsappNumber ? `https://wa.me/55${whatsappNumber}` : '#';

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
          : 'bg-white py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Candidate Brand & Number */}
          <Link to="/" className="flex items-center gap-3 group">
            {siteSettings?.logo_url ? (
              <img
                src={siteSettings.logo_url}
                alt={siteSettings.candidate_name}
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: themeSettings?.primary_color || '#0284c7' }}>
                {siteSettings?.candidate_name?.charAt(0) || 'C'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
                  {siteSettings?.candidate_name || 'Campanha Oficial'}
                </span>
                {siteSettings?.candidate_number && (
                  <span
                    className="px-2 py-0.5 text-xs font-extrabold text-white rounded-md shadow-xs"
                    style={{ backgroundColor: themeSettings?.accent_color || '#f59e0b' }}
                  >
                    {siteSettings.candidate_number}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {siteSettings?.position || 'Candidato'} {siteSettings?.party ? `• ${siteSettings.party.split('-')[0]}` : ''}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  style={isActive && themeSettings?.primary_color ? { color: themeSettings.primary_color, backgroundColor: `${themeSettings.primary_color}15` } : {}}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  style={isActive && themeSettings?.primary_color ? { color: themeSettings.primary_color, backgroundColor: `${themeSettings.primary_color}15` } : {}}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          {whatsappNumber && (
            <div className="pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Falar no WhatsApp da Campanha</span>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
