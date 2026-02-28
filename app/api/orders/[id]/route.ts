import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAdminAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { OrderStatus } from '@prisma/client';
import { z } from 'zod';
import { formatZodErrors } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withAdminAuth(request, async (req) => {
    try {
      const { id } = await params;
      const body = await req.json();

      // Validate input
      const validation = updateOrderSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse(formatZodErrors(validation.error), 400);
      }

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        return errorResponse('Order not found', 404);
      }

      const order = await prisma.order.update({
        where: { id },
        data: { status: validation.data.status },
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
      });

      return successResponse(order, 'Order status updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}
