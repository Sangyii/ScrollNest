import React from 'react';
import { Book } from '../types';
import { Clock } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => onClick(book)}
    >
      <div className="relative h-[400px] w-[300px]">
        <img 
          src={book.cover} 
          alt={book.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-xl font-bold">{book.title}</h3>
          <p className="text-sm opacity-90">{book.author}</p>
          <div className="mt-2 flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <span>Last read 2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};