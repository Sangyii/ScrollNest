import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Book } from '../types';  // Assuming Book is defined in another file
import * as EPUB from 'epubjs';
import * as PDFJS from 'pdfjs-dist';
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';  // Import relevant types

interface UploadBookProps {
  onBookUploaded: (book: Book) => void;
}

export const UploadBook: React.FC<UploadBookProps> = ({ onBookUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileProcessing = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      let book;
      if (file.name.endsWith('.epub')) {
        book = await processEpub(file);
      } else if (file.name.endsWith('.pdf')) {
        book = await processPdf(file);
      } else {
        throw new Error('Unsupported file format. Please upload EPUB or PDF files.');
      }
      onBookUploaded(book);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process book');
    } finally {
      setIsProcessing(false);
    }
  };

  const processEpub = async (file: File): Promise<Book> => {
    // Use new keyword to instantiate the EPUB object
    const book = new EPUB();
    await book.open(file);
    const metadata = await book.loaded.metadata;
    const cover = await book.coverUrl();

    const content = await book.locations.generate();
    return {
      id: crypto.randomUUID(),
      title: metadata.title,
      author: metadata.creator,
      cover: cover || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
      description: metadata.description || 'No description available',
      content: content,
      format: 'epub',  // Explicitly specify 'epub'
      file: file
    };
  };

  const processPdf = async (file: File): Promise<Book> => {
    const pdf = await PDFJS.getDocument(URL.createObjectURL(file)).promise;
    const firstPage = await pdf.getPage(1);
    const textContent = await firstPage.getTextContent();

    // Use a type guard to narrow down to `TextItem` before accessing `str`
    const text = textContent.items
      .filter((item: TextItem | TextMarkedContent): item is TextItem => 'str' in item)  // Type guard
      .map((item: TextItem) => item.str)  // Now we are sure `item` is of type `TextItem`
      .join(' ');

    return {
      id: crypto.randomUUID(),
      title: file.name.replace('.pdf', ''),
      author: 'Unknown',
      cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
      description: text.slice(0, 200) + '...',
      content: text,
      format: 'pdf',  // Explicitly specify 'pdf'
      file: file
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileProcessing(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcessing(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center
          ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".epub,.pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          disabled={isProcessing}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {isProcessing ? 'Processing...' : 'Upload a book'}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Drop your EPUB or PDF file here, or click to browse
        </p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
