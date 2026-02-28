'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add to cart';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchCart]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/cart/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cartItemId, quantity }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update cart';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchCart]
  );

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cartItemId }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove from cart';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchCart]
  );

  const checkout = useCallback(async () => {
    if (!token) {
      throw new Error('Please login to checkout');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      await fetchCart();
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
