'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Plus, Minus } from 'lucide-react';

interface BookPageProps {
  params: { id: string };
}

export default function BookPage({ params }: BookPageProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    fetchBook();
  }, [params.id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBook(data);
        setProgress(data.progress);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/books/${params.id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress }),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setProgress(updatedBook.progress);
        setBook(updatedBook);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdating(false);
    }
  };

  const markAsCompleted = async () => {
    if (updating) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/books/${params.id}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBook(updatedBook);
        setProgress(100);
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
    } finally {
      setUpdating(false);
    }
  };

  const adjustProgress = (delta: number) => {
    const newProgress = Math.max(0, Math.min(100, progress + delta));
    updateProgress(newProgress);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Skeleton className="w-8 h-8 mr-4" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-96 lg:h-[600px] rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Book not found</h2>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mr-4 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-3">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                {book.pdfUrl ? (
                  <iframe
                    src={book.pdfUrl}
                    className="w-full h-96 lg:h-[600px] border-0 rounded-xl shadow-inner"
                    title={book.title}
                  />
                ) : (
                  <div className="h-96 lg:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No PDF Available</h3>
                      <p className="text-gray-500">Upload a PDF file to start reading</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Book Details and Progress */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl">{book.title}</span>
                  <Badge 
                    variant={book.completed ? "default" : "secondary"}
                    className={book.completed ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"}
                  >
                    {book.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        In Progress
                      </>
                    )}
                  </Badge>
                </CardTitle>
                <p className="text-gray-600 font-medium">by {book.author}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {book.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Reading Progress</span>
                    <span className="text-lg font-bold text-blue-600">{progress}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-3 bg-gray-200"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700">Quick Progress Updates</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => updateProgress(value)}
                        disabled={progress >= value || updating}
                        className="h-10 text-xs font-medium"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustProgress(-5)}
                      disabled={progress <= 0 || updating}
                      className="flex-1"
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      -5%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustProgress(5)}
                      disabled={progress >= 100 || updating}
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      +5%
                    </Button>
                  </div>
                </div>

                {!book.completed && (
                  <Button
                    onClick={markAsCompleted}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}