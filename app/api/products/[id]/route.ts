import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAdminAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { updateProductSchema, formatZodErrors } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return successResponse(product, 'Product retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withAdminAuth(request, async (req) => {
    try {
      const { id } = await params;
      const body = await req.json();

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return errorResponse('Product not found', 404);
      }

      // Validate input
      const validation = updateProductSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse(formatZodErrors(validation.error), 400);
      }

      const product = await prisma.product.update({
        where: { id },
        data: validation.data,
      });

      return successResponse(product, 'Product updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withAdminAuth(request, async () => {
    try {
      const { id } = await params;

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return errorResponse('Product not found', 404);
      }

      await prisma.product.delete({
        where: { id },
      });

      return successResponse(null, 'Product deleted successfully');
    } catch (error) {
      return handleApiError(error);
    }
  });
}
