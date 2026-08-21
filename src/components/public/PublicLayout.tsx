import React from 'react';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { MessageCircle } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { siteSettings } = useTenant();
  const rawPhone = siteSettings?.whatsapp || siteSettings?.phone || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const candidateName = siteSettings?.candidate_name || 'Candidato';
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre as propostas e apoiar a campanha de ${candidateName}.`)}` 
    : '#';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Botão Flutuante do WhatsApp para Engajamento de Eleitores */}
      {cleanPhone && (
        <aside aria-label="Contato direto no WhatsApp" className="fixed bottom-6 right-6 z-40">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
            </div>
            <span className="hidden sm:inline">Falar no WhatsApp</span>
          </a>
        </aside>
      )}
    </div>
  );
};
