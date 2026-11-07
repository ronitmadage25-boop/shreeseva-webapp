import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNav } from '../components/layout/BottomNav';
import { CartDrawer } from '../components/layout/CartDrawer';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream overflow-x-hidden w-full">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 w-full">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
    </div>
  );
}
