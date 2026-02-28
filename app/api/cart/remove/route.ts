import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { removeFromCartSchema, formatZodErrors } from '@/lib/validations';

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();

      // Validate input
      const validation = removeFromCartSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse(formatZodErrors(validation.error), 400);
      }

      const { cartItemId } = validation.data;

      // Get cart item
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
          cart: true,
        },
      });

      if (!cartItem) {
        return errorResponse('Cart item not found', 404);
      }

      // Verify ownership
      if (cartItem.cart.userId !== user.userId) {
        return errorResponse('Unauthorized', 403);
      }

      // Delete item
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return successResponse(null, 'Item removed from cart');
    } catch (error) {
      return handleApiError(error);
    }
  });
}
