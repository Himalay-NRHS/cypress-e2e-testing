import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url('Invalid image URL'),
  stock: z.number().int().nonnegative('Stock must be non-negative'),
});

export const updateProductSchema = productSchema.partial();

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
});

export const updateCartSchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const removeFromCartSchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required'),
});

export function formatZodErrors(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(', ');
}

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
