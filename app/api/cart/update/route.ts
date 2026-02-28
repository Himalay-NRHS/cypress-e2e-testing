import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { updateCartSchema, formatZodErrors } from '@/lib/validations';

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();

      // Validate input
      const validation = updateCartSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse(formatZodErrors(validation.error), 400);
      }

      const { cartItemId, quantity } = validation.data;

      // Get cart item
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
          cart: true,
          product: true,
        },
      });

      if (!cartItem) {
        return errorResponse('Cart item not found', 404);
      }

      // Verify ownership
      if (cartItem.cart.userId !== user.userId) {
        return errorResponse('Unauthorized', 403);
      }

      // Check stock
      if (quantity > cartItem.product.stock) {
        return errorResponse('Not enough stock available', 400);
      }

      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
        include: { product: true },
      });

      return successResponse(updatedItem, 'Cart updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}
