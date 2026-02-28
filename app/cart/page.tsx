'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLoader } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/ErrorMessage';
import { useRouter } from 'next/navigation';

function CartContent() {
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Looks like you haven't added any items to your cart yet."
        actionLabel="Continue Shopping"
        onAction={() => router.push('/')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Shopping Cart ({cart.itemCount} items)
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <div key={item.id} className="p-6 flex gap-4" data-testid="cart-item">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.product.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-indigo-600 line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-indigo-600 font-semibold mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.id, item.quantity - 1)
                            : removeFromCart(item.id)
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-medium">{item.quantity}</span>
                      <button
                        data-testid="cart-quantity-increment"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      data-testid="cart-remove"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{cart.total >= 50 ? 'Free' : '$5.99'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${(cart.total * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>
                  $
                  {(
                    cart.total +
                    (cart.total >= 50 ? 0 : 5.99) +
                    cart.total * 0.1
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/"
            className="block w-full text-center py-3 px-4 mt-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>

          {cart.total < 50 && (
            <p className="text-sm text-gray-500 text-center mt-4">
              Add ${(50 - cart.total).toFixed(2)} more for free shipping!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <CartContent />
      </div>
    </ProtectedRoute>
  );
}
