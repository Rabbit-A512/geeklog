export interface Article {
  article_id?: number;
  title: string;
  created_at: number;
  modified_at: number;
  content: string;
  user_id: number;
  category_id: number;
  tags: string;
  display?: boolean;
  collect_count?: number;
  star_count?: number;
  comment_count?: number;
  category_name?: string;
  nickname?: string;
}

export interface EditingArticle {
  category_id: number;
  tags: string;
  title: string;
  content: string;
}
