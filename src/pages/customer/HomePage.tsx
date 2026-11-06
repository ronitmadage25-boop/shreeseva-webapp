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
    <div>
      {/* Desktop Hero / Mobile Promo Banner */}
      <div className="hidden md:block">
        <HeroBanner />
      </div>

      {/* Mobile Promo Banner */}
      <PromoBanner />

      {/* Shopping Benefits */}
      <ShoppingBenefits />

      {/* Shop by Category */}
      <CategoryGrid />

      {/* Daily Grocery Essentials — PRIMARY focus */}
      <ProductSection
        title="Daily Grocery Essentials"
        subtitle="Your everyday kirana needs at the best prices"
        products={kiranaProducts}
        viewAllHref="/categories/kirana-groceries"
        maxItems={6}
      />

      {/* Cold Drinks & Beverages */}
      <ProductSection
        title="Cold Drinks & Beverages"
        subtitle="Stay refreshed with your favourite drinks"
        products={beverageProducts}
        viewAllHref="/categories/cold-drinks-beverages"
        maxItems={6}
        bgColor="#F0F7FF"
      />

      {/* Special Offers */}
      <SpecialOffers />

      {/* General Stationery */}
      <ProductSection
        title="General Stationery"
        subtitle="Notebooks, pens and school supplies"
        products={stationeryProducts}
        viewAllHref="/categories/general-stationery"
        maxItems={4}
      />

      {/* Best Sellers */}
      <ProductSection
        title="🔥 Best Sellers"
        subtitle="Most loved products in our store"
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
