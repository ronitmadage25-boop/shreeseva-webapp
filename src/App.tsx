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
import { SearchResultsPage } from './pages/customer/SearchResultsPage';
import { OffersPage } from './pages/customer/OffersPage';
import { NewArrivalsPage } from './pages/customer/NewArrivalsPage';
import { BestSellersPage } from './pages/customer/BestSellersPage';

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
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="new-arrivals" element={<NewArrivalsPage />} />
          <Route path="best-sellers" element={<BestSellersPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track-order" element={<OrderTrackingPage />} />
          <Route path="orders" element={<OrderTrackingPage />} />
          <Route path="orders/:orderNumber" element={<OrderTrackingPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          {/* Informational / App Download Route */}
          <Route path="download-app" element={
            <div className="max-w-md mx-auto px-4 py-16 text-center">
              <div className="w-16 h-16 bg-[#FFF9EF] text-[#8F1028] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-[#FFC83D]/40">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-gray-800 mb-2">Shree Seva Mobile App</h1>
              <p className="text-xs text-gray-500 mb-6">Install our lightweight Progressive Web App on Android & iOS for 1-tap local grocery ordering in Pachora.</p>
              <a href="/" className="inline-block bg-[#8F1028] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#690D20] transition-colors">Return to Shop</a>
            </div>
          } />
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
