import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, withAdminAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { Role } from '@prisma/client';
import { getUserFromRequest } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);

  if (!user) {
    return errorResponse('Authentication required', 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Admin can see all orders, users only see their own
    const where = user.role === Role.ADMIN ? {} : { userId: user.userId };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return successResponse(
      {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Orders retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
