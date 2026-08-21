import React, { useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { HeroSection } from '../../types';
import { useTenant } from '../../context/TenantContext';

interface PublicHeroProps {
  hero: HeroSection;
}

// Helper to extract YouTube Video ID
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Helper to extract Vimeo Video ID
function getVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]+\/videos\/|video\/|)(\d+)/i);
  return match ? match[1] : null;
}

export const PublicHero: React.FC<PublicHeroProps> = ({ hero }) => {
  const { siteSettings, themeSettings } = useTenant();
  const videoRef = useRef<HTMLVideoElement>(null);

  const primaryColor = themeSettings?.primary_color || '#1a6b3a';
  const secondaryColor = themeSettings?.secondary_color || '#0d2b4e';
  const accentColor = themeSettings?.accent_color || '#f5c518';
  const buttonStyle = themeSettings?.button_style || 'rounded-full';

  // Video URL provided by client or fallback
  const rawVideoUrl = hero?.background_video_url?.trim() || '/hero.mp4';

  const youtubeId = useMemo(() => getYouTubeId(rawVideoUrl), [rawVideoUrl]);
  const vimeoId = useMemo(() => getVimeoId(rawVideoUrl), [rawVideoUrl]);

  useEffect(() => {
    if (!youtubeId && !vimeoId && videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked until interaction
        });
      }
    }
  }, [rawVideoUrl, youtubeId, vimeoId]);

  return (
    <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden bg-slate-950 text-white">
      {/* Background Video Renderer */}
      {youtubeId ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&modestbranding=1`}
            title="Background Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none border-0"
            style={{ minWidth: '100%', minHeight: '100%' }}
          />
        </div>
      ) : vimeoId ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
            title="Background Video"
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none border-0"
            style={{ minWidth: '100%', minHeight: '100%' }}
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={rawVideoUrl}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={rawVideoUrl} type="video/mp4" />
        </video>
      )}

      {/* Cinematic Gradient Overlay for high text readability & subtitle clarity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${secondaryColor}fa 0%, ${secondaryColor}e6 35%, ${secondaryColor}88 65%, ${primaryColor}44 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
        <div className="max-w-3xl space-y-6">
          {(hero?.badge_text || 'MDB 1577 — Deputado Federal AC') && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>{hero?.badge_text || 'MDB 1577 — Deputado Federal AC'}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {hero?.candidate_name || siteSettings?.candidate_name || 'Ney Amorim'}
              </h2>
              {(siteSettings?.candidate_number || '1577') && (
                <span
                  className="px-3 py-1 text-sm sm:text-base font-extrabold text-slate-950 rounded-lg shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {siteSettings?.candidate_number || '1577'}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-sm">
              {hero?.title || 'Trabalho, Compromisso e União pelo Futuro do Acre'}
            </h1>
          </div>

          {(hero?.subtitle || 'Um acreano que luta pelo desenvolvimento regional, pela segurança da nossa gente, pelo agronegócio e pelos empregos que o Acre merece ter.') && (
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl drop-shadow-xs">
              {hero?.subtitle || 'Um acreano que luta pelo desenvolvimento regional, pela segurança da nossa gente, pelo agronegócio e pelos empregos que o Acre merece ter.'}
            </p>
          )}

          {/* CTAs */}
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to={hero?.primary_button_url || '/propostas'}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 ${buttonStyle}`}
              style={{ backgroundColor: accentColor }}
            >
              <span>{hero?.primary_button_text || 'Conheça o Plano de Trabalho'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={hero?.secondary_button_url || '/contato'}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-xs transition-all ${buttonStyle}`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{hero?.secondary_button_text || 'Fale Conosco'}</span>
            </Link>
          </div>

          {/* Metadata bar */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-300">
            <span>Partido: <strong className="text-white">{siteSettings?.party || 'MDB'}</strong></span>
            <span>Região: <strong className="text-white">{siteSettings?.municipality || 'Rio Branco'} ({siteSettings?.state || 'AC'})</strong></span>
            <span>Cargo: <strong className="text-white">{siteSettings?.position || 'Deputado Federal'}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
