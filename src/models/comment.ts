export interface Comment {
  comment_id: number;
  user_id: number;
  root_id: number;
  parent_id: number;
  article_id: number;
  created_at: number;
  content: string;
  article_title: string;
  from_user_nickname: string;
  from_user_avatar: string;
  to_user_nickname: string;
  to_user_avatar: string;
}
