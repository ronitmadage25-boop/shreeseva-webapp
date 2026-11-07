import { bestSellers } from '../../data/products';
import { ProductListingView } from '../../components/products/ProductListingView';

export function BestSellersPage() {
  return (
    <ProductListingView
      title="Best Selling Household Products"
      description="The most frequently purchased daily grocery staples, favourite beverages, and essential stationery trusted by Pachora families."
      bannerBgColor="#FFF3E0"
      badge="Top Rated"
      products={bestSellers}
      breadcrumbs={[{ label: 'Best Sellers' }]}
      emptyMessage="No best seller products match your selected filters."
    />
  );
}

