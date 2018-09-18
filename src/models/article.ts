export interface Article {
  article_id: number;
  title: string;
  created_at: number;
  modified_at: number;
  content: string;
  user_id: number;
  category_id: number;
  tags: string;
  display: boolean;
  collect_count: number;
  star_count: number;
  comment_count: number;
}

export interface Article {
  userId: number;
  id: number;
  title: string;
  body: string;
}
