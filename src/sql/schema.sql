-- ==============================================================================
-- PLATAFORMA WHITE-LABEL MULTI-TENANT DE PRESENÇA DIGITAL ELEITORAL
-- SUPABASE POSTGRESQL SCHEMA + ROW LEVEL SECURITY (RLS) + STORAGE POLICIES
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA CENTRAL DE SITES (TENANTS)
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PERFIS DE USUÁRIOS (Sincronizado com auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MEMBROS E PERMISSÕES DO SITE (MULTI-TENANT RBAC)
CREATE TABLE IF NOT EXISTS public.site_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (site_id, user_id)
);

-- FUNÇÃO AUXILIAR DE SEGURANÇA PARA VERIFICAR SE O USUÁRIO PERTENCE AO SITE
CREATE OR REPLACE FUNCTION public.is_member_of(site_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.site_members
    WHERE site_members.site_id = is_member_of.site_id
      AND site_members.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNÇÃO AUXILIAR PARA VERIFICAR CARGO MÍNIMO (OWNER/ADMIN)
CREATE OR REPLACE FUNCTION public.is_admin_of(site_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.site_members
    WHERE site_members.site_id = is_admin_of.site_id
      AND site_members.user_id = auth.uid()
      AND site_members.role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CONFIGURAÇÕES GERAIS DO CANDIDATO / CAMPANHA
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID UNIQUE NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    candidate_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    slogan TEXT,
    party VARCHAR(100),
    candidate_number VARCHAR(20),
    coalition TEXT,
    municipality VARCHAR(255) NOT NULL,
    state VARCHAR(10) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    domain VARCHAR(255),
    logo_url TEXT,
    favicon_url TEXT,
    legal_information TEXT,
    cnpj VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TEMA E APARÊNCIA VISUAL
CREATE TABLE IF NOT EXISTS public.theme_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID UNIQUE NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    primary_color VARCHAR(50) DEFAULT '#0284c7' NOT NULL,
    secondary_color VARCHAR(50) DEFAULT '#0f172a' NOT NULL,
    accent_color VARCHAR(50) DEFAULT '#f59e0b' NOT NULL,
    button_style VARCHAR(50) DEFAULT 'rounded-full' NOT NULL CHECK (button_style IN ('rounded-full', 'rounded-lg', 'rounded-none')),
    font_family VARCHAR(50) DEFAULT 'Plus Jakarta Sans' NOT NULL,
    theme_mode VARCHAR(50) DEFAULT 'light' NOT NULL CHECK (theme_mode IN ('light', 'dark', 'system')),
    preset_name VARCHAR(50) DEFAULT 'moderno',
    logo_url TEXT,
    favicon_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. HERO SECTION
CREATE TABLE IF NOT EXISTS public.hero (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID UNIQUE NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    candidate_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    image_url TEXT,
    primary_button_text VARCHAR(100) DEFAULT 'Conheça as Propostas',
    primary_button_url VARCHAR(255) DEFAULT '/propostas',
    secondary_button_text VARCHAR(100) DEFAULT 'Fale no WhatsApp',
    secondary_button_url VARCHAR(255) DEFAULT '/contato',
    badge_text VARCHAR(100) DEFAULT 'Compromisso com o Futuro',
    is_active BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. INDICADORES (KPIS)
CREATE TABLE IF NOT EXISTS public.indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'TrendingUp',
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. SOBRE / BIOGRAFIA
CREATE TABLE IF NOT EXISTS public.about (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID UNIQUE NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    biography TEXT NOT NULL,
    trajectory TEXT,
    professional_info TEXT,
    image_url TEXT,
    quote TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. CATEGORIAS DE PROPOSTAS
CREATE TABLE IF NOT EXISTS public.proposal_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    UNIQUE (site_id, slug)
);

-- 11. PROPOSTAS
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.proposal_categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    icon VARCHAR(100) DEFAULT 'FileText',
    sort_order INT DEFAULT 0 NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. ATUAÇÃO / AÇÕES / PROJETOS
CREATE TABLE IF NOT EXISTS public.actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    municipality VARCHAR(255) NOT NULL,
    image_url TEXT,
    video_url TEXT,
    external_url TEXT,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. AGENDA DE EVENTOS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(50) NOT NULL,
    municipality VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    map_url TEXT,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. NOTÍCIAS
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (site_id, slug)
);

-- 15. VÍDEOS (YOUTUBE)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. GALERIA DE FOTOS
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    caption TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. REDES SOCIAIS
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- 18. CONFIGURAÇÕES DE CONTATO
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID UNIQUE NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    whatsapp VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(10),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    tiktok VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ÍNDICES PARA ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_sites_slug ON public.sites(slug);
CREATE INDEX IF NOT EXISTS idx_site_members_user ON public.site_members(user_id);
CREATE INDEX IF NOT EXISTS idx_site_members_site ON public.site_members(site_id);
CREATE INDEX IF NOT EXISTS idx_proposals_site ON public.proposals(site_id);
CREATE INDEX IF NOT EXISTS idx_proposals_published ON public.proposals(site_id, is_published);
CREATE INDEX IF NOT EXISTS idx_actions_site ON public.actions(site_id, is_published);
CREATE INDEX IF NOT EXISTS idx_events_site ON public.events(site_id, is_published, event_date);
CREATE INDEX IF NOT EXISTS idx_news_site_slug ON public.news(site_id, slug);
CREATE INDEX IF NOT EXISTS idx_news_site_published ON public.news(site_id, is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_site ON public.videos(site_id, is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_site ON public.gallery(site_id, is_active);
CREATE INDEX IF NOT EXISTS idx_indicators_site ON public.indicators(site_id, is_active);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- 1. POLÍTICAS PARA SITES
-- Público: Pode ler sites ativos
CREATE POLICY "Public read active sites" ON public.sites 
  FOR SELECT USING (status = 'active');

-- Membros: Podem ler seus sites
CREATE POLICY "Members can view own sites" ON public.sites 
  FOR SELECT USING (public.is_member_of(id));

-- Owners/Admins: Podem atualizar seus sites
CREATE POLICY "Admins can update own site" ON public.sites 
  FOR UPDATE USING (public.is_admin_of(id));

-- 2. POLÍTICAS PARA PROFILES
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. POLÍTICAS PARA SITE_MEMBERS
CREATE POLICY "Members can view site members" ON public.site_members 
  FOR SELECT USING (public.is_member_of(site_id));

CREATE POLICY "Admins can manage site members" ON public.site_members 
  FOR ALL USING (public.is_admin_of(site_id));

-- 4. POLÍTICAS PARA CONTEÚDO PÚBLICO (SELECT)
-- Qualquer visitante pode ler dados públicos publicados do site ativo
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view theme settings" ON public.theme_settings FOR SELECT USING (true);
CREATE POLICY "Public can view hero" ON public.hero FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view indicators" ON public.indicators FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view about" ON public.about FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view proposal categories" ON public.proposal_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published proposals" ON public.proposals FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published actions" ON public.actions FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published events" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published news" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view videos" ON public.videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view social links" ON public.social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view contact settings" ON public.contact_settings FOR SELECT USING (true);

-- 5. POLÍTICAS DE GESTÃO PARA MEMBROS AUTENTICADOS (INSERT, UPDATE, DELETE)
-- Membros autenticados com cargo no site correspondente

-- TABELA: site_settings
CREATE POLICY "Members can manage site settings" ON public.site_settings 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: theme_settings
CREATE POLICY "Members can manage theme settings" ON public.theme_settings 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: hero
CREATE POLICY "Members can manage hero" ON public.hero 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: indicators
CREATE POLICY "Members can manage indicators" ON public.indicators 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: about
CREATE POLICY "Members can manage about" ON public.about 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: proposal_categories
CREATE POLICY "Members can manage proposal categories" ON public.proposal_categories 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: proposals
CREATE POLICY "Members can manage proposals" ON public.proposals 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: actions
CREATE POLICY "Members can manage actions" ON public.actions 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: events
CREATE POLICY "Members can manage events" ON public.events 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: news
CREATE POLICY "Members can manage news" ON public.news 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: videos
CREATE POLICY "Members can manage videos" ON public.videos 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: gallery
CREATE POLICY "Members can manage gallery" ON public.gallery 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: social_links
CREATE POLICY "Members can manage social links" ON public.social_links 
  FOR ALL USING (public.is_member_of(site_id));

-- TABELA: contact_settings
CREATE POLICY "Members can manage contact settings" ON public.contact_settings 
  FOR ALL USING (public.is_member_of(site_id));

-- ==============================================================================
-- SUPABASE STORAGE BUCKET & POLICIES
-- ==============================================================================
-- Inserir bucket 'campaign-assets' se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('campaign-assets', 'campaign-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública de assets
CREATE POLICY "Public Read Campaign Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaign-assets');

-- Upload restrito a membros autorizados
CREATE POLICY "Members Upload Campaign Assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'campaign-assets' AND
  auth.role() = 'authenticated'
);

-- Delete restrito a membros autorizados
CREATE POLICY "Members Delete Campaign Assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'campaign-assets' AND
  auth.role() = 'authenticated'
);
