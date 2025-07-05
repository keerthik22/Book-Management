'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/types';
import { BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import { BookSkeleton } from '@/components/BookSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, LogOut, BookOpen, Filter } from 'lucide-react';

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    fetchBooks();
    fetchUser();
  }, []);

  useEffect(() => {
    let filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filter === 'completed') {
      filtered = filtered.filter(book => book.completed);
    } else if (filter === 'in-progress') {
      filtered = filtered.filter(book => !book.completed);
    }

    setFilteredBooks(filtered);
  }, [searchQuery, books, filter]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSaveBook = async (bookData: any) => {
    try {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('author', bookData.author);
      formData.append('description', bookData.description);
      if (bookData.pdfFile) {
        formData.append('pdf', bookData.pdfFile);
      }

      const url = bookData.id ? `/api/books/${bookData.id}` : '/api/books';
      const method = bookData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        fetchBooks();
        setDialogOpen(false);
        setEditingBook(undefined);
      }
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchBooks();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('userId');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.removeItem('userId');
      router.push('/login');
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setDialogOpen(true);
  };

  const handleAddBook = () => {
    setEditingBook(undefined);
    setDialogOpen(true);
  };

  const completedBooks = books.filter(book => book.completed).length;
  const inProgressBooks = books.filter(book => !book.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Book Manager</h1>
                <p className="text-xs text-gray-500">Organize your reading journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome back, <span className="font-medium">{user?.name || 'User'}</span>
              </span>
              <Button variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{books.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedBooks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">{inProgressBooks}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl font-bold text-gray-900">My Library</h2>
            <p className="text-gray-600 mt-1">
              {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} 
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <Button 
            onClick={handleAddBook} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search books by title, author, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="h-12"
            >
              All Books
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              className="h-12"
            >
              Completed
            </Button>
            <Button
              variant={filter === 'in-progress' ? 'default' : 'outline'}
              onClick={() => setFilter('in-progress')}
              className="h-12"
            >
              In Progress
            </Button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <BookSkeleton key={index} />
            ))
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-100 max-w-md mx-auto">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {searchQuery ? 'No books found' : 'No books yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search terms or filters'
                    : 'Add your first book to get started on your reading journey'}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={handleAddBook}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Book
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BookDialog
        book={editingBook}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveBook}
      />
    </div>
  );
}