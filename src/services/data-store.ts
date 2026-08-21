import {
  Site,
  Profile,
  SiteMember,
  SiteSettings,
  ThemeSettings,
  HeroSection,
  Indicator,
  AboutSection,
  ProposalCategory,
  Proposal,
  ActionItem,
  CampaignEvent,
  NewsArticle,
  VideoItem,
  GalleryItem,
  SocialLink,
  ContactSettings,
  Role
} from '../types';
import {
  SEED_SITES,
  SEED_PROFILES,
  SEED_SITE_MEMBERS,
  SEED_SITE_SETTINGS,
  SEED_THEME_SETTINGS,
  SEED_HERO,
  SEED_INDICATORS,
  SEED_ABOUT,
  SEED_PROPOSAL_CATEGORIES,
  SEED_PROPOSALS,
  SEED_ACTIONS,
  SEED_EVENTS,
  SEED_NEWS,
  SEED_VIDEOS,
  SEED_GALLERY,
  SEED_SOCIAL_LINKS,
  SEED_CONTACT_SETTINGS
} from '../data/seed-data';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  SITES: 'wl_sites',
  PROFILES: 'wl_profiles',
  MEMBERS: 'wl_site_members',
  SITE_SETTINGS: 'wl_site_settings',
  THEME_SETTINGS: 'wl_theme_settings',
  HERO: 'wl_hero',
  INDICATORS: 'wl_indicators',
  ABOUT: 'wl_about',
  PROPOSAL_CATEGORIES: 'wl_proposal_categories',
  PROPOSALS: 'wl_proposals',
  ACTIONS: 'wl_actions',
  EVENTS: 'wl_events',
  NEWS: 'wl_news',
  VIDEOS: 'wl_videos',
  GALLERY: 'wl_gallery',
  SOCIAL_LINKS: 'wl_social_links',
  CONTACT_SETTINGS: 'wl_contact_settings',
  CURRENT_USER: 'wl_current_user',
};

