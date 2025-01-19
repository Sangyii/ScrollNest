export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  content: string;
  format?: 'epub' | 'pdf';
  file?: File;
}

export interface ReadingProgress {
  bookId: string;
  progress: number;
  lastRead: Date;
}