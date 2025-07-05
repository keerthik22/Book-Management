import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { progress } = await request.json();

    const book = await prisma.book.update({
      where: { id: params.id },
      data: { 
        progress: Math.max(0, Math.min(100, progress)),
        completed: progress >= 100
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}