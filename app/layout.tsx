import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopNext - E-Commerce Store',
  description: 'A modern e-commerce store built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">ShopNext</h3>
                    <p className="text-sm">
                      Your one-stop shop for quality products at great prices.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/" className="hover:text-white transition-colors">
                          Products
                        </a>
                      </li>
                      <li>
                        <a href="/cart" className="hover:text-white transition-colors">
                          Cart
                        </a>
                      </li>
                      <li>
                        <a href="/orders" className="hover:text-white transition-colors">
                          Orders
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4">Contact</h4>
                    <ul className="space-y-2 text-sm">
                      <li>support@shopnext.com</li>
                      <li>1-800-SHOP-NOW</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
                  <p>&copy; {new Date().getFullYear()} ShopNext. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
