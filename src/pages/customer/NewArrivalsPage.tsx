import { newArrivals } from '../../data/products';
import { ProductListingView } from '../../components/products/ProductListingView';

export function NewArrivalsPage() {
  return (
    <ProductListingView
      title="New Arrivals at Shree Seva"
      description="Fresh stock of seasonal grocery, brand-new snack varieties, and latest school supplies just arrived in store."
      bannerBgColor="#FFF9EF"
      badge="Just Arrived"
      products={newArrivals}
      breadcrumbs={[{ label: 'New Arrivals' }]}
      emptyMessage="No new arrival products match your selected filters."
    />
  );
}

