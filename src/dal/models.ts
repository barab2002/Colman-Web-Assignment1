export interface Post {
  id: string;
  senderId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
