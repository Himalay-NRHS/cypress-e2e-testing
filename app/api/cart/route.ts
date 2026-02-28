import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Get or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId: user.userId },
        include: {
          items: {
            include: {
              product: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: user.userId },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });
      }

      // Calculate total
      const total = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return successResponse(
        {
          ...cart,
          total,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        },
        'Cart retrieved successfully'
      );
    } catch (error) {
      return handleApiError(error);
    }
  });
}
