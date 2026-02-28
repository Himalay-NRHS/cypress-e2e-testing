import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export function successResponse<T>(data: T, message: string = 'Success', status: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(response, { status });
}

export function errorResponse(message: string, status: number = 400) {
  const response: ApiResponse = {
    success: false,
    message,
  };
  return NextResponse.json(response, { status });
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse('An unexpected error occurred', 500);
}
