export type Role = 'owner' | 'admin' | 'editor';
export type UserRole = Role;

export interface Site {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  custom_domain?: string | null;
  status?: 'active' | 'inactive' | 'draft';
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  created_at: string;
}

export interface SiteMember {
  id: string;
  site_id: string;
  user_id: string;
  user_email?: string;
  role: Role;
  created_at: string;
  profile?: Profile;
}

export interface SiteSettings {
  id?: string;
  site_id: string;
  candidate_name: string;
  candidate_number: string;
  position: string;
  party: string;
  coalition?: string;
  municipality?: string;
  state?: string;
  slogan?: string;
  legal_information?: string;
  cnpj?: string;
  logo_url?: string;
  favicon_url?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  domain?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ThemeSettings {
  id?: string;
  site_id: string;
  theme_name?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  button_style?: string;
  font_family?: string;
  theme_mode?: 'light' | 'dark' | 'system';
  preset_name?: string;
  logo_url?: string;
  favicon_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSection {
  id?: string;
  site_id: string;
  title: string;
  subtitle: string;
  cta_text?: string;
  cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  hero_image_url?: string;
  background_image_url?: string;
  background_video_url?: string;
  badge_text?: string;
  is_active?: boolean;
  candidate_name?: string;
  position?: string;
  image_url?: string;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Indicator {
  id: string;
  site_id: string;
  value: string;
  title: string;
  description?: string;
  icon: string;
  display_order?: number;
  sort_order?: number;
  is_active: boolean;
  created_at?: string;
}

export interface AboutSection {
  id?: string;
  site_id: string;
  title: string;
  biography: string;
  trajectory?: string;
  quote?: string;
  image_url?: string;
  professional_info?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProposalCategory {
  id: string;
  site_id: string;
  name: string;
  slug?: string;
  display_order?: number;
  sort_order?: number;
  is_active: boolean;
  created_at?: string;
}

export interface Proposal {
  id: string;
  site_id: string;
  category_id?: string;
  title: string;
  description: string;
  image_url?: string;
  icon?: string;
  display_order?: number;
  sort_order?: number;
  is_active?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  category?: ProposalCategory;
}

export interface ActionItem {
  id: string;
  site_id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  municipality?: string;
  image_url?: string;
  video_url?: string;
  external_url?: string;
  display_order?: number;
  is_active?: boolean;
  is_published?: boolean;
  created_at?: string;
}

export interface CampaignEvent {
  id: string;
  site_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  location: string;
  municipality?: string;
  image_url?: string;
  map_url?: string;
  display_order?: number;
  is_active?: boolean;
  is_published?: boolean;
  created_at?: string;
}

export interface NewsArticle {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category: string;
  author?: string;
  image_url?: string;
  published_at: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VideoItem {
  id: string;
  site_id: string;
  title: string;
  description?: string;
  youtube_url: string;
  thumbnail_url?: string;
  category: string;
  display_order?: number;
  sort_order?: number;
  is_active: boolean;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  site_id: string;
  image_url: string;
  caption?: string;
  storage_path?: string;
  display_order?: number;
  sort_order?: number;
  is_active: boolean;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  site_id: string;
  platform: string;
  url: string;
  username?: string;
  icon?: string;
  display_order?: number;
  sort_order?: number;
  is_active: boolean;
  created_at?: string;
}

export interface ContactSettings {
  id?: string;
  site_id: string;
  whatsapp: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  office_hours?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  created_at?: string;
  updated_at?: string;
}
