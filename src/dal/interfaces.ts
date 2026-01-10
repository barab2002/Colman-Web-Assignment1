export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
}

export interface IDataAccess<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Partial<T> & { id?: string }): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
