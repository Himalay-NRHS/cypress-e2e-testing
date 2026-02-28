import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { addToCartSchema, formatZodErrors } from '@/lib/validations';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();

      // Validate input
      const validation = addToCartSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse(formatZodErrors(validation.error), 400);
      }

      const { productId, quantity } = validation.data;

      // Check if product exists and has enough stock
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return errorResponse('Product not found', 404);
      }

      if (product.stock < quantity) {
        return errorResponse('Not enough stock available', 400);
      }

      // Get or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId: user.userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: user.userId },
        });
      }

      // Check if item already in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      let cartItem;

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          return errorResponse('Not enough stock available', 400);
        }

        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: { product: true },
        });
      } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
          include: { product: true },
        });
      }

      return successResponse(cartItem, 'Item added to cart', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
