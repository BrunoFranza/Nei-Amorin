import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { HeroSection } from '../../types';
import { useTenant } from '../../context/TenantContext';

import { ImageWithFallback } from '../common/ImageWithFallback';

interface PublicHeroProps {
  hero: HeroSection;
}

export const PublicHero: React.FC<PublicHeroProps> = ({ hero }) => {
  const { siteSettings, themeSettings } = useTenant();

  const primaryColor = themeSettings?.primary_color || '#1a6b3a';
  const secondaryColor = themeSettings?.secondary_color || '#0d2b4e';
  const accentColor = themeSettings?.accent_color || '#f5c518';
  const buttonStyle = themeSettings?.button_style || 'rounded-full';

  const hasBackgroundVideo = Boolean(hero.background_video_url);

  if (hasBackgroundVideo) {
    return (
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden bg-slate-950 text-white">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src={hero.background_video_url}
          poster={hero.image_url || hero.hero_image_url}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={hero.background_video_url} type="video/mp4" />
        </video>

        {/* Cinematic Gradient Overlay (Left dark for text readability, right clear for video & subtitles) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${secondaryColor}fa 0%, ${secondaryColor}e6 30%, ${secondaryColor}88 60%, ${primaryColor}44 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
          <div className="max-w-3xl space-y-6">
            {hero.badge_text && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span>{hero.badge_text}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {hero.candidate_name || siteSettings?.candidate_name}
                </h2>
                {siteSettings?.candidate_number && (
                  <span
                    className="px-3 py-1 text-sm sm:text-base font-extrabold text-slate-950 rounded-lg shadow-sm"
                    style={{ backgroundColor: accentColor }}
                  >
                    {siteSettings.candidate_number}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-sm">
                {hero.title}
              </h1>
            </div>

            {hero.subtitle && (
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl drop-shadow-xs">
                {hero.subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              {hero.primary_button_text && (
                <Link
                  to={hero.primary_button_url || '/propostas'}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 ${buttonStyle}`}
                  style={{ backgroundColor: accentColor }}
                >
                  <span>{hero.primary_button_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {hero.secondary_button_text && (
                <Link
                  to={hero.secondary_button_url || '/contato'}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-xs transition-all ${buttonStyle}`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{hero.secondary_button_text}</span>
                </Link>
              )}
            </div>

            {/* Metadata bar */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-300">
              {siteSettings?.party && (
                <span>Partido: <strong className="text-white">{siteSettings.party}</strong></span>
              )}
              {siteSettings?.municipality && (
                <span>Região: <strong className="text-white">{siteSettings.municipality} ({siteSettings.state})</strong></span>
              )}
              {siteSettings?.position && (
                <span>Cargo: <strong className="text-white">{siteSettings.position}</strong></span>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-12 lg:py-20 border-b border-slate-100">
      {/* Subtle decorative background circle */}
      <div
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: secondaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {hero.badge_text && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{hero.badge_text}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {hero.candidate_name || siteSettings?.candidate_name}
                </h2>
                {siteSettings?.candidate_number && (
                  <span
                    className="px-3 py-1 text-sm sm:text-base font-extrabold text-white rounded-lg shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {siteSettings.candidate_number}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                {hero.title}
              </h1>
            </div>

            {hero.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {hero.subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              {hero.primary_button_text && (
                <Link
                  to={hero.primary_button_url || '/propostas'}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${buttonStyle}`}
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{hero.primary_button_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {hero.secondary_button_text && (
                <Link
                  to={hero.secondary_button_url || '/contato'}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:shadow transition-all ${buttonStyle}`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{hero.secondary_button_text}</span>
                </Link>
              )}
            </div>

            {/* Candidate Metadata Summary */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs font-semibold text-slate-500">
              {siteSettings?.party && (
                <span>Partido: <strong className="text-slate-800">{siteSettings.party}</strong></span>
              )}
              {siteSettings?.municipality && (
                <span>Região: <strong className="text-slate-800">{siteSettings.municipality} ({siteSettings.state})</strong></span>
              )}
              {siteSettings?.position && (
                <span>Cargo: <strong className="text-slate-800">{siteSettings.position}</strong></span>
              )}
            </div>
          </div>

          {/* Right Column: Hero Image with High Contrast Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer decorative card shadow */}
              <div
                className="absolute -inset-1.5 rounded-3xl opacity-20 blur-xl"
                style={{ backgroundColor: primaryColor }}
              />

              <div className="relative rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl aspect-[4/5]">
                {hero.image_url ? (
                  <ImageWithFallback
                    src={hero.image_url}
                    alt={hero.candidate_name || 'Candidato'}
                    fallbackCategory="candidate"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-400 p-6 text-center">
                    <p className="font-semibold text-sm">Foto Oficial da Campanha</p>
                  </div>
                )}

                {/* Bottom Overlay Label with Candidate Number */}
                {siteSettings?.candidate_number && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{hero.candidate_name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{siteSettings.position}</p>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-lg text-white font-extrabold text-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {siteSettings.candidate_number}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

