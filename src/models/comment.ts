export interface Comment {
  comment_id: number;
  user_id: number;
  root_id: number;
  parent_id: number;
  article_id: number;
  created_at: number;
  content: string;
}
