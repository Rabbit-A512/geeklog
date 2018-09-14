export interface Comment {
  comment_id: string | number;
  user_id: string | number;
  root_id: string | number;
  parent_id: string | number;
  article_id: string | number;
  created_at: string | number;
  content: string;
}

export interface FakeComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
