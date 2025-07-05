import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { completed } = await request.json();

    const book = await prisma.book.update({
      where: { id: params.id },
      data: { 
        completed,
        progress: completed ? 100 : 0
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