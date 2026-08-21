import React, { useEffect, useState } from 'react';
import { User, Quote, ArrowLeft, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { dataStore } from '../../services/data-store';
import { AboutSection } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export const AboutPage: React.FC = () => {
  const { currentSite, siteSettings, themeSettings } = useTenant();
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [heroImage, setHeroImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentSite) return;
    const load = async () => {
      setLoading(true);
      const [aboutData, heroData] = await Promise.all([
        dataStore.getAbout(currentSite.id),
        dataStore.getHero(currentSite.id),
      ]);
      setAbout(aboutData);
      if (heroData?.image_url) {
        setHeroImage(heroData.image_url);
      }
      setLoading(false);
    };
    load();
  }, [currentSite?.id]);

  const primaryColor = themeSettings?.primary_color || '#0284c7';
  const candidateName = siteSettings?.candidate_name || currentSite?.name || 'Candidato';

  return (
    <div className="bg-slate-50">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <span
              className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full inline-block text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Trajetória & Valores
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Quem é {candidateName}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Conheça a história de vida, dedicação ao serviço público e os princípios que guiam nossa caminhada.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-500">Carregando biografia...</p>
            </div>
          ) : about ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-md overflow-hidden">
                  <ImageWithFallback
                    src={about.image_url || heroImage}
                    alt={candidateName}
                    fallbackCategory="candidate"
                    className="w-full h-auto rounded-2xl object-cover aspect-[4/5]"
                  />
                </div>

                {siteSettings && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dados Oficiais de Registro
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Nome:</span>
                        <span className="font-bold text-slate-900">{siteSettings.candidate_name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Número de Urna:</span>
                        <span className="font-black text-sky-600">{siteSettings.candidate_number}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Partido:</span>
                        <span className="font-bold text-slate-900">{siteSettings.party}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Cargo:</span>
                        <span className="font-bold text-slate-900">{siteSettings.position}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 space-y-8">
                {about.quote && (
                  <div className="p-6 sm:p-8 bg-sky-50/70 rounded-3xl border border-sky-100 relative">
                    <Quote className="w-8 h-8 text-sky-400 absolute top-4 right-4 opacity-50" />
                    <p className="text-base sm:text-lg italic font-medium text-sky-950 leading-relaxed">
                      "{about.quote}"
                    </p>
                    <span className="block text-xs font-bold text-sky-800 mt-3">— {candidateName}</span>
                  </div>
                )}

                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {about.title}
                  </h2>

                  <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                    {about.biography}
                  </div>

                  {about.trajectory && (
                    <div className="pt-6 border-t border-slate-100 space-y-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span>Histórico e Realizações</span>
                      </h3>
                      <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {about.trajectory}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
