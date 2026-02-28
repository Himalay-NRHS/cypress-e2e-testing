import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/test-user?email=user@example.com
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Email parameter is required' },
      { status: 400 },
    );
  }

  // Prevent deletion of the seeded admin account
  if (email === 'admin@test.com') {
    return NextResponse.json(
      { success: false, message: 'Cannot delete the seed admin user' },
      { status: 403 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { success: true, message: 'User already removed', data: { email } },
      { status: 200 },
    );
  }

  await prisma.user.delete({ where: { email } });

  return NextResponse.json(
    { success: true, message: 'User deleted successfully', data: { email } },
    { status: 200 },
  );
}

// GET /api/test-user?email=user@example.com
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Email parameter is required' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { success: true, message: 'User found', data: user },
    { status: 200 },
  );
}
