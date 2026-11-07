import { HeroBanner } from '../../components/home/HeroBanner';
import { ShoppingBenefits } from '../../components/home/ShoppingBenefits';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { ProductSection } from '../../components/home/ProductSection';
import { SpecialOffers } from '../../components/home/SpecialOffers';
import { WhyChooseUs } from '../../components/home/WhyChooseUs';
import { PromoBanner } from '../../components/home/PromoBanner';
import {
  kiranaProducts,
  beverageProducts,
  stationeryProducts,
  bestSellers,
} from '../../data/products';

export function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Desktop Hero Banner (Hidden on Mobile) */}
      <div className="hidden md:block">
        <HeroBanner />
      </div>

      {/* Mobile Promo Banner (Matches Reference Image Mobile Phone Screen) */}
      <PromoBanner />

      {/* Shopping Benefits (Home Delivery, Store Pickup, Secure Payments, Support) */}
      <ShoppingBenefits />

      {/* Shop by Category (Kirana first, Cold Drinks, Stationery, etc.) */}
      <CategoryGrid />

      {/* Daily Grocery Essentials — PRIMARY CATEGORY (Atta, Rice, Cooking Oil, Salt, Dal, Tea, Biscuits, Sugar) */}
      <ProductSection
        title="Daily Grocery Essentials"
        subtitle="Essential kirana staples for your home — flour, rice, cooking oils, dal, tea & daily essentials"
        products={kiranaProducts}
        viewAllHref="/categories/kirana-groceries"
        maxItems={8}
      />

      {/* Cold Drinks & Beverages */}
      <ProductSection
        title="Cold Drinks & Beverages"
        subtitle="Refreshing soft drinks, packaged mineral water, pure juices and energy beverages"
        products={beverageProducts}
        viewAllHref="/categories/cold-drinks-beverages"
        maxItems={6}
        bgColor="#F0F7FF"
      />

      {/* Special Offers Section */}
      <SpecialOffers />

      {/* General Stationery */}
      <ProductSection
        title="General Stationery"
        subtitle="School notebooks, smooth ballpoint pens, drawing pencils and geometry supplies"
        products={stationeryProducts}
        viewAllHref="/categories/general-stationery"
        maxItems={4}
      />

      {/* Best Sellers */}
      <ProductSection
        title="🔥 Best Sellers"
        subtitle="Most popular and trusted products ordered by our customers"
        products={bestSellers}
        viewAllHref="/best-sellers"
        maxItems={6}
        bgColor="#FFF9EF"
      />

      {/* Why Choose Shree Seva */}
      <WhyChooseUs />
    </div>
  );
}
