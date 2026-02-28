import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!userData) {
        return errorResponse('User not found', 404);
      }

      return successResponse(userData, 'User profile retrieved');
    } catch (error) {
      return handleApiError(error);
    }
  });
}
