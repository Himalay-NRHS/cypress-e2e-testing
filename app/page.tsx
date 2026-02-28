'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchFilters from '@/components/SearchFilters';
import Pagination from '@/components/Pagination';
import { PageLoader } from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '' });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.set('search', search);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        const responseData = data.data as ProductsResponse;
        setProducts(responseData.products);
        setPagination(responseData.pagination);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters: { minPrice: string; maxPrice: string }) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to ShopNext</h1>
        <p className="text-lg md:text-xl opacity-90 mb-6">
          Discover amazing products at unbeatable prices
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            ✨ Free shipping on orders over $50
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            🔒 Secure checkout
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            ↩️ Easy returns
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        initialSearch={search}
        initialFilters={filters}
      />

      {/* Products Grid */}
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <>
          <div   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard  key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />

          <p className="text-center text-gray-500 mt-4">
            Showing {products.length} of {pagination.total} products
          </p>
        </>
      )}
    </div>
  );
}
