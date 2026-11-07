import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/customer/HomePage';
import { CategoriesPage } from './pages/customer/CategoriesPage';
import { CategoryPage } from './pages/customer/CategoryPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { AccountPage } from './pages/customer/AccountPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-black text-[#8F1028]/20 mb-4">404</p>
      <h1 className="text-xl font-bold text-gray-700 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="inline-block bg-[#8F1028] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#690D20] transition-colors"
      >
        Go to Home
      </a>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:slug" element={<CategoryPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track-order" element={<OrderTrackingPage />} />
          <Route path="orders" element={<OrderTrackingPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          {/* Placeholder routes */}
          <Route path="offers" element={<div className="p-8 text-center text-gray-400">Offers coming soon</div>} />
          <Route path="new-arrivals" element={<div className="p-8 text-center text-gray-400">New Arrivals coming soon</div>} />
          <Route path="best-sellers" element={<div className="p-8 text-center text-gray-400">Best Sellers coming soon</div>} />
          <Route path="download-app" element={<div className="p-8 text-center text-gray-400">Download App coming soon</div>} />
          <Route path="order-confirmation" element={
            <div className="max-w-md mx-auto px-4 py-16 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h1>
              <p className="text-gray-500 text-sm mb-6">Thank you for shopping with Shree Seva. Your order will be delivered soon.</p>
              <a href="/" className="inline-block bg-[#8F1028] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#690D20] transition-colors">Continue Shopping</a>
            </div>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
