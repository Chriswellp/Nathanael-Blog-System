export interface HomePillarCard {
  id: string;
  title: string;
  desc: string;
  icon?: string;
  media_type?: 'image' | 'video' | 'none';
  media_url?: string;
  story_text?: string;
  link_page?: string;
  display_order?: number;
  is_visible?: boolean;
}

export interface HomeHeroData {
  badgeText: string;
  authorName: string;
  tagline: string;
  quote: string;
  logoUrl?: string;
  cardTitle: string;
  cardSubtitle: string;
  cardDescription: string;
}