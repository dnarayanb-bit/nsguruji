export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  formattedDate: string;
  featuredImageUrl: string | null;
  categoryName: string;
  authorName: string;
  originalUrl: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  count: number;
}

export type ViewTab = 'preview' | 'code' | 'admob' | 'docs';

export type ScreenRoute = 'splash' | 'home' | 'detail' | 'search';
