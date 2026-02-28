import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { withAdminAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { productSchema, formatZodErrors } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Search
    const search = searchParams.get('search') || '';

    // Price filter
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');

    // Build where clause
    const where = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {},
        {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      ],
    };

    // Get products and count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Products retrieved successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const body = await req.json();

      // Validate input
      const validation = productSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse(formatZodErrors(validation.error), 400);
      }

      const product = await prisma.product.create({
        data: validation.data,
      });

      return successResponse(product, 'Product created successfully', 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
