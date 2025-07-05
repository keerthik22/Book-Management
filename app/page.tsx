'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   const userId = localStorage.getItem('userId');
  //   if (userId) {
  //     router.push('/dashboard');
  //   }
  // }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Book Manager</h1>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        <div className="text-center py-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Organize Your Reading Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Keep track of your books, monitor your reading progress, and never lose your place again.
            Upload PDFs, track completion, and build your personal library.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Reading
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
          <Card className="text-center shadow-lg">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Digital Library</CardTitle>
              <CardDescription>
                Upload and organize your PDF books in one convenient location
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center shadow-lg">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your reading progress and mark books as completed
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center shadow-lg">
            <CardHeader>
              <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Smart Search</CardTitle>
              <CardDescription>
                Quickly find books by title, author, or description
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}