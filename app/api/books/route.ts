import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

// GET 
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 
                   request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const books = await prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('GET /books error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST 
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 
                   request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const pdfFile = formData.get('pdf') as File;

    let pdfUrl: string | null = null;

    if (pdfFile) {
      const bytes = await pdfFile.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      const filename = `${Date.now()}-${pdfFile.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(filepath, buffer);
      pdfUrl = `/uploads/${filename}`;
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        description,
        pdfUrl,
        userId,
      },
    });

    return NextResponse.json(newBook);
  } catch (error) {
    console.error('POST /books error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
