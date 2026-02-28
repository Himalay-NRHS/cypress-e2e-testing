'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setMessage({ type: 'error', text: 'Please login to add to cart' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      setMessage({ type: 'success', text: 'Added to cart!' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to add' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/product/${product.id}`}  data-testid="product-card" className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          {message && (
            <div
              className={`mt-2 text-sm text-center py-1 px-2 rounded ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding || isLoading}
            className={`mt-3 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400'
            }`}
          >
            {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