class LocalDataStore {
  private get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Initialize seed data if empty
  public init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.SITES)) {
      this.set(STORAGE_KEYS.SITES, SEED_SITES);
      this.set(STORAGE_KEYS.PROFILES, SEED_PROFILES);
      this.set(STORAGE_KEYS.MEMBERS, SEED_SITE_MEMBERS);
      this.set(STORAGE_KEYS.SITE_SETTINGS, SEED_SITE_SETTINGS);
      this.set(STORAGE_KEYS.THEME_SETTINGS, SEED_THEME_SETTINGS);
      this.set(STORAGE_KEYS.HERO, SEED_HERO);
      this.set(STORAGE_KEYS.INDICATORS, SEED_INDICATORS);
      this.set(STORAGE_KEYS.ABOUT, SEED_ABOUT);
      this.set(STORAGE_KEYS.PROPOSAL_CATEGORIES, SEED_PROPOSAL_CATEGORIES);
      this.set(STORAGE_KEYS.PROPOSALS, SEED_PROPOSALS);
      this.set(STORAGE_KEYS.ACTIONS, SEED_ACTIONS);
      this.set(STORAGE_KEYS.EVENTS, SEED_EVENTS);
      this.set(STORAGE_KEYS.NEWS, SEED_NEWS);
      this.set(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
      this.set(STORAGE_KEYS.GALLERY, SEED_GALLERY);
      this.set(STORAGE_KEYS.SOCIAL_LINKS, SEED_SOCIAL_LINKS);
      this.set(STORAGE_KEYS.CONTACT_SETTINGS, SEED_CONTACT_SETTINGS);
    }
  }

  public resetToSeeds(): void {
    localStorage.clear();
    this.init();
  }

  // ===================== SITES =====================
  public async getSites(): Promise<Site[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('sites').select('*').order('created_at', { ascending: true });
      if (!error && data) return data;
    }
    return this.get<Site[]>(STORAGE_KEYS.SITES, SEED_SITES);
  }

  public async getSiteBySlug(slug: string): Promise<Site | null> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('sites').select('*').eq('slug', slug).single();
      if (data) return data;
    }
    const sites = await this.getSites();
    return sites.find(s => s.slug === slug || s.id === slug) || sites[0] || null;
  }

  public async getSiteById(id: string): Promise<Site | null> {
    const sites = await this.getSites();
    return sites.find(s => s.id === id) || null;
  }

  public async createSite(site: Partial<Site> & { name: string; slug: string }): Promise<Site> {
    const newSite: Site = {
      id: site.id || `site-${Date.now()}`,
      name: site.name,
      slug: site.slug,
      custom_domain: site.custom_domain || null,
      status: 'active',
      is_active: site.is_active !== undefined ? site.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('sites').insert(newSite).select().single();
      if (!error && data) return data;
    }

    const sites = await this.getSites();
    sites.push(newSite);
    this.set(STORAGE_KEYS.SITES, sites);

    // Bootstrap default campaign settings
    await this.updateSiteSettings({
      site_id: newSite.id,
      candidate_name: newSite.name,
      position: 'Candidato(a)',
      slogan: 'Trabalhando com seriedade e compromisso',
      party: 'PARTIDO',
      candidate_number: '77000',
      municipality: 'São Paulo',
      state: 'SP',
    });

    await this.updateThemeSettings({
      site_id: newSite.id,
      primary_color: '#0284c7',
      secondary_color: '#0f172a',
      accent_color: '#f59e0b',
      button_style: 'rounded-full',
      font_family: 'Plus Jakarta Sans',
      theme_mode: 'light',
    });

    await this.updateHero({
      site_id: newSite.id,
      title: `Bem-vindo ao site oficial de ${newSite.name}`,
      subtitle: 'Conheça nossa trajetória, propostas e compromissos para nossa cidade.',
      candidate_name: newSite.name,
      position: 'Candidato(a)',
      primary_button_text: 'Ver Propostas',
      primary_button_url: '/propostas',
      secondary_button_text: 'Fale Conosco',
      secondary_button_url: '/contato',
      badge_text: 'Plano de Metas 2026',
      is_active: true,
    });

    await this.updateAbout({
      site_id: newSite.id,
      title: 'Uma vida dedicada às pessoas',
      biography: 'Biografia institucional apresentando a trajetória, formação e valores.',
      trajectory: 'Experiência em gestão e representação popular.',
      quote: 'Nosso compromisso é com o desenvolvimento e a justiça social.',
      is_active: true,
    });

    return newSite;
  }

  public async updateSite(id: string, updates: Partial<Site>): Promise<Site> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('sites').update(updates).eq('id', id).select().single();
      if (!error && data) return data;
    }
    const sites = await this.getSites();
    const index = sites.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Site não encontrado');
    sites[index] = { ...sites[index], ...updates, updated_at: new Date().toISOString() };
    this.set(STORAGE_KEYS.SITES, sites);
    return sites[index];
  }

  // ===================== MEMBERS & RBAC =====================
  public async getSiteMembers(siteId: string): Promise<SiteMember[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('site_members').select('*, profile:profiles(*)').eq('site_id', siteId);
      if (!error && data) return data;
    }
    const members = this.get<SiteMember[]>(STORAGE_KEYS.MEMBERS, SEED_SITE_MEMBERS);
    const profiles = this.get<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    return members
      .filter(m => m.site_id === siteId)
      .map(m => ({
        ...m,
        user_email: m.user_email || profiles.find(p => p.id === m.user_id)?.email || 'assessor@campanha.com.br',
        profile: profiles.find(p => p.id === m.user_id),
      }));
  }

  public async getUserSites(userId: string): Promise<{ site: Site; role: Role }[]> {
    const members = this.get<SiteMember[]>(STORAGE_KEYS.MEMBERS, SEED_SITE_MEMBERS);
    const sites = await this.getSites();
    const userMembers = members.filter(m => m.user_id === userId);

    return userMembers
      .map(m => {
        const site = sites.find(s => s.id === m.site_id);
        return site ? { site, role: m.role } : null;
      })
      .filter((item): item is { site: Site; role: Role } => item !== null);
  }

  public async addSiteMember(
    param1: string | Partial<SiteMember>,
    email?: string,
    role?: Role,
    fullName?: string
  ): Promise<SiteMember> {
    let siteId: string;
    let userEmail: string;
    let userRole: Role;
    let name: string;

    if (typeof param1 === 'object') {
      siteId = param1.site_id!;
      userEmail = param1.user_email || 'assessor@campanha.com.br';
      userRole = param1.role || 'editor';
      name = userEmail.split('@')[0];
    } else {
      siteId = param1;
      userEmail = email || '';
      userRole = role || 'editor';
      name = fullName || userEmail.split('@')[0];
    }

    const profiles = this.get<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    let profile = profiles.find(p => p.email.toLowerCase() === userEmail.toLowerCase());

    if (!profile) {
      profile = {
        id: `user-${Date.now()}`,
        email: userEmail,
        full_name: name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        created_at: new Date().toISOString(),
      };
      profiles.push(profile);
      this.set(STORAGE_KEYS.PROFILES, profiles);
    }

    const members = this.get<SiteMember[]>(STORAGE_KEYS.MEMBERS, SEED_SITE_MEMBERS);
    const existingIndex = members.findIndex(m => m.site_id === siteId && m.user_id === profile!.id);

    if (existingIndex >= 0) {
      members[existingIndex].role = userRole;
      members[existingIndex].user_email = userEmail;
      this.set(STORAGE_KEYS.MEMBERS, members);
      return { ...members[existingIndex], profile };
    }

    const newMember: SiteMember = {
      id: `mem-${Date.now()}`,
      site_id: siteId,
      user_id: profile.id,
      user_email: userEmail,
      role: userRole,
      created_at: new Date().toISOString(),
      profile,
    };
    members.push(newMember);
    this.set(STORAGE_KEYS.MEMBERS, members);
    return newMember;
  }

  public async removeSiteMember(memberId: string): Promise<void> {
    const members = this.get<SiteMember[]>(STORAGE_KEYS.MEMBERS, SEED_SITE_MEMBERS);
    const updated = members.filter(m => m.id !== memberId);
    this.set(STORAGE_KEYS.MEMBERS, updated);
  }

  // ===================== SITE SETTINGS =====================
  public async getSiteSettings(siteId: string): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('site_settings').select('*').eq('site_id', siteId).single();
      if (data) return data;
    }
    const allSettings = this.get<Record<string, SiteSettings>>(STORAGE_KEYS.SITE_SETTINGS, SEED_SITE_SETTINGS);
    return allSettings[siteId] || {
      site_id: siteId,
      candidate_name: 'Nome do Candidato',
      candidate_number: '77000',
      position: 'Cargo Eleitoral',
      slogan: 'Slogan da campanha eleitoral',
      party: 'PARTIDO',
      municipality: 'São Paulo',
      state: 'SP',
      legal_information: 'Eleição 2026',
    };
  }

  public async updateSiteSettings(param1: string | Partial<SiteSettings>, param2?: Partial<SiteSettings>): Promise<SiteSettings> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const settings = typeof param1 === 'object' ? param1 : (param2 || {});

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('site_settings').upsert({ ...settings, site_id: siteId }).select().single();
      if (data) return data;
    }
    const all = this.get<Record<string, SiteSettings>>(STORAGE_KEYS.SITE_SETTINGS, SEED_SITE_SETTINGS);
    const current = all[siteId] || {
      site_id: siteId,
      candidate_name: 'Candidato',
      candidate_number: '77000',
      position: 'Cargo',
      party: 'PARTIDO',
      municipality: 'São Paulo',
      state: 'SP',
    };
    all[siteId] = {
      ...current,
      ...settings,
      site_id: siteId,
      updated_at: new Date().toISOString(),
    } as SiteSettings;
    this.set(STORAGE_KEYS.SITE_SETTINGS, all);
    return all[siteId];
  }

  // ===================== THEME SETTINGS =====================
  public async getThemeSettings(siteId: string): Promise<ThemeSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('theme_settings').select('*').eq('site_id', siteId).single();
      if (data) return data;
    }
    const all = this.get<Record<string, ThemeSettings>>(STORAGE_KEYS.THEME_SETTINGS, SEED_THEME_SETTINGS);
    return all[siteId] || {
      site_id: siteId,
      primary_color: '#0284c7',
      secondary_color: '#0f172a',
      accent_color: '#f59e0b',
      button_style: 'rounded-full',
      font_family: 'Plus Jakarta Sans',
      theme_mode: 'light',
    };
  }

  public async updateThemeSettings(param1: string | Partial<ThemeSettings>, param2?: Partial<ThemeSettings>): Promise<ThemeSettings> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const settings = typeof param1 === 'object' ? param1 : (param2 || {});

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('theme_settings').upsert({ ...settings, site_id: siteId }).select().single();
      if (data) return data;
    }
    const all = this.get<Record<string, ThemeSettings>>(STORAGE_KEYS.THEME_SETTINGS, SEED_THEME_SETTINGS);
    const current = all[siteId] || {
      site_id: siteId,
      primary_color: '#0284c7',
      secondary_color: '#0f172a',
      accent_color: '#f59e0b',
    };
    all[siteId] = {
      ...current,
      ...settings,
      site_id: siteId,
      updated_at: new Date().toISOString(),
    } as ThemeSettings;
    this.set(STORAGE_KEYS.THEME_SETTINGS, all);
    return all[siteId];
  }

  // ===================== HERO SECTION =====================
  public async getHero(siteId: string): Promise<HeroSection> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('hero').select('*').eq('site_id', siteId).single();
      if (data) return data;
    }
    const seed = SEED_HERO[siteId];
    const all = this.get<Record<string, HeroSection>>(STORAGE_KEYS.HERO, SEED_HERO);
    const stored = all[siteId];
    if (stored) {
      return {
        ...seed,
        ...stored,
        background_video_url: stored.background_video_url || seed?.background_video_url || '/hero.mp4',
      };
    }
    return seed || {
      site_id: siteId,
      title: 'Compromisso com o Futuro de São Paulo',
      subtitle: 'Conheça nossos projetos, trajetória e propostas.',
      candidate_name: 'Candidato',
      position: 'Deputado',
      primary_button_text: 'Ver Propostas',
      primary_button_url: '/propostas',
      secondary_button_text: 'Fale Conosco',
      secondary_button_url: '/contato',
      badge_text: 'Plano de Trabalho 2026',
      is_active: true,
    };
  }

  public async updateHero(param1: string | Partial<HeroSection>, param2?: Partial<HeroSection>): Promise<HeroSection> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const hero = typeof param1 === 'object' ? param1 : (param2 || {});

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('hero').upsert({ ...hero, site_id: siteId }).select().single();
      if (data) return data;
    }
    const all = this.get<Record<string, HeroSection>>(STORAGE_KEYS.HERO, SEED_HERO);
    const current = all[siteId] || {
      site_id: siteId,
      title: 'Compromisso com o Futuro',
      subtitle: 'Conheça nossos projetos',
      candidate_name: 'Candidato',
      position: 'Cargo',
      is_active: true,
    };
    all[siteId] = {
      ...current,
      ...hero,
      site_id: siteId,
      updated_at: new Date().toISOString(),
    } as HeroSection;
    this.set(STORAGE_KEYS.HERO, all);
    return all[siteId];
  }

  // ===================== INDICATORS (KPIS) =====================
  public async getIndicators(siteId: string, onlyActive = false): Promise<Indicator[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('indicators').select('*').eq('site_id', siteId);
      if (onlyActive) query = query.eq('is_active', true);
      const { data } = await query;
      if (data) return data;
    }
    const all = this.get<Indicator[]>(STORAGE_KEYS.INDICATORS, SEED_INDICATORS);
    return all
      .filter(i => i.site_id === siteId && (!onlyActive || i.is_active))
      .sort((a, b) => (a.display_order || a.sort_order || 0) - (b.display_order || b.sort_order || 0));
  }

  public async saveIndicator(param1: string | Partial<Indicator>, param2?: Partial<Indicator>): Promise<Indicator> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<Indicator[]>(STORAGE_KEYS.INDICATORS, SEED_INDICATORS);
    if (item.id) {
      const idx = all.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, site_id: siteId } as Indicator;
        this.set(STORAGE_KEYS.INDICATORS, all);
        return all[idx];
      }
    }
    const newItem: Indicator = {
      id: `ind-${Date.now()}`,
      site_id: siteId,
      value: item.value || '100+',
      title: item.title || 'Métrica',
      description: item.description,
      icon: item.icon || 'TrendingUp',
      display_order: item.display_order || item.sort_order || all.filter(i => i.site_id === siteId).length + 1,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.INDICATORS, all);
    return newItem;
  }

  public createIndicator = (item: Partial<Indicator>) => this.saveIndicator(item);
  public updateIndicator = (item: Partial<Indicator>) => this.saveIndicator(item);

  public async deleteIndicator(id: string): Promise<void> {
    const all = this.get<Indicator[]>(STORAGE_KEYS.INDICATORS, SEED_INDICATORS);
    this.set(STORAGE_KEYS.INDICATORS, all.filter(i => i.id !== id));
  }

  // ===================== ABOUT SECTION =====================
  public async getAbout(siteId: string): Promise<AboutSection> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('about').select('*').eq('site_id', siteId).single();
      if (data) return data;
    }
    const all = this.get<Record<string, AboutSection>>(STORAGE_KEYS.ABOUT, SEED_ABOUT);
    return all[siteId] || {
      site_id: siteId,
      title: 'Sobre Nossa História',
      biography: 'Biografia institucional e compromissos do candidato.',
      trajectory: 'Histórico de lutas e realizações.',
      quote: 'Nosso compromisso é com o povo.',
      is_active: true,
    };
  }

  public async updateAbout(param1: string | Partial<AboutSection>, param2?: Partial<AboutSection>): Promise<AboutSection> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const about = typeof param1 === 'object' ? param1 : (param2 || {});

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('about').upsert({ ...about, site_id: siteId }).select().single();
      if (data) return data;
    }
    const all = this.get<Record<string, AboutSection>>(STORAGE_KEYS.ABOUT, SEED_ABOUT);
    const current = all[siteId] || {
      site_id: siteId,
      title: 'Sobre Nossa História',
      biography: 'Biografia institucional',
      is_active: true,
    };
    all[siteId] = {
      ...current,
      ...about,
      site_id: siteId,
      updated_at: new Date().toISOString(),
    } as AboutSection;
    this.set(STORAGE_KEYS.ABOUT, all);
    return all[siteId];
  }

  // ===================== PROPOSALS & CATEGORIES =====================
  public async getProposalCategories(siteId: string, onlyActive = false): Promise<ProposalCategory[]> {
    const all = this.get<ProposalCategory[]>(STORAGE_KEYS.PROPOSAL_CATEGORIES, SEED_PROPOSAL_CATEGORIES);
    return all
      .filter(c => c.site_id === siteId && (!onlyActive || c.is_active))
      .sort((a, b) => (a.display_order || a.sort_order || 0) - (b.display_order || b.sort_order || 0));
  }

  public async saveProposalCategory(param1: string | Partial<ProposalCategory>, param2?: Partial<ProposalCategory>): Promise<ProposalCategory> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const cat = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<ProposalCategory[]>(STORAGE_KEYS.PROPOSAL_CATEGORIES, SEED_PROPOSAL_CATEGORIES);
    if (cat.id) {
      const idx = all.findIndex(c => c.id === cat.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...cat, site_id: siteId } as ProposalCategory;
        this.set(STORAGE_KEYS.PROPOSAL_CATEGORIES, all);
        return all[idx];
      }
    }
    const newCat: ProposalCategory = {
      id: `cat-${Date.now()}`,
      site_id: siteId,
      name: cat.name || 'Nova Categoria',
      display_order: cat.display_order || cat.sort_order || all.filter(c => c.site_id === siteId).length + 1,
      is_active: cat.is_active !== undefined ? cat.is_active : true,
    };
    all.push(newCat);
    this.set(STORAGE_KEYS.PROPOSAL_CATEGORIES, all);
    return newCat;
  }

  public createProposalCategory = (item: Partial<ProposalCategory>) => this.saveProposalCategory(item);

  public async deleteProposalCategory(id: string): Promise<void> {
    const all = this.get<ProposalCategory[]>(STORAGE_KEYS.PROPOSAL_CATEGORIES, SEED_PROPOSAL_CATEGORIES);
    this.set(STORAGE_KEYS.PROPOSAL_CATEGORIES, all.filter(c => c.id !== id));
  }

  public async getProposals(siteId: string, onlyPublished = false): Promise<Proposal[]> {
    const all = this.get<Proposal[]>(STORAGE_KEYS.PROPOSALS, SEED_PROPOSALS);
    const categories = await this.getProposalCategories(siteId);
    return all
      .filter(p => p.site_id === siteId && (!onlyPublished || p.is_active !== false))
      .sort((a, b) => (a.display_order || a.sort_order || 0) - (b.display_order || b.sort_order || 0))
      .map(p => ({
        ...p,
        category: categories.find(c => c.id === p.category_id),
      }));
  }

  public async saveProposal(param1: string | Partial<Proposal>, param2?: Partial<Proposal>): Promise<Proposal> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<Proposal[]>(STORAGE_KEYS.PROPOSALS, SEED_PROPOSALS);
    if (item.id) {
      const idx = all.findIndex(p => p.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, site_id: siteId, updated_at: new Date().toISOString() } as Proposal;
        this.set(STORAGE_KEYS.PROPOSALS, all);
        return all[idx];
      }
    }
    const newItem: Proposal = {
      id: `prop-${Date.now()}`,
      site_id: siteId,
      category_id: item.category_id || '',
      title: item.title || '',
      description: item.description || '',
      image_url: item.image_url,
      icon: item.icon || 'FileText',
      display_order: item.display_order || item.sort_order || all.filter(p => p.site_id === siteId).length + 1,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.PROPOSALS, all);
    return newItem;
  }

  public createProposal = (item: Partial<Proposal>) => this.saveProposal(item);
  public updateProposal = (item: Partial<Proposal>) => this.saveProposal(item);

  public async deleteProposal(id: string): Promise<void> {
    const all = this.get<Proposal[]>(STORAGE_KEYS.PROPOSALS, SEED_PROPOSALS);
    this.set(STORAGE_KEYS.PROPOSALS, all.filter(p => p.id !== id));
  }

  // ===================== ACTIONS =====================
  public async getActions(siteId: string, onlyPublished = false): Promise<ActionItem[]> {
    const all = this.get<ActionItem[]>(STORAGE_KEYS.ACTIONS, SEED_ACTIONS);
    return all
      .filter(a => a.site_id === siteId && (!onlyPublished || a.is_active !== false))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async saveAction(param1: string | Partial<ActionItem>, param2?: Partial<ActionItem>): Promise<ActionItem> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<ActionItem[]>(STORAGE_KEYS.ACTIONS, SEED_ACTIONS);
    if (item.id) {
      const idx = all.findIndex(a => a.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, site_id: siteId } as ActionItem;
        this.set(STORAGE_KEYS.ACTIONS, all);
        return all[idx];
      }
    }
    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      site_id: siteId,
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Infraestrutura',
      date: item.date || new Date().toISOString().split('T')[0],
      municipality: item.municipality || 'São Paulo',
      image_url: item.image_url,
      video_url: item.video_url,
      external_url: item.external_url,
      display_order: item.display_order || all.filter(a => a.site_id === siteId).length + 1,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.ACTIONS, all);
    return newItem;
  }

  public createAction = (item: Partial<ActionItem>) => this.saveAction(item);
  public updateAction = (item: Partial<ActionItem>) => this.saveAction(item);

  public async deleteAction(id: string): Promise<void> {
    const all = this.get<ActionItem[]>(STORAGE_KEYS.ACTIONS, SEED_ACTIONS);
    this.set(STORAGE_KEYS.ACTIONS, all.filter(a => a.id !== id));
  }

  // ===================== EVENTS =====================
  public async getEvents(siteId: string, onlyPublished = false): Promise<CampaignEvent[]> {
    const all = this.get<CampaignEvent[]>(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    return all
      .filter(e => e.site_id === siteId && (!onlyPublished || e.is_active !== false))
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  }

  public async saveEvent(param1: string | Partial<CampaignEvent>, param2?: Partial<CampaignEvent>): Promise<CampaignEvent> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<CampaignEvent[]>(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    if (item.id) {
      const idx = all.findIndex(e => e.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, site_id: siteId } as CampaignEvent;
        this.set(STORAGE_KEYS.EVENTS, all);
        return all[idx];
      }
    }
    const newItem: CampaignEvent = {
      id: `eve-${Date.now()}`,
      site_id: siteId,
      title: item.title || '',
      event_date: item.event_date || new Date().toISOString().split('T')[0],
      event_time: item.event_time || '19:00',
      municipality: item.municipality || 'São Paulo',
      location: item.location || 'Comitê Central',
      description: item.description,
      image_url: item.image_url,
      map_url: item.map_url,
      display_order: item.display_order || all.filter(e => e.site_id === siteId).length + 1,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.EVENTS, all);
    return newItem;
  }

  public createEvent = (item: Partial<CampaignEvent>) => this.saveEvent(item);
  public updateEvent = (item: Partial<CampaignEvent>) => this.saveEvent(item);

  public async deleteEvent(id: string): Promise<void> {
    const all = this.get<CampaignEvent[]>(STORAGE_KEYS.EVENTS, SEED_EVENTS);
    this.set(STORAGE_KEYS.EVENTS, all.filter(e => e.id !== id));
  }

  // ===================== NEWS =====================
  public async getNews(siteId: string, onlyPublished = false): Promise<NewsArticle[]> {
    const all = this.get<NewsArticle[]>(STORAGE_KEYS.NEWS, SEED_NEWS);
    return all
      .filter(n => n.site_id === siteId && (!onlyPublished || n.is_published))
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  public async getNewsBySlug(siteId: string, slug: string): Promise<NewsArticle | null> {
    const all = await this.getNews(siteId);
    return all.find(n => n.slug === slug || n.id === slug) || null;
  }

  public async saveNews(param1: string | Partial<NewsArticle>, param2?: Partial<NewsArticle>): Promise<NewsArticle> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<NewsArticle[]>(STORAGE_KEYS.NEWS, SEED_NEWS);
    const slug = item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `noticia-${Date.now()}`);

    if (item.id) {
      const idx = all.findIndex(n => n.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, slug, site_id: siteId, updated_at: new Date().toISOString() } as NewsArticle;
        this.set(STORAGE_KEYS.NEWS, all);
        return all[idx];
      }
    }
    const newItem: NewsArticle = {
      id: `news-${Date.now()}`,
      site_id: siteId,
      title: item.title || '',
      slug,
      summary: item.summary,
      content: item.content || '',
      image_url: item.image_url,
      category: item.category || 'Geral',
      author: item.author || 'Assessoria de Comunicação',
      published_at: item.published_at || new Date().toISOString().split('T')[0],
      is_published: item.is_published !== undefined ? item.is_published : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.NEWS, all);
    return newItem;
  }

  public createNews = (item: Partial<NewsArticle>) => this.saveNews(item);
  public updateNews = (item: Partial<NewsArticle>) => this.saveNews(item);

  public async deleteNews(id: string): Promise<void> {
    const all = this.get<NewsArticle[]>(STORAGE_KEYS.NEWS, SEED_NEWS);
    this.set(STORAGE_KEYS.NEWS, all.filter(n => n.id !== id));
  }

  // ===================== VIDEOS =====================
  public async getVideos(siteId: string, onlyActive = false): Promise<VideoItem[]> {
    const all = this.get<VideoItem[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    return all
      .filter(v => v.site_id === siteId && (!onlyActive || v.is_active))
      .sort((a, b) => (a.display_order || a.sort_order || 0) - (b.display_order || b.sort_order || 0));
  }

  public async saveVideo(param1: string | Partial<VideoItem>, param2?: Partial<VideoItem>): Promise<VideoItem> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<VideoItem[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    if (item.id) {
      const idx = all.findIndex(v => v.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, site_id: siteId } as VideoItem;
        this.set(STORAGE_KEYS.VIDEOS, all);
        return all[idx];
      }
    }
    const newItem: VideoItem = {
      id: `vid-${Date.now()}`,
      site_id: siteId,
      title: item.title || '',
      description: item.description,
      youtube_url: item.youtube_url || '',
      thumbnail_url: item.thumbnail_url,
      category: item.category || 'Pronunciamento',
      display_order: item.display_order || item.sort_order || all.filter(v => v.site_id === siteId).length + 1,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.VIDEOS, all);
    return newItem;
  }

  public createVideo = (item: Partial<VideoItem>) => this.saveVideo(item);
  public updateVideo = (item: Partial<VideoItem>) => this.saveVideo(item);

  public async deleteVideo(id: string): Promise<void> {
    const all = this.get<VideoItem[]>(STORAGE_KEYS.VIDEOS, SEED_VIDEOS);
    this.set(STORAGE_KEYS.VIDEOS, all.filter(v => v.id !== id));
  }

  // ===================== GALLERY =====================
  public async getGallery(siteId: string, onlyActive = false): Promise<GalleryItem[]> {
    const all = this.get<GalleryItem[]>(STORAGE_KEYS.GALLERY, SEED_GALLERY);
    return all
      .filter(g => g.site_id === siteId && (!onlyActive || g.is_active))
      .sort((a, b) => (a.display_order || a.sort_order || 0) - (b.display_order || b.sort_order || 0));
  }

  public async saveGalleryItem(param1: string | Partial<GalleryItem>, param2?: Partial<GalleryItem>): Promise<GalleryItem> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<GalleryItem[]>(STORAGE_KEYS.GALLERY, SEED_GALLERY);
    if (item.id) {
      const idx = all.findIndex(g => g.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, site_id: siteId } as GalleryItem;
        this.set(STORAGE_KEYS.GALLERY, all);
        return all[idx];
      }
    }
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      site_id: siteId,
      image_url: item.image_url || '',
      caption: item.caption,
      storage_path: item.storage_path,
      display_order: item.display_order || item.sort_order || all.filter(g => g.site_id === siteId).length + 1,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.GALLERY, all);
    return newItem;
  }

  public createGalleryItem = (item: Partial<GalleryItem>) => this.saveGalleryItem(item);
  public updateGalleryItem = (item: Partial<GalleryItem>) => this.saveGalleryItem(item);

  public async deleteGalleryItem(id: string): Promise<void> {
    const all = this.get<GalleryItem[]>(STORAGE_KEYS.GALLERY, SEED_GALLERY);
    this.set(STORAGE_KEYS.GALLERY, all.filter(g => g.id !== id));
  }

  // ===================== SOCIAL LINKS =====================
  public async getSocialLinks(siteId: string, onlyActive = false): Promise<SocialLink[]> {
    const all = this.get<SocialLink[]>(STORAGE_KEYS.SOCIAL_LINKS, SEED_SOCIAL_LINKS);
    return all
      .filter(s => s.site_id === siteId && (!onlyActive || s.is_active))
      .sort((a, b) => (a.display_order || a.sort_order || 0) - (b.display_order || b.sort_order || 0));
  }

  public async saveSocialLink(param1: string | Partial<SocialLink>, param2?: Partial<SocialLink>): Promise<SocialLink> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const item = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<SocialLink[]>(STORAGE_KEYS.SOCIAL_LINKS, SEED_SOCIAL_LINKS);
    if (item.id) {
      const idx = all.findIndex(s => s.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item, site_id: siteId } as SocialLink;
        this.set(STORAGE_KEYS.SOCIAL_LINKS, all);
        return all[idx];
      }
    }
    const newItem: SocialLink = {
      id: `soc-${Date.now()}`,
      site_id: siteId,
      platform: item.platform || 'instagram',
      url: item.url || '',
      username: item.username,
      icon: item.icon,
      display_order: item.display_order || item.sort_order || all.filter(s => s.site_id === siteId).length + 1,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
    };
    all.push(newItem);
    this.set(STORAGE_KEYS.SOCIAL_LINKS, all);
    return newItem;
  }

  public createSocialLink = (item: Partial<SocialLink>) => this.saveSocialLink(item);
  public updateSocialLink = (item: Partial<SocialLink>) => this.saveSocialLink(item);

  public async deleteSocialLink(id: string): Promise<void> {
    const all = this.get<SocialLink[]>(STORAGE_KEYS.SOCIAL_LINKS, SEED_SOCIAL_LINKS);
    this.set(STORAGE_KEYS.SOCIAL_LINKS, all.filter(s => s.id !== id));
  }

  // ===================== CONTACT SETTINGS =====================
  public async getContactSettings(siteId: string): Promise<ContactSettings> {
    const all = this.get<Record<string, ContactSettings>>(STORAGE_KEYS.CONTACT_SETTINGS, SEED_CONTACT_SETTINGS);
    return all[siteId] || {
      site_id: siteId,
      whatsapp: '(11) 99999-9999',
      email: 'contato@campanha.com.br',
      phone: '(11) 3333-3333',
      address: 'Rua Principal, 100 - Centro',
      city: 'São Paulo',
      state: 'SP',
    };
  }

  public async updateContactSettings(param1: string | Partial<ContactSettings>, param2?: Partial<ContactSettings>): Promise<ContactSettings> {
    const siteId = typeof param1 === 'string' ? param1 : param1.site_id!;
    const contact = typeof param1 === 'object' ? param1 : (param2 || {});

    const all = this.get<Record<string, ContactSettings>>(STORAGE_KEYS.CONTACT_SETTINGS, SEED_CONTACT_SETTINGS);
    const current = all[siteId] || {
      site_id: siteId,
      whatsapp: '(11) 99999-9999',
      email: 'contato@campanha.com.br',
    };
    all[siteId] = {
      ...current,
      ...contact,
      site_id: siteId,
      updated_at: new Date().toISOString(),
    } as ContactSettings;
    this.set(STORAGE_KEYS.CONTACT_SETTINGS, all);
    return all[siteId];
  }
}

export const dataStore = new LocalDataStore();
dataStore.init();
