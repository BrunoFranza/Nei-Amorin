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
  ContactSettings
} from '../types';

export const SEED_SITES: Site[] = [
  {
    id: 'site-ney-amorim',
    name: 'Ney Amorim — Deputado Federal MDB/AC',
    slug: 'ney-amorim',
    domain: 'neyamorim.com.br',
    status: 'active',
    is_active: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-08-21T00:00:00Z',
  },
  {
    id: 'site-a-uuid-carlos',
    name: 'Ney Amorim — Deputado Federal',
    slug: 'ney-amorim-oficial',
    domain: 'neyamorim.com.br',
    status: 'active',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'site-b-uuid-mariana',
    name: 'Campanha Mariana Silveira',
    slug: 'mariana-silveira',
    domain: 'marianasilveira.eleicoes.br',
    status: 'active',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
];

export const SEED_PROFILES: Profile[] = [
  {
    id: 'user-master-bruno',
    email: 'brunofranza@gmail.com',
    full_name: 'Bruno Franza (Administrador Geral)',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 'user-admin-ney',
    email: 'admin@neyamorim.com.br',
    full_name: 'Coordenação Geral (Ney Amorim)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'user-admin-a-uuid',
    email: 'adminA@campanha.com',
    full_name: 'Roberto Mendes (Coord. Geral Ney Amorim)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-admin-b-uuid',
    email: 'adminB@campanha.com',
    full_name: 'Juliana Castro (Coord. Mariana)',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user-editor-a-uuid',
    email: 'editorA@campanha.com',
    full_name: 'Felipe Alcantara (Comunicação Ney Amorim)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-superadmin-uuid',
    email: 'superadmin@plataforma.com',
    full_name: 'Suporte Plataforma White-Label',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T10:00:00Z',
  }
];

export const SEED_SITE_MEMBERS: SiteMember[] = [
  {
    id: 'mem-1',
    site_id: 'site-a-uuid-carlos',
    user_id: 'user-admin-a-uuid',
    role: 'owner',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'mem-2',
    site_id: 'site-a-uuid-carlos',
    user_id: 'user-editor-a-uuid',
    role: 'editor',
    created_at: '2026-01-16T10:00:00Z',
  },
  {
    id: 'mem-3',
    site_id: 'site-b-uuid-mariana',
    user_id: 'user-admin-b-uuid',
    role: 'owner',
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'mem-4',
    site_id: 'site-a-uuid-carlos',
    user_id: 'user-superadmin-uuid',
    role: 'owner',
    created_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 'mem-5',
    site_id: 'site-b-uuid-mariana',
    user_id: 'user-superadmin-uuid',
    role: 'owner',
    created_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 'mem-ney-owner',
    site_id: 'site-ney-amorim',
    user_id: 'user-admin-a-uuid',
    role: 'owner',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'mem-ney-superadmin',
    site_id: 'site-ney-amorim',
    user_id: 'user-superadmin-uuid',
    role: 'owner',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'mem-ney-bruno',
    site_id: 'site-ney-amorim',
    user_id: 'user-master-bruno',
    role: 'owner',
    created_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 'mem-a-bruno',
    site_id: 'site-a-uuid-carlos',
    user_id: 'user-master-bruno',
    role: 'owner',
    created_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 'mem-b-bruno',
    site_id: 'site-b-uuid-mariana',
    user_id: 'user-master-bruno',
    role: 'owner',
    created_at: '2026-01-01T10:00:00Z',
  },
];

export const SEED_SITE_SETTINGS: Record<string, SiteSettings> = {
  'site-ney-amorim': {
    site_id: 'site-ney-amorim',
    candidate_name: 'Ney Amorim',
    position: 'Deputado Federal',
    slogan: 'Trabalho, compromisso e união pelo futuro do Acre',
    party: 'MDB — Movimento Democrático Brasileiro',
    candidate_number: '1577',
    coalition: 'Coligação Acre em Frente (MDB / Solidariedade / Avante)',
    municipality: 'Rio Branco',
    state: 'AC',
    phone: '',
    whatsapp: '',
    email: 'contato@neyamorim.com.br',
    domain: 'neyamorim.com.br',
    logo_url: '',
    legal_information: 'Eleição 2026 — Ney Amorim, Deputado Federal pelo Acre (AC) — MDB 1577. Prestação de Contas conforme legislação eleitoral vigente (TSE).',
    cnpj: '',
  },
  'site-a-uuid-carlos': {
    site_id: 'site-a-uuid-carlos',
    candidate_name: 'Ney Amorim',
    position: 'Deputado Federal',
    slogan: 'Trabalho Sério, União e Progresso para o Povo do Acre',
    party: 'MDB - Movimento Democrático Brasileiro',
    candidate_number: '1577',
    coalition: 'Pelo Futuro do Acre (MDB / UNIÃO)',
    municipality: 'Rio Branco',
    state: 'AC',
    phone: '(68) 3224-5000',
    whatsapp: '(68) 99988-7766',
    email: 'contato@neyamorim.com.br',
    domain: 'neyamorim.com.br',
    logo_url: '',
    legal_information: 'Eleição 2026 Ney Amorim Deputado Federal — CNPJ da Campanha: 12.345.678/0001-90 — Prestação de Contas Aberta e Transparente.',
    cnpj: '12.345.678/0001-90',
  },
  'site-b-uuid-mariana': {
    site_id: 'site-b-uuid-mariana',
    candidate_name: 'Mariana Silveira',
    position: 'Prefeita',
    slogan: 'Uma Nova Cidade com Gestão Humanizada e Sustentável',
    party: 'APF - Aliança pelo Futuro',
    candidate_number: '44',
    coalition: 'Coligação Juntos por Nossa Cidade (APF / CIDADANIA VIVA)',
    municipality: 'Curitiba',
    state: 'PR',
    phone: '(41) 3322-1100',
    whatsapp: '(41) 99888-7766',
    email: 'falecom@marianasilveira.com.br',
    domain: 'marianasilveira.eleicoes.br',
    logo_url: '',
    legal_information: 'Eleição 2026 Mariana Silveira Prefeita - CNPJ da Campanha: 98.765.432/0001-10 - Coligação Juntos por Nossa Cidade.',
    cnpj: '98.765.432/0001-10',
  },
};

export const SEED_THEME_SETTINGS: Record<string, ThemeSettings> = {
  'site-ney-amorim': {
    site_id: 'site-ney-amorim',
    primary_color: '#1a6b3a',   // Verde Amazônia — referência à floresta e à bandeira do Acre
    secondary_color: '#0d2b4e', // Azul profundo — referência ao céu e ao Rio Acre
    accent_color: '#f5c518',    // Amarelo ouro — contraste e energia
    button_style: 'rounded-full',
    font_family: 'Plus Jakarta Sans',
    theme_mode: 'light',
    preset_name: 'acre-verde',
  },
  'site-a-uuid-carlos': {
    site_id: 'site-a-uuid-carlos',
    primary_color: '#0284c7', // Sky 600
    secondary_color: '#0f172a', // Slate 900
    accent_color: '#f59e0b', // Amber 500
    button_style: 'rounded-full',
    font_family: 'Plus Jakarta Sans',
    theme_mode: 'light',
    preset_name: 'moderno',
  },
  'site-b-uuid-mariana': {
    site_id: 'site-b-uuid-mariana',
    primary_color: '#0d9488', // Teal 600
    secondary_color: '#1e293b', // Slate 800
    accent_color: '#ea580c', // Orange 600
    button_style: 'rounded-lg',
    font_family: 'Poppins',
    theme_mode: 'light',
    preset_name: 'elegante',
  },
};

export const SEED_HERO: Record<string, HeroSection> = {
  'site-ney-amorim': {
    site_id: 'site-ney-amorim',
    title: 'Trabalho, Compromisso e União pelo Futuro do Acre',
    subtitle: 'Um acreano que luta pelo desenvolvimento regional, pela segurança da nossa gente, pelo agronegócio e pelos empregos que o Acre merece ter.',
    candidate_name: 'Ney Amorim',
    position: 'Deputado Federal pelo Acre — 1577',
    image_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80',
    background_video_url: '/hero.mp4',
    primary_button_text: 'Conheça o Plano de Trabalho',
    primary_button_url: '/propostas',
    secondary_button_text: 'Fale Conosco',
    secondary_button_url: '/contato',
    badge_text: 'MDB 1577 — Deputado Federal AC',
    is_active: true,
  },
  'site-a-uuid-carlos': {
    site_id: 'site-a-uuid-carlos',
    title: 'Compromisso com o Futuro, Desenvolvimento Regional e Saúde no Acre',
    subtitle: 'Liderança experiente, defensor do fortalecimento dos municípios acreanos e da recuperação da infraestrutura.',
    candidate_name: 'Ney Amorim',
    position: 'Deputado Federal — 1577',
    image_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80',
    background_video_url: '/hero.mp4',
    primary_button_text: 'Ver Plano de Metas',
    primary_button_url: '/propostas',
    secondary_button_text: 'Fale Conosco no WhatsApp',
    secondary_button_url: '/contato',
    badge_text: 'Compromisso, Ética e Trabalho',
    is_active: true,
  },
  'site-b-uuid-mariana': {
    site_id: 'site-b-uuid-mariana',
    title: 'Gestão Humanizada, Cidade Inteligente e Oportunidades para Todos',
    subtitle: 'Urbanista, professora universitária e defensora de uma administração transparente, sustentável e focada nos bairros.',
    candidate_name: 'Mariana Silveira',
    position: 'Candidata a Prefeita — 44',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    primary_button_text: 'Conheça Nossas Propostas',
    primary_button_url: '/propostas',
    secondary_button_text: 'Envie sua Sugestão',
    secondary_button_url: '/contato',
    badge_text: 'Uma Nova Visão para Nossa Capital',
    is_active: true,
  },
};

export const SEED_INDICATORS: Indicator[] = [
  // Ney Amorim - Acre
  {
    id: 'ind-ney-1',
    site_id: 'site-ney-amorim',
    title: 'Municípios do Acre',
    value: '22',
    description: 'Compromisso com cada um dos 22 municípios acreanos, do Alto Acre ao Juruá',
    icon: 'MapPin',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'ind-ney-2',
    site_id: 'site-ney-amorim',
    title: 'Desenvolvimento e Obras',
    value: 'R$ 150M+',
    description: 'Meta de recursos e emendas federais para infraestrutura, saneamento e pontes',
    icon: 'TrendingUp',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'ind-ney-3',
    site_id: 'site-ney-amorim',
    title: 'Apoio ao Produtor Rural',
    value: '100%',
    description: 'Incentivo contínuo ao agronegócio sustentável e à agricultura familiar do Acre',
    icon: 'ShieldCheck',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'ind-ney-4',
    site_id: 'site-ney-amorim',
    title: 'Presença e Escuta',
    value: 'Forte',
    description: 'Gabinete aberto e diálogo permanente com as lideranças e o povo do Acre',
    icon: 'Users',
    sort_order: 4,
    is_active: true,
  },

  // Site A
  {
    id: 'ind-a-1',
    site_id: 'site-a-uuid-carlos',
    title: 'Projetos e Emendas',
    value: '142+',
    description: 'Projetos de lei e iniciativas com foco em saúde pública e capacitação profissional',
    icon: 'FileText',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'ind-a-2',
    site_id: 'site-a-uuid-carlos',
    title: 'Recursos Destinados',
    value: 'R$ 84M',
    description: 'Investimentos diretos para compra de ambulâncias, reformas de UBS e hospitais',
    icon: 'TrendingUp',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'ind-a-3',
    site_id: 'site-a-uuid-carlos',
    title: 'Municípios Atendidos',
    value: '68',
    description: 'Cidades visitadas e com projetos ativos de descentralização de recursos',
    icon: 'MapPin',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'ind-a-4',
    site_id: 'site-a-uuid-carlos',
    title: 'Transparência e Prestação',
    value: '100%',
    description: 'Todos os votos e emendas parlamentares detalhados em portal aberto',
    icon: 'ShieldCheck',
    sort_order: 4,
    is_active: true,
  },

  // Site B
  {
    id: 'ind-b-1',
    site_id: 'site-b-uuid-mariana',
    title: 'Bairros Mapeados',
    value: '75',
    description: 'Audiências comunitárias realizadas para diagnóstico participativo',
    icon: 'MapPin',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'ind-b-2',
    site_id: 'site-b-uuid-mariana',
    title: 'Compromissos Firmados',
    value: '50',
    description: 'Metas prioritárias com cronograma público de execução nos primeiros 100 dias',
    icon: 'CheckCircle2',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'ind-b-3',
    site_id: 'site-b-uuid-mariana',
    title: 'Propostas Participativas',
    value: '2.400+',
    description: 'Sugestões enviadas por cidadãos via plataforma digital de cocriação',
    icon: 'Users',
    sort_order: 3,
    is_active: true,
  },
];

export const SEED_ABOUT: Record<string, AboutSection> = {
  'site-ney-amorim': {
    site_id: 'site-ney-amorim',
    title: 'Conheça Ney Amorim',
    biography: 'Ney Amorim é uma liderança respeitada e com sólida trajetória de serviços prestados ao Estado do Acre. Com vasta experiência na vida pública, incluindo sua marcante presidência na Assembleia Legislativa do Acre (ALEAC), sempre pautou sua atuação pela escuta atenta, pelo diálogo construtivo e pela busca incansável de soluções para os problemas do povo acreano.',
    trajectory: 'Construiu sua carreira ouvindo as comunidades de Rio Branco, Cruzeiro do Sul, Sena Madureira, Tarauacá, Brasileia e de todos os cantos do nosso estado. Sua jornada política é marcada pela lealdade, pelo respeito aos produtores rurais, pelo apoio aos trabalhadores e pelo compromisso com o progresso do Acre.',
    professional_info: 'Com profunda capacidade de articulação política em Brasília e amplo conhecimento das necessidades locais, Ney Amorim representa a força, a coragem e a união necessárias para defender os interesses do Acre no Congresso Nacional.',
    quote: '"O Acre precisa de união, trabalho sério e representatividade forte em Brasília para garantir os investimentos que transformam a vida das nossas famílias."',
    image_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
  'site-a-uuid-carlos': {
    site_id: 'site-a-uuid-carlos',
    title: 'Conheça Ney Amorim',
    biography: 'Ney Amorim construiu sua trajetória na vida pública com diálogo amplo, capacidade de articulação e compromisso com o Acre. Presidiu a Assembleia Legislativa do Estado do Acre (Aleac), onde liderou votações históricas e modernizou a gestão da casa de leis.',
    trajectory: 'Sua atuação se destaca pela capacidade de unir diferentes forças políticas em prol do bem comum, sempre defendendo o produtor rural, a valorização dos servidores públicos e obras estruturantes para as cidades acreanas.',
    professional_info: 'Candidato a Deputado Federal pelo MDB com forte articulação para canalizar recursos federais em prol da infraestrutura, saúde e agricultura familiar.',
    quote: '"Política se faz com escuta ativa, união e coragem para colocar o interesse do povo acreano sempre em primeiro lugar."',
    image_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
  'site-b-uuid-mariana': {
    site_id: 'site-b-uuid-mariana',
    title: 'Conheça Mariana Silveira',
    biography: 'Arquiteta e Urbanista com mestrado em Planejamento Urbano e Cidades Sustentáveis. Professora com 15 anos de experiência e consultora de mobilidade urbana e habitação de interesse social para diversos municípios do Brasil e exterior.',
    trajectory: 'Coordenou o plano diretor participativo e projetos de requalificação de praças, ciclovias e centros de convivência infantil. Dedica sua vida à construção de espaços mais humanos, seguros e inclusivos.',
    professional_info: 'Especialista em governança metropolitana, energias renováveis na infraestrutura pública e transparência digital governamental.',
    quote: '"Uma cidade moderna cuida de todos os seus bairros com a mesma atenção dedicada ao centro financeiro."',
    image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
};

export const SEED_PROPOSAL_CATEGORIES: ProposalCategory[] = [
  // Ney Amorim - Acre
  { id: 'cat-ney-1', site_id: 'site-ney-amorim', name: 'Desenvolvimento & Infraestrutura', slug: 'infraestrutura', sort_order: 1, is_active: true },
  { id: 'cat-ney-2', site_id: 'site-ney-amorim', name: 'Segurança Pública & Apoio Policial', slug: 'seguranca', sort_order: 2, is_active: true },
  { id: 'cat-ney-3', site_id: 'site-ney-amorim', name: 'Agronegócio Sustentável & Produtor Rural', slug: 'agronegocio', sort_order: 3, is_active: true },
  { id: 'cat-ney-4', site_id: 'site-ney-amorim', name: 'Emprego, Renda & Empreendedorismo', slug: 'emprego-renda', sort_order: 4, is_active: true },

  // Site A
  { id: 'cat-a-1', site_id: 'site-a-uuid-carlos', name: 'Saúde & Bem-Estar', slug: 'saude', sort_order: 1, is_active: true },
  { id: 'cat-a-2', site_id: 'site-a-uuid-carlos', name: 'Educação & Tecnologia', slug: 'educacao', sort_order: 2, is_active: true },
  { id: 'cat-a-3', site_id: 'site-a-uuid-carlos', name: 'Segurança & Cidadania', slug: 'seguranca', sort_order: 3, is_active: true },
  { id: 'cat-a-4', site_id: 'site-a-uuid-carlos', name: 'Desenvolvimento Econômico', slug: 'economia', sort_order: 4, is_active: true },

  // Site B
  { id: 'cat-b-1', site_id: 'site-b-uuid-mariana', name: 'Mobilidade & Transporte', slug: 'mobilidade', sort_order: 1, is_active: true },
  { id: 'cat-b-2', site_id: 'site-b-uuid-mariana', name: 'Meio Ambiente & Clima', slug: 'meio-ambiente', sort_order: 2, is_active: true },
  { id: 'cat-b-3', site_id: 'site-b-uuid-mariana', name: 'Primeira Infância & Creches', slug: 'infancia', sort_order: 3, is_active: true },
  { id: 'cat-b-4', site_id: 'site-b-uuid-mariana', name: 'Inovação e Bairros', slug: 'inovacao', sort_order: 4, is_active: true },
];

export const SEED_PROPOSALS: Proposal[] = [
  // Ney Amorim - Acre
  {
    id: 'prop-ney-1',
    site_id: 'site-ney-amorim',
    category_id: 'cat-ney-1',
    title: 'Infraestrutura Integrada e Conexão dos Municípios Acreanos',
    description: 'Destinação de emendas de grande porte para recuperação de rodovias federais e estaduais (BR-364 e BR-317), construção de pontes, asfaltamento de ramais e garantia de trafegabilidade o ano inteiro.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    icon: 'TrendingUp',
    sort_order: 1,
    is_published: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-08-21T00:00:00Z',
  },
  {
    id: 'prop-ney-2',
    site_id: 'site-ney-amorim',
    category_id: 'cat-ney-2',
    title: 'Fortalecimento da Segurança e Valorização das Forças Policiais',
    description: 'Aporte de recursos para modernização de viaturas, armamento, tecnologia de inteligência, controle de fronteiras e valorização salarial e estrutural das Polícias Civil, Militar e Penal do Acre.',
    image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
    icon: 'Shield',
    sort_order: 2,
    is_published: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-08-21T00:00:00Z',
  },
  {
    id: 'prop-ney-3',
    site_id: 'site-ney-amorim',
    category_id: 'cat-ney-3',
    title: 'Incentivo ao Agronegócio Sustentável e Apoio aos Produtores Rurais',
    description: 'Criação de linhas de crédito facilitado, mecanização agrícola para pequenas e médias propriedades, assistência técnica contínua e apoio ao escoamento da produção da agricultura familiar.',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    icon: 'CheckCircle2',
    sort_order: 3,
    is_published: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-08-21T00:00:00Z',
  },
  {
    id: 'prop-ney-4',
    site_id: 'site-ney-amorim',
    category_id: 'cat-ney-4',
    title: 'Geração de Emprego, Renda e Fomento ao Empreendedorismo Local',
    description: 'Desoneração para abertura de pequenas empresas, polos de qualificação técnica para jovens nos bairros e atração de indústrias e investimentos privados para o Acre.',
    image_url: 'https://images.unsplash.com/photo-1556742049-0a67e557b63f?w=600&auto=format&fit=crop&q=80',
    icon: 'Briefcase',
    sort_order: 4,
    is_published: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-08-21T00:00:00Z',
  },

  // Site A
  {
    id: 'prop-a-1',
    site_id: 'site-a-uuid-carlos',
    category_id: 'cat-a-1',
    title: 'Programa Fila Zero de Especialistas e Exames de Imagem',
    description: 'Criação de centros regionais de diagnóstico rápido e parcerias estratégicas para zerar o tempo de espera por tomografias, ressonâncias e consultas médicas especializadas.',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    icon: 'Activity',
    sort_order: 1,
    is_published: true,
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'prop-a-2',
    site_id: 'site-a-uuid-carlos',
    category_id: 'cat-a-2',
    title: 'Escola Conectada e Bolsas em Inteligência Artificial',
    description: 'Implementação de laboratórios modernos de robótica e programação em 100% das escolas públicas, com bolsas de incentivo para jovens do ensino médio.',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    icon: 'Laptop',
    sort_order: 2,
    is_published: true,
    created_at: '2026-02-12T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'prop-a-3',
    site_id: 'site-a-uuid-carlos',
    category_id: 'cat-a-4',
    title: 'Crédito Fácil e Menos Burocracia para o Pequeno Empreendedor',
    description: 'Linhas de microcrédito orientado com taxa zero para mulheres empreendedoras e jovens abrindo seu primeiro negócio comercial ou de serviços.',
    image_url: 'https://images.unsplash.com/photo-1556742049-0a67e557b63f?w=600&auto=format&fit=crop&q=80',
    icon: 'Briefcase',
    sort_order: 3,
    is_published: true,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'prop-a-4',
    site_id: 'site-a-uuid-carlos',
    category_id: 'cat-a-3',
    title: 'Monitoramento Inteligente e Iluminação 100% LED nos Bairros',
    description: 'Integração de câmeras com reconhecimento de placas e inteligência preventiva, revitalizando áreas públicas e corredores comerciais periféricos.',
    image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
    icon: 'Shield',
    sort_order: 4,
    is_published: true,
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },

  // Site B
  {
    id: 'prop-b-1',
    site_id: 'site-b-uuid-mariana',
    category_id: 'cat-b-1',
    title: 'Tarifa Justa e Ônibus Elétricos Climatizados',
    description: 'Renovação progressiva da frota com veículos elétricos não poluentes, bilhete único metropolitano integrado e faixa exclusiva expandida.',
    image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
    icon: 'Bus',
    sort_order: 1,
    is_published: true,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'prop-b-2',
    site_id: 'site-b-uuid-mariana',
    category_id: 'cat-b-3',
    title: 'Vaga Garantida em Creche e Horário Estendido',
    description: 'Ampliação de vagas na educação infantil com centros modelo de acolhimento funcionando até 19h para apoiar mães e pais trabalhadores.',
    image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80',
    icon: 'HeartHandshake',
    sort_order: 2,
    is_published: true,
    created_at: '2026-03-05T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
];

export const SEED_ACTIONS: ActionItem[] = [
  // Ney Amorim - Acre
  {
    id: 'act-ney-1',
    site_id: 'site-ney-amorim',
    title: 'Articulação para Recuperação de Trechos Críticos da BR-364',
    description: 'Encontro com o Ministério dos Transportes e DNIT cobrando celeridade e recursos contínuos para a manutenção da espinha dorsal do transporte no Acre.',
    category: 'Infraestrutura',
    date: '2026-06-10',
    municipality: 'Rio Branco e Sena Madureira',
    image_url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80',
    is_published: true,
    created_at: '2026-06-10T10:00:00Z',
  },
  {
    id: 'act-ney-2',
    site_id: 'site-ney-amorim',
    title: 'Apoio à Cooperativa de Produtores Rurais e Mecanização Agrícola',
    description: 'Entrega de equipamentos agrícolas e incentivo a programas de escoamento da produção rural da agricultura familiar.',
    category: 'Agronegócio Sustentável',
    date: '2026-07-05',
    municipality: 'Cruzeiro do Sul e Vale do Juruá',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    is_published: true,
    created_at: '2026-07-05T10:00:00Z',
  },
  {
    id: 'act-ney-3',
    site_id: 'site-ney-amorim',
    title: 'Audiência de Fortalecimento da Segurança nas Fronteiras',
    description: 'Reunião estratégica com representantes das polícias para destinação de recursos em tecnologia, inteligência e reforço de efetivo.',
    category: 'Segurança Pública',
    date: '2026-07-28',
    municipality: 'Brasileia e Epitaciolândia',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    is_published: true,
    created_at: '2026-07-28T10:00:00Z',
  },

  // Site A
  {
    id: 'act-a-1',
    site_id: 'site-a-uuid-carlos',
    title: 'Inauguração do Centro Integrado de Saúde Preventiva',
    description: 'Articulação de R$ 12 milhões em emendas para equipar o centro que atende mais de 3.000 pacientes/mês na zona leste.',
    category: 'Saúde Pública',
    date: '2026-05-14',
    municipality: 'São Paulo',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
    is_published: true,
    created_at: '2026-05-14T10:00:00Z',
  },
  {
    id: 'act-a-2',
    site_id: 'site-a-uuid-carlos',
    title: 'Entrega de 15 Novas Ambulâncias de Suporte Avançado',
    description: 'Renovação da frota de resgate de emergência para 8 municípios do interior e região metropolitana.',
    category: 'Infraestrutura',
    date: '2026-06-22',
    municipality: 'Campinas e Região',
    image_url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop&q=80',
    is_published: true,
    created_at: '2026-06-22T10:00:00Z',
  },
  {
    id: 'act-a-3',
    site_id: 'site-a-uuid-carlos',
    title: 'Audiência Pública: Reforma Tributária e Incentivo a Startups',
    description: 'Debate nacional com especialistas em tecnologia e pequenos empresários para desoneração da folha e simplificação.',
    category: 'Economia',
    date: '2026-07-10',
    municipality: 'Brasília / SP',
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    is_published: true,
    created_at: '2026-07-10T10:00:00Z',
  },
];

export const SEED_EVENTS: CampaignEvent[] = [
  // Ney Amorim - Acre
  {
    id: 'eve-ney-1',
    site_id: 'site-ney-amorim',
    title: 'Grande Encontro da União pelo Futuro do Acre',
    event_date: '2026-09-08',
    event_time: '18:30',
    municipality: 'Rio Branco',
    location: 'Espaço de Eventos — Av. Ceará, Centro',
    description: 'Apresentação das metas prioritárias de mandato, com presença de lideranças comunitárias e produtores de todo o estado.',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    map_url: 'https://maps.google.com/?q=Rio+Branco+Acre',
    is_published: true,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'eve-ney-2',
    site_id: 'site-ney-amorim',
    title: 'Reunião com Produtores e Empreendedores do Vale do Juruá',
    event_date: '2026-09-15',
    event_time: '10:00',
    municipality: 'Cruzeiro do Sul',
    location: 'Associação Comercial do Juruá',
    description: 'Diálogo sobre crédito agrícola sustentável, melhorias na malha viária e geração de novos postos de trabalho.',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    map_url: 'https://maps.google.com/?q=Cruzeiro+do+Sul+Acre',
    is_published: true,
    created_at: '2026-08-05T10:00:00Z',
  },

  // Site A
  {
    id: 'eve-a-1',
    site_id: 'site-a-uuid-carlos',
    title: 'Encontro Regional com Lideranças Comunitárias e Profissionais da Saúde',
    event_date: '2026-09-05',
    event_time: '19:00',
    municipality: 'São Paulo',
    location: 'Auditório Central de Convenções — Av. Paulista, 1500',
    description: 'Apresentação detalhada das propostas para o fortalecimento da atenção básica e debate aberto de perguntas e respostas.',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    map_url: 'https://maps.google.com/?q=Av.+Paulista,+1500+São+Paulo',
    is_published: true,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'eve-a-2',
    site_id: 'site-a-uuid-carlos',
    title: 'Caminhada da Cidadania e Escuta nos Bairros',
    event_date: '2026-09-12',
    event_time: '09:30',
    municipality: 'São Bernardo do Campo',
    location: 'Praça da Matriz — Concentração junto ao coreto',
    description: 'Diálogo direto com comerciantes e moradores para receber reivindicações e sugestões para o plano de governo.',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    map_url: 'https://maps.google.com/?q=Praça+da+Matriz+São+Bernardo',
    is_published: true,
    created_at: '2026-08-05T10:00:00Z',
  },
  {
    id: 'eve-b-1',
    site_id: 'site-b-uuid-mariana',
    title: 'Fórum da Cidade Sustentável e Mobilidade Verde',
    event_date: '2026-09-08',
    event_time: '18:30',
    municipality: 'Curitiba',
    location: 'Centro Cívico Cultural — Sala Paranaguá',
    description: 'Palestra com arquitetos urbanistas sobre soluções práticas de transporte público limpo e parques lineares.',
    image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80',
    map_url: 'https://maps.google.com/?q=Centro+Civico+Curitiba',
    is_published: true,
    created_at: '2026-08-10T10:00:00Z',
  }
];

export const SEED_NEWS: NewsArticle[] = [
  // Ney Amorim - Acre
  {
    id: 'news-ney-1',
    site_id: 'site-ney-amorim',
    title: 'Ney Amorim defende pacote de investimentos federais para a malha viária e ramais produtivos do Acre',
    slug: 'ney-amorim-defende-investimentos-malha-viaria-acre',
    summary: 'Proposta prioritária busca garantir recursos contínuos para a BR-364 e a interligação de comunidades isoladas.',
    content: `A recuperação da infraestrutura de transportes é a principal chave para o desenvolvimento econômico do Acre. Em encontro com lideranças, Ney Amorim destacou que a BR-364 precisa de atenção permanente e de um plano de obras definitivo.

### Prioridade para as Rodovias e Ramais
"O povo acreano não pode mais sofrer com o isolamento e com o custo elevado do frete. Vamos lutar em Brasília para que os recursos cheguem com pontualidade e transparência", declarou Ney.

Principais metas:
* Recuperação e manutenção perene da BR-364 e BR-317;
* Pavimentação e drenagem de ramais de produção agrícola;
* Pontes de concreto para garantir escoamento da safra o ano inteiro.`,
    image_url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80',
    category: 'Infraestrutura',
    author: 'Assessoria Ney Amorim',
    published_at: '2026-08-20T10:00:00Z',
    is_published: true,
    created_at: '2026-08-20T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'news-ney-2',
    site_id: 'site-ney-amorim',
    title: 'Fortalecimento da segurança pública nas cidades e fronteiras é pilar central de propostas',
    slug: 'fortalecimento-seguranca-publica-fronteiras-acre',
    summary: 'Plano inclui destinação de verbas para inteligência, modernização das polícias e apoio aos profissionais de segurança.',
    content: `A segurança das famílias acreanas exige integração entre forças estaduais e federais. Ney Amorim reafirma o compromisso de buscar no Congresso Nacional os recursos necessários para equipar as polícias Civil, Militar e Penal.

"Nossos policiais são heróis que precisam de condições dignas, equipamentos modernos e valorização profissional para proteger a nossa sociedade", ressaltou.`,
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    category: 'Segurança Pública',
    author: 'Assessoria Ney Amorim',
    published_at: '2026-08-19T14:00:00Z',
    is_published: true,
    created_at: '2026-08-19T14:00:00Z',
    updated_at: '2026-08-19T14:00:00Z',
  },

  // Site A
  {
    id: 'news-a-1',
    site_id: 'site-a-uuid-carlos',
    title: 'Ney Amorim defende novo modelo de financiamento para hospitais filantrópicos e unidades no interior',
    slug: 'novo-modelo-financiamento-hospitais-filantropicos',
    summary: 'Proposta apresentada busca reajustar a tabela de repasses e garantir recursos perenes para o atendimento à população.',
    content: `O fortalecimento das Santas Casas e hospitais filantrópicos é um dos eixos prioritários de nossa atuação pública. Em pronunciamento oficial, Ney Amorim destacou a urgência de uma revisão estrutural no modelo de remuneração dos serviços essenciais.

### Sustentabilidade dos Hospitais Comunitários
"Não é aceitável que instituições centenárias que salvam vidas todos os dias operem no limite do déficit financeiro", enfatizou o parlamentar. 

O plano de ação compreende:
* Criação de fundo de estabilização hospitalar;
* Isenção tributária para compra de equipamentos médicos de alta tecnologia;
* Descentralização do atendimento com polos regionais.

A proposta já recebeu apoio de diversas entidades e secretarias de saúde municipais.`,
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    category: 'Saúde Pública',
    author: 'Assessoria de Comunicação',
    published_at: '2026-08-15T14:30:00Z',
    is_published: true,
    created_at: '2026-08-15T14:30:00Z',
    updated_at: '2026-08-15T14:30:00Z',
  },
  {
    id: 'news-a-2',
    site_id: 'site-a-uuid-carlos',
    title: 'Plano de Inovação propõe capacitar 50 mil jovens em habilidades digitais e programação',
    slug: 'plano-inovacao-capacitar-50-mil-jovens-programacao',
    summary: 'Projeto de incentivo visa criar polos tecnológicos nos bairros e conectar formandos a vagas em empresas do setor de software.',
    content: `A economia digital é a porta de entrada mais veloz para a mobilidade social da juventude. Durante encontro com lideranças de tecnologia, foi apresentado o programa Conecta Jovem.

### Eixos do Programa Conecta Jovem
1. **Infraestrutura**: Centros de computação modernos e internet de alta velocidade gratuitos;
2. **Mentoria**: Parcerias voluntárias com empresas privadas do setor de TI;
3. **Bolsa Permanência**: Auxílio financeiro para jovens de baixa renda concluírem os cursos de curta duração.

"O futuro do mercado de trabalho exige qualificação técnica. Nosso dever é oferecer as ferramentas necessárias para que nossos jovens liderem essa revolução", pontuou Ney Amorim.`,
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    category: 'Educação & Tecnologia',
    author: 'Equipe de Conteúdo',
    published_at: '2026-08-18T09:15:00Z',
    is_published: true,
    created_at: '2026-08-18T09:15:00Z',
    updated_at: '2026-08-18T09:15:00Z',
  },
  {
    id: 'news-b-1',
    site_id: 'site-b-uuid-mariana',
    title: 'Mariana Silveira apresenta diretrizes para plano de mobilidade sustentável e tarifa reduzida',
    slug: 'diretrizes-plano-mobilidade-sustentavel-tarifa-reduzida',
    summary: 'Estudo prevê renovação da frota por ônibus elétricos e ampliação das faixas exclusivas em corredores com maior fluxo.',
    content: `Em coletiva de imprensa, a candidata Mariana Silveira apresentou a metodologia de transição energética do transporte público.

O plano prevê a substituição gradual de 30% da frota por modelos elétricos com zero emissão de poluentes nos dois primeiros anos de mandato, financiado por parcerias público-privadas de baixo custo.

"Transporte de qualidade é direito básico que devolve tempo de vida e convívio familiar para as pessoas", afirmou Mariana.`,
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    category: 'Mobilidade Urbana',
    author: 'Assessoria Mariana Silveira',
    published_at: '2026-08-19T11:00:00Z',
    is_published: true,
    created_at: '2026-08-19T11:00:00Z',
    updated_at: '2026-08-19T11:00:00Z',
  }
];

export const SEED_VIDEOS: VideoItem[] = [
  // Ney Amorim - Acre
  {
    id: 'vid-ney-1',
    site_id: 'site-ney-amorim',
    title: 'Mensagem pelo Futuro do Acre — Ney Amorim 1577',
    description: 'Conheça o compromisso de trabalho, união e representatividade forte para o Acre em Brasília.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&auto=format&fit=crop&q=80',
    category: 'Institucional',
    sort_order: 1,
    is_active: true,
    created_at: '2026-07-01T10:00:00Z',
  },
  {
    id: 'vid-ney-2',
    site_id: 'site-ney-amorim',
    title: 'Nossas Propostas para o Agronegócio e o Produtor Rural Acreano',
    description: 'Como o mandato vai apoiar a agricultura familiar, maquinários e linhas de crédito no campo.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    category: 'Propostas',
    sort_order: 2,
    is_active: true,
    created_at: '2026-07-15T10:00:00Z',
  },

  // Site A
  {
    id: 'vid-a-1',
    site_id: 'site-a-uuid-carlos',
    title: 'Mensagem Oficial de Apresentação e Compromissos',
    description: 'Ney Amorim compartilha suas motivações, história na vida pública e os pilares de seu trabalho pelo Acre.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    category: 'Institucional',
    sort_order: 1,
    is_active: true,
    created_at: '2026-07-01T10:00:00Z',
  },
  {
    id: 'vid-a-2',
    site_id: 'site-a-uuid-carlos',
    title: 'Como podemos zerar a fila do SUS nos municípios?',
    description: 'Entrevista técnica detalhando a proposta dos Centros Regionais de Diagnóstico e telemedicina integrada.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    category: 'Propostas',
    sort_order: 2,
    is_active: true,
    created_at: '2026-07-15T10:00:00Z',
  },
  {
    id: 'vid-a-3',
    site_id: 'site-a-uuid-carlos',
    title: 'Visita às obras da Nova Maternidade Municipal',
    description: 'Fiscalização e prestação de contas dos recursos estaduais e federais aplicados na saúde da família.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    category: 'Atuação',
    sort_order: 3,
    is_active: true,
    created_at: '2026-08-01T10:00:00Z',
  },
];

export const SEED_GALLERY: GalleryItem[] = [
  // Ney Amorim - Acre
  {
    id: 'gal-ney-1',
    site_id: 'site-ney-amorim',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    caption: 'Grande encontro com lideranças comunitárias e apoiadores no Acre',
    sort_order: 1,
    is_active: true,
    created_at: '2026-07-05T10:00:00Z',
  },
  {
    id: 'gal-ney-2',
    site_id: 'site-ney-amorim',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    caption: 'Visita aos produtores rurais e diálogo com a agricultura familiar',
    sort_order: 2,
    is_active: true,
    created_at: '2026-07-12T10:00:00Z',
  },
  {
    id: 'gal-ney-3',
    site_id: 'site-ney-amorim',
    image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    caption: 'Reunião estratégica sobre desenvolvimento regional e geração de empregos',
    sort_order: 3,
    is_active: true,
    created_at: '2026-07-20T10:00:00Z',
  },
  {
    id: 'gal-ney-4',
    site_id: 'site-ney-amorim',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    caption: 'Planejamento e estruturação do plano de metas para o Acre',
    sort_order: 4,
    is_active: true,
    created_at: '2026-08-02T10:00:00Z',
  },

  // Site A
  {
    id: 'gal-a-1',
    site_id: 'site-a-uuid-carlos',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    caption: 'Reunião com médicos e gestores da saúde pública',
    sort_order: 1,
    is_active: true,
    created_at: '2026-07-05T10:00:00Z',
  },
  {
    id: 'gal-a-2',
    site_id: 'site-a-uuid-carlos',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    caption: 'Grande encontro com a comunidade e lideranças de bairro',
    sort_order: 2,
    is_active: true,
    created_at: '2026-07-12T10:00:00Z',
  },
  {
    id: 'gal-a-3',
    site_id: 'site-a-uuid-carlos',
    image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    caption: 'Debate sobre inovação com empreendedores e jovens universitários',
    sort_order: 3,
    is_active: true,
    created_at: '2026-07-20T10:00:00Z',
  },
  {
    id: 'gal-a-4',
    site_id: 'site-a-uuid-carlos',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    caption: 'Planejamento estratégico com a equipe técnica',
    sort_order: 4,
    is_active: true,
    created_at: '2026-08-02T10:00:00Z',
  },
];

export const SEED_SOCIAL_LINKS: SocialLink[] = [
  // Ney Amorim - Acre
  { id: 'soc-ney-1', site_id: 'site-ney-amorim', platform: 'instagram', url: 'https://instagram.com', icon: 'Instagram', sort_order: 1, is_active: true },
  { id: 'soc-ney-2', site_id: 'site-ney-amorim', platform: 'facebook', url: 'https://facebook.com', icon: 'Facebook', sort_order: 2, is_active: true },
  { id: 'soc-ney-3', site_id: 'site-ney-amorim', platform: 'youtube', url: 'https://youtube.com', icon: 'Youtube', sort_order: 3, is_active: true },

  // Site A
  { id: 'soc-a-1', site_id: 'site-a-uuid-carlos', platform: 'instagram', url: 'https://instagram.com', icon: 'Instagram', sort_order: 1, is_active: true },
  { id: 'soc-a-2', site_id: 'site-a-uuid-carlos', platform: 'facebook', url: 'https://facebook.com', icon: 'Facebook', sort_order: 2, is_active: true },
  { id: 'soc-a-3', site_id: 'site-a-uuid-carlos', platform: 'youtube', url: 'https://youtube.com', icon: 'Youtube', sort_order: 3, is_active: true },
  { id: 'soc-a-4', site_id: 'site-a-uuid-carlos', platform: 'whatsapp', url: 'https://wa.me/5511987654321', icon: 'MessageCircle', sort_order: 4, is_active: true },
  { id: 'soc-a-5', site_id: 'site-a-uuid-carlos', platform: 'tiktok', url: 'https://tiktok.com', icon: 'Video', sort_order: 5, is_active: true },

  // Site B
  { id: 'soc-b-1', site_id: 'site-b-uuid-mariana', platform: 'instagram', url: 'https://instagram.com', icon: 'Instagram', sort_order: 1, is_active: true },
  { id: 'soc-b-2', site_id: 'site-b-uuid-mariana', platform: 'youtube', url: 'https://youtube.com', icon: 'Youtube', sort_order: 2, is_active: true },
  { id: 'soc-b-3', site_id: 'site-b-uuid-mariana', platform: 'whatsapp', url: 'https://wa.me/5541998887766', icon: 'MessageCircle', sort_order: 3, is_active: true },
];

export const SEED_CONTACT_SETTINGS: Record<string, ContactSettings> = {
  'site-ney-amorim': {
    site_id: 'site-ney-amorim',
    whatsapp: '',
    phone: '',
    email: 'contato@neyamorim.com.br',
    address: 'Comitê Central — Rio Branco',
    city: 'Rio Branco',
    state: 'AC',
    instagram: '@neyamorimac',
    facebook: '/neyamorimac',
    youtube: '@neyamorimac',
    tiktok: '@neyamorimac',
  },
  'site-a-uuid-carlos': {
    site_id: 'site-a-uuid-carlos',
    whatsapp: '(68) 99988-7766',
    phone: '(68) 3224-5000',
    email: 'contato@neyamorim.com.br',
    address: 'Av. Ceará, 1200 - Centro',
    city: 'Rio Branco',
    state: 'AC',
    instagram: '@neyamorimac',
    facebook: '/neyamorimac',
    youtube: '@neyamorimac',
    tiktok: '@neyamorimac',
  },
  'site-b-uuid-mariana': {
    site_id: 'site-b-uuid-mariana',
    whatsapp: '(41) 99888-7766',
    phone: '(41) 3322-1100',
    email: 'falecom@marianasilveira.com.br',
    address: 'Rua XV de Novembro, 850 - Sala 402 - Centro',
    city: 'Curitiba',
    state: 'PR',
    instagram: '@marianasilveirapr',
    facebook: '/marianasilveiraoficial',
    youtube: '@marianasilveira',
    tiktok: '@marianasilveira',
  }
};
