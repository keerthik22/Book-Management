'use client';

import { Book } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold line-clamp-1 text-gray-900">
              {book.title}
            </CardTitle>
          </div>
          <Badge 
            variant={book.completed ? "default" : "secondary"}
            className={book.completed 
              ? "bg-green-100 text-green-800 border-green-200 shadow-sm" 
              : "bg-orange-100 text-orange-800 border-orange-200 shadow-sm"
            }
          >
            {book.completed ? "Completed" : "In Progress"}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600 font-medium">
          by {book.author}
        </CardDescription>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          Added {formatDate(book.createdAt)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {book.description && (
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="font-bold text-blue-600">{book.progress}%</span>
          </div>
          <Progress 
            value={book.progress} 
            className="h-2 bg-gray-200"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          {book.pdfUrl && (
            <Link href={`/book/${book.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(book)}
            className="flex-1 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(book.id)}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}