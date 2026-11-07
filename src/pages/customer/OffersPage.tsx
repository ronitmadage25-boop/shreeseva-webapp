import { specialOffers } from '../../data/products';
import { ProductListingView } from '../../components/products/ProductListingView';

export function OffersPage() {
  return (
    <ProductListingView
      title="Special Offers & Discounts"
      description="Save big on daily kirana staples, packaged foods, and household essentials at Shree Seva, Pachora."
      bannerBgColor="#FFF0F3"
      badge="Save Up to 25%"
      products={specialOffers}
      breadcrumbs={[{ label: 'Special Offers' }]}
      emptyMessage="No discounted items found matching the selected filters right now."
    />
  );
}

