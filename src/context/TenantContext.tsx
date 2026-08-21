import React, { createContext, useContext, useState, useEffect } from 'react';
import { Site, SiteSettings, ThemeSettings } from '../types';
import { dataStore } from '../services/data-store';
import { useAuth } from './AuthContext';

interface TenantContextType {
  currentSite: Site | null;
  siteSettings: SiteSettings | null;
  themeSettings: ThemeSettings | null;
  allSites: Site[];
  isLoading: boolean;
  setCurrentSiteId: (siteId: string) => Promise<void>;
  refreshSiteData: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessibleSites, user } = useAuth();
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load sites and determine active tenant
  const loadSitesAndActiveTenant = async () => {
    setIsLoading(true);
    try {
      const sites = await dataStore.getSites();
      setAllSites(sites);

      // 1. Check ENV variable (Primary for standalone deploy)
      const envSiteId = import.meta.env.VITE_SITE_ID;

      // 2. Check URL query params (?site=slug or ?tenant=slug) for preview/dev
      const urlParams = new URLSearchParams(window.location.search);
      const siteQuery = urlParams.get('site') || urlParams.get('tenant');

      let targetSite: Site | null = null;

      // Prioridade 1: query param explícito (útil para testes em desenvolvimento)
      if (siteQuery) {
        targetSite = sites.find(s => s.slug === siteQuery || s.id === siteQuery) || null;
      }

      // Prioridade 2: VITE_SITE_ID configurado no .env do deploy
      if (!targetSite && envSiteId) {
        targetSite = sites.find(s => s.id === envSiteId || s.slug === envSiteId) || null;
      }

      // Prioridade 3: LocalStorage salvo anteriormente
      if (!targetSite) {
        const savedSiteId = localStorage.getItem('wl_active_site_id');
        if (savedSiteId) {
          targetSite = sites.find(s => s.id === savedSiteId) || null;
        }
      }

      // Prioridade 4: Primeiro site acessível do usuário
      if (!targetSite && accessibleSites.length > 0) {
        targetSite = accessibleSites[0].site;
      }

      // Prioridade 5: Primeiro site disponível
      if (!targetSite && sites.length > 0) {
        targetSite = sites[0];
      }

      if (targetSite) {
        setCurrentSite(targetSite);
        localStorage.setItem('wl_active_site_id', targetSite.id);
        const [settings, theme] = await Promise.all([
          dataStore.getSiteSettings(targetSite.id),
          dataStore.getThemeSettings(targetSite.id),
        ]);
        setSiteSettings(settings);
        setThemeSettings(theme);
        applyThemeCss(theme);
      }
    } catch (e) {
      console.error('Error loading tenant context:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const applyThemeCss = (theme: ThemeSettings | null) => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary_color || '#0284c7');
    root.style.setProperty('--secondary-color', theme.secondary_color || '#0f172a');
    root.style.setProperty('--accent-color', theme.accent_color || '#f59e0b');

    // Font Family
    if (theme.font_family) {
      root.style.setProperty('--theme-font', theme.font_family);
    }
  };

  useEffect(() => {
    const candidate = siteSettings?.candidate_name || currentSite?.name || 'Ney Amorim';
    const position = siteSettings?.position || 'Deputado Federal';
    document.title = `${candidate} — ${position} | Site Oficial`;
  }, [siteSettings?.candidate_name, siteSettings?.position, currentSite?.name]);

  useEffect(() => {
    loadSitesAndActiveTenant();
  }, [user?.id]);

  const setCurrentSiteId = async (siteId: string) => {
    setIsLoading(true);
    const target = allSites.find(s => s.id === siteId);
    if (target) {
      setCurrentSite(target);
      localStorage.setItem('wl_active_site_id', target.id);
      const [settings, theme] = await Promise.all([
        dataStore.getSiteSettings(target.id),
        dataStore.getThemeSettings(target.id),
      ]);
      setSiteSettings(settings);
      setThemeSettings(theme);
      applyThemeCss(theme);
    }
    setIsLoading(false);
  };

  const refreshSiteData = async () => {
    if (!currentSite) return;
    const [settings, theme, sites] = await Promise.all([
      dataStore.getSiteSettings(currentSite.id),
      dataStore.getThemeSettings(currentSite.id),
      dataStore.getSites(),
    ]);
    setAllSites(sites);
    setSiteSettings(settings);
    setThemeSettings(theme);
    applyThemeCss(theme);
  };

  return (
    <TenantContext.Provider
      value={{
        currentSite,
        siteSettings,
        themeSettings,
        allSites,
        isLoading,
        setCurrentSiteId,
        refreshSiteData,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

// Alias semântico para uso em sites individuais
export const useCampaign = useTenant;
