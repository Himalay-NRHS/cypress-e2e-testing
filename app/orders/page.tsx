'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLoader } from '@/components/LoadingSpinner';
import ErrorMessage, { EmptyState } from '@/components/ErrorMessage';
import Pagination from '@/components/Pagination';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED';
  createdAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-green-100 text-green-800',
};

const statusLabels = {
  PENDING: 'Pending',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
};

function OrdersContent() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const responseData = data.data as OrdersResponse;
        setOrders(responseData.orders);
        setPagination(responseData.pagination);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, [token, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchOrders} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="When you place an order, it will appear here."
        actionLabel="Start Shopping"
        onAction={() => (window.location.href = '/')}
      />
    );
  }

  return (
    <>
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Order placed successfully! Thank you for your purchase.</span>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-900">{order.id.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium text-indigo-600">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedOrder === order.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600 line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <Suspense fallback={<PageLoader />}>
          <OrdersContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
