import React, { useState, useEffect, useRef } from 'react';
import { Library, BookOpen, Menu, X, Heart, Clock, CheckCircle, FolderOpen, Settings, FileText, Upload } from 'lucide-react';
import { books } from './data/books';
import { Book } from './types';
import { BookCard } from './components/BookCard';
import { ReadingView } from './components/ReadingView';
import { UploadBook } from './components/UploadBook';

function App() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('books');
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNavOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNavOpen]);

  const navItems = [
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'toRead', label: 'To Read', icon: Clock },
    { id: 'haveRead', label: 'Have Read', icon: CheckCircle },
    { id: 'collections', label: 'Collections', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleBookUpload = (book: Book) => {
    setUserBooks(prev => [...prev, book]);
    setActiveSection('books');
  };

  if (selectedBook) {
    return <ReadingView book={selectedBook} onClose={() => setSelectedBook(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Overlay */}
      {isNavOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav 
        ref={navRef}
        className={`fixed lg:sticky top-0 left-0 h-[100dvh] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 
          ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto flex flex-col`}
      >
        <div className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Library className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">SCROLLNEST</h1>
            </div>
            <button 
              className="lg:hidden"
              onClick={() => setIsNavOpen(false)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="py-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors
                  ${activeSection === item.id 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsNavOpen(false);
                }}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                ref={menuButtonRef}
                className="lg:hidden mr-4"
                onClick={() => setIsNavOpen(true)}>
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {navItems.find(item => item.id === activeSection)?.label}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setActiveSection('documents')}>
                <Upload className="h-5 w-5 mr-2" />
                Upload
              </button>

              {/* Login Button */}
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                onClick={() => alert('Login clicked')}
              >
                Login
              </button>

              {/* Sign Up Button */}
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none"
                onClick={() => alert('Sign Up clicked')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>


        <main className="flex-1 container mx-auto px-4 py-8">
          {activeSection === 'books' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...books, ...userBooks].map((book) => (
                <div 
                  key={book.id}
                  className="flex justify-center"
                  style={{
                    transform: 'perspective(1000px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <BookCard book={book} onClick={setSelectedBook} />
                </div>
              ))}
            </div>
          )}
          
          {activeSection === 'documents' && (
            <div>
              <UploadBook onBookUploaded={handleBookUpload} />
              {userBooks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Uploaded Books</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userBooks.map((book) => (
                      <div 
                        key={book.id}
                        className="flex justify-center"
                        style={{
                          transform: 'perspective(1000px)',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <BookCard book={book} onClick={setSelectedBook} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'favorites' && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Favorites Yet</h3>
              <p className="text-gray-500">Add books to your favorites to see them here</p>
            </div>
          )}

          {activeSection === 'toRead' && (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Reading List Empty</h3>
              <p className="text-gray-500">Add books to your reading list</p>
            </div>
          )}

          {activeSection === 'haveRead' && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Completed Books</h3>
              <p className="text-gray-500">Books you finish will appear here</p>
            </div>
          )}

          {activeSection === 'collections' && (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Collections Yet</h3>
              <p className="text-gray-500">Create collections to organize your books</p>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Dark Mode</span>
                  <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Reading Progress</span>
                  <button className="w-12 h-6 bg-indigo-600 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Font Size</span>
                  <select className="border rounded-md px-2 py-1">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;