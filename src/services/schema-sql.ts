export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- PLATAFORMA WHITE-LABEL DE PRESENÇA DIGITAL ELEITORAL
-- SUPABASE POSTGRESQL SCHEMA + MULTI-TENANT ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. TABELA PRINCIPAL DE SITES (TENANTS)
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  custom_domain VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEMBROS / USUÁRIOS VINCULADOS AOS SITES (RBAC)
CREATE TABLE IF NOT EXISTS site_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, user_id)
);

-- 3. CONFIGURAÇÕES GERAIS E INFORMAÇÕES ELEITORAIS (TSE)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL UNIQUE REFERENCES sites(id) ON DELETE CASCADE,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_number VARCHAR(20) NOT NULL,
  position VARCHAR(100) NOT NULL,
  party VARCHAR(50) NOT NULL,
  coalition VARCHAR(255),
  municipality VARCHAR(100),
  state VARCHAR(2),
  slogan VARCHAR(255),
  legal_information TEXT,
  cnpj VARCHAR(50),
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEMA E IDENTIDADE VISUAL
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL UNIQUE REFERENCES sites(id) ON DELETE CASCADE,
  theme_name VARCHAR(100) DEFAULT 'Moderno',
  primary_color VARCHAR(50) DEFAULT '#0284c7',
  secondary_color VARCHAR(50) DEFAULT '#0f172a',
  accent_color VARCHAR(50) DEFAULT '#f59e0b',
  font_family VARCHAR(100) DEFAULT 'Inter, sans-serif',
  button_style VARCHAR(50) DEFAULT 'rounded-full',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEÇÃO HERO
CREATE TABLE IF NOT EXISTS hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL UNIQUE REFERENCES sites(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  cta_text VARCHAR(100) DEFAULT 'Conheça Nossas Propostas',
  cta_link VARCHAR(255) DEFAULT '/propostas',
  secondary_cta_text VARCHAR(100) DEFAULT 'Receber Notícias no WhatsApp',
  secondary_cta_link VARCHAR(255) DEFAULT '/contato',
  hero_image_url TEXT,
  background_image_url TEXT,
  badge_text VARCHAR(100) DEFAULT 'Candidato Oficial 2026',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BIOGRAFIA E HISTÓRIA DO CANDIDATO
CREATE TABLE IF NOT EXISTS about_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL UNIQUE REFERENCES sites(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  biography TEXT NOT NULL,
  trajectory TEXT,
  quote TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDICADORES E MÉTRICAS (KPIS)
CREATE TABLE IF NOT EXISTS indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  value VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'TrendingUp',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CATEGORIAS DE PROPOSTAS
CREATE TABLE IF NOT EXISTS proposal_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROPOSTAS DA CAMPANHA
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  category_id UUID REFERENCES proposal_categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  icon VARCHAR(50) DEFAULT 'FileText',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AÇÕES, OBRAS E CONQUISTAS
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'Infraestrutura',
  date VARCHAR(50),
  municipality VARCHAR(100),
  image_url TEXT,
  external_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AGENDA OFICIAL E EVENTOS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  municipality VARCHAR(100),
  map_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTÍCIAS E ARTIGOS
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'Geral',
  author VARCHAR(100) DEFAULT 'Assessoria de Comunicação',
  image_url TEXT,
  published_at DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

-- 13. VÍDEOS (YOUTUBE)
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100) DEFAULT 'Pronunciamento',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. GALERIA DE FOTOS
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. REDES SOCIAIS
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  username VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CONTATO E ATENDIMENTO
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL UNIQUE REFERENCES sites(id) ON DELETE CASCADE,
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  office_hours VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & HELPER FUNCTIONS
-- ==============================================================================

-- Função auxiliar que verifica se o usuário autenticado é membro do site
CREATE OR REPLACE FUNCTION public.is_member_of(target_site_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM site_members
    WHERE site_id = target_site_id
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS em todas as tabelas
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PÚBLICAS DE LEITURA (ANON / VISITANTES)
CREATE POLICY "Public Read Active Sites" ON sites FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Theme" ON theme_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Hero" ON hero_section FOR SELECT USING (true);
CREATE POLICY "Public Read About" ON about_section FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Indicators" ON indicators FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Categories" ON proposal_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Proposals" ON proposals FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Actions" ON actions FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read News" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Videos" ON videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Social" ON social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Contact" ON contact_settings FOR SELECT USING (true);

-- POLÍTICAS DE GESTÃO DO ADMIN (MEMBROS AUTENTICADOS DO TENANT ESPECÍFICO)
CREATE POLICY "Admin Full Access Settings" ON site_settings FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Theme" ON theme_settings FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Hero" ON hero_section FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access About" ON about_section FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Indicators" ON indicators FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Categories" ON proposal_categories FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Proposals" ON proposals FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Actions" ON actions FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Events" ON events FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access News" ON news FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Videos" ON videos FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Gallery" ON gallery FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Social" ON social_links FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Full Access Contact" ON contact_settings FOR ALL USING (public.is_member_of(site_id));
CREATE POLICY "Admin Read Members" ON site_members FOR SELECT USING (public.is_member_of(site_id));
`;
