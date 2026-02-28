import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Get user's cart
      const cart = await prisma.cart.findUnique({
        where: { userId: user.userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return errorResponse('Cart is empty', 400);
      }

      // Verify stock for all items
      for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
          return errorResponse(
            `Not enough stock for ${item.product.name}. Available: ${item.product.stock}`,
            400
          );
        }
      }

      // Calculate total
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Create order with transaction
      const order = await prisma.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId: user.userId,
            totalAmount,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
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
          },
        });

        // Update product stock
        for (const item of cart.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Clear cart
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return newOrder;
      });

      return successResponse(order, 'Order placed successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
