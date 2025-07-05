export interface User {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  pdfUrl?: string | null;
  completed: boolean;
  progress: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}