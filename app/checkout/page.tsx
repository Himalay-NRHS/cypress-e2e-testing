'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLoader } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/ErrorMessage';

function CheckoutContent() {
  const { cart, isLoading, checkout } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add some items to your cart before checking out."
        actionLabel="Continue Shopping"
        onAction={() => router.push('/')}
      />
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      await checkout();
      router.push('/orders?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cart.total;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Review */}
      <div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Order Review</h2>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50">
            <Link href="/cart" className="text-indigo-600 text-sm hover:text-indigo-800">
              ← Edit cart
            </Link>
          </div>
        </div>

        {/* Shipping Info Notice */}
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Mode</h3>
          <p className="text-blue-700 text-sm">
            This is a demo checkout. In a production app, you would collect shipping and payment
            information here. Click &quot;Place Order&quot; to simulate a successful order.
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-4 px-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              `Place Order - $${total.toFixed(2)}`
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure Checkout
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <CheckoutContent />
      </div>
    </ProtectedRoute>
  );
}
