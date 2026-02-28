'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Management */}
          <Link
            href="/admin/products"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                <p className="text-gray-500 text-sm">Manage your product catalog</p>
              </div>
            </div>
          </Link>

          {/* Orders Management */}
          <Link
            href="/admin/orders"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
                <p className="text-gray-500 text-sm">View and manage orders</p>
              </div>
            </div>
          </Link>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/products" className="hover:underline flex items-center gap-2">
                  <span>→</span> Add new product
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="hover:underline flex items-center gap-2">
                  <span>→</span> View pending orders
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline flex items-center gap-2">
                  <span>→</span> Visit storefront
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Admin Features</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Create, edit, and delete products</li>
            <li>• View all customer orders</li>
            <li>• Update order status (Pending → Paid → Shipped)</li>
            <li>• Manage inventory stock levels</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
