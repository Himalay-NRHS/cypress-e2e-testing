import { NextRequest } from 'next/server';
import { verifyToken, getTokenFromHeader, JWTPayload } from './auth';
import { errorResponse } from './api-response';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: JWTPayload) => Promise<Response>
) {
  const authHeader = request.headers.get('authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    return errorResponse('Authentication required', 401);
  }

  const payload = verifyToken(token);

  if (!payload) {
    return errorResponse('Invalid or expired token', 401);
  }

  return handler(request, payload);
}

export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: JWTPayload) => Promise<Response>
) {
  const authHeader = request.headers.get('authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    return errorResponse('Authentication required', 401);
  }

  const payload = verifyToken(token);

  if (!payload) {
    return errorResponse('Invalid or expired token', 401);
  }

  if (payload.role !== Role.ADMIN) {
    return errorResponse('Admin access required', 403);
  }

  return handler(request, payload);
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
