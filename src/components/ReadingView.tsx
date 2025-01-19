import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface ReadingViewProps {
  book: Book;
  onClose: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ book, onClose }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div 
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-10 shadow-sm"
        style={{
          transform: `translateY(${Math.min(scrollPosition * 0.3, 0)}px)`,
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back to Library
          </button>
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">Chapter 1</span>
          </div>
        </div>
      </div>

      <div 
        className="relative pt-24"
        style={{
          perspective: '1000px',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div 
            className="mb-12 text-center"
            style={{
              transform: `translateZ(${scrollPosition * 0.1}px)`,
              opacity: Math.max(1 - scrollPosition * 0.002, 0),
            }}
          >
            <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600">{book.author}</p>
          </div>
          
          <div className="prose prose-lg mx-auto">
            {book.content.split('\n').map((paragraph, index) => (
              <p 
                key={index}
                className="mb-6 leading-relaxed"
                style={{
                  transform: `translateY(${scrollPosition * 0.1}px)`,
                  opacity: Math.min(1, Math.max(0, 1 - (scrollPosition - index * 100) * 0.002)),
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};