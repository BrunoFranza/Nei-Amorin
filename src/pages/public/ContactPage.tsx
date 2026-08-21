import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Share2 } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { ContactSettings, SocialLink } from '../../types';

export const ContactPage: React.FC = () => {
  const { currentSite, siteSettings, themeSettings } = useTenant();
  const [contact, setContact] = useState<ContactSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    neighborhood: '',
    subject: 'Sugestão para o Plano de Governo',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentSite) return;
    const loadContact = async () => {
      const [contactData, socData] = await Promise.all([
        dataStore.getContactSettings(currentSite.id),
        dataStore.getSocialLinks(currentSite.id, true),
      ]);
      setContact(contactData);
      setSocialLinks(socData);
    };
    loadContact();
  }, [currentSite?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        neighborhood: '',
        subject: 'Sugestão para o Plano de Governo',
        message: '',
      });
    }, 800);
  };

  const whatsappNumber = contact?.whatsapp?.replace(/\D/g, '') || siteSettings?.whatsapp?.replace(/\D/g, '') || '';
  const primaryColor = themeSettings?.primary_color || '#0284c7';

  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-100">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Canal Direto de Comunicação</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Fale Conosco e Envie sua Sugestão
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Nossa equipe de coordenação e o candidato estão à disposição para ouvir suas ideias, solicitações e demandas para nossa região.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Direct channels and physical office */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Direct CTA Card */}
          {whatsappNumber && (
            <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Atendimento via WhatsApp</h3>
                  <p className="text-xs text-white/80">Resposta ágil da coordenação</p>
                </div>
              </div>

              <p className="text-sm text-white/90 leading-relaxed">
                Clique abaixo para iniciar uma conversa direta e receber novidades no seu celular.
              </p>

              <a
                href={`https://wa.me/55${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-800 font-bold rounded-2xl shadow-sm hover:bg-emerald-50 transition-colors text-sm"
              >
                <span>Abrir WhatsApp ({contact?.whatsapp || siteSettings?.whatsapp})</span>
              </a>
            </div>
          )}

          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900">
              Canais Oficiais da Campanha
            </h3>

            <div className="space-y-4 text-sm text-slate-600">
              {(contact?.address || siteSettings?.municipality) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Comitê Central:</strong>
                    <span>
                      {contact?.address || 'Comitê Central de Campanha'}, {contact?.city || siteSettings?.municipality} - {contact?.state || siteSettings?.state}
                    </span>
                  </div>
                </div>
              )}

              {(contact?.email || siteSettings?.email) && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">E-mail:</strong>
                    <a href={`mailto:${contact?.email || siteSettings?.email}`} className="text-sky-600 hover:underline">
                      {contact?.email || siteSettings?.email}
                    </a>
                  </div>
                </div>
              )}

              {(contact?.phone || siteSettings?.phone) && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Telefone:</strong>
                    <span>{contact?.phone || siteSettings?.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Networks List */}
            {socialLinks.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Redes Sociais Oficiais
                </h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors capitalize"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Feedback / Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Envie sua Mensagem
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Preencha os campos abaixo com suas sugestões, críticas construtivas ou pedidos de adesivos/materiais.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900">Mensagem Recebida com Sucesso!</h4>
                <p className="text-sm text-emerald-700 leading-relaxed max-w-md mx-auto">
                  Agradecemos pela sua contribuição. Nossa coordenação de campanha analisará suas sugestões com muita atenção.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: João da Silva"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      E-mail para Contato *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Bairro / Município
                    </label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="Ex: Centro / Zona Sul"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Assunto
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="Sugestão para o Plano de Governo">Sugestão para o Plano de Governo</option>
                    <option value="Quero ser Voluntário na Campanha">Quero ser Voluntário na Campanha</option>
                    <option value="Solicitação de Material de Campanha">Solicitação de Material de Campanha</option>
                    <option value="Convite para Reunião Comunitária">Convite para Reunião Comunitária</option>
                    <option value="Imprensa e Assessoria">Imprensa e Assessoria</option>
                    <option value="Outros Assuntos">Outros Assuntos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escreva sua mensagem com detalhes..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 font-bold text-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Enviando mensagem...' : 'Enviar Mensagem para a Campanha'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
