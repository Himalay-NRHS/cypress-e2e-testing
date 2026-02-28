'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLoader } from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
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
  user: {
    id: string;
    name: string;
    email: string;
  };
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
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PAID: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPED: 'bg-green-100 text-green-800 border-green-200',
};

const statusOptions: Array<{ value: 'PENDING' | 'PAID' | 'SHIPPED'; label: string }> = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'SHIPPED', label: 'Shipped' },
];

function AdminOrdersContent() {
  const { token } = useAuth();

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
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
          )
        );
      } else {
        alert(data.message);
      }
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && orders.length === 0) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchOrders} />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-2 text-gray-500">Orders will appear here when customers make purchases.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-900">{order.id.slice(0, 12)}...</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-indigo-600">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingOrder === order.id}
                    className={`px-3 py-2 rounded-lg border font-medium text-sm ${statusColors[order.status]} focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
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
                  </button>
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-4">
                  Order Items ({order.items.length})
                </h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-lg">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
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

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>
        <AdminOrdersContent />
      </div>
    </ProtectedRoute>
  );
}
