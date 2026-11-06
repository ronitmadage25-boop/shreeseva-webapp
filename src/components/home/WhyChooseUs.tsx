import { ShieldCheck, Clock, Bike, ThumbsUp, Star, Package } from 'lucide-react';

const REASONS = [
  {
    icon: Bike,
    title: 'Fast Home Delivery',
    desc: 'Get your orders delivered to your doorstep in Pachora quickly.',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine Products',
    desc: 'All products are 100% genuine and sourced from trusted brands.',
  },
  {
    icon: Clock,
    title: 'Same-Day Delivery',
    desc: 'Order before 10 AM and get same-day delivery in select areas.',
  },
  {
    icon: ThumbsUp,
    title: 'Best Prices',
    desc: 'Competitive pricing with regular offers and discount on top brands.',
  },
  {
    icon: Star,
    title: 'Trusted by Community',
    desc: 'Serving the people of Pachora with love and quality since years.',
  },
  {
    icon: Package,
    title: 'Store Pickup',
    desc: 'Order online and pick up directly from our store at your convenience.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#252525]">Why Choose Shree Seva?</h2>
          <p className="text-gray-500 text-sm mt-1.5 max-w-lg mx-auto">
            Your neighbourhood store, now online — with the same trust, quality and care.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#FFF9EF] border border-[#FFC83D]/20 hover:border-[#8F1028]/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#8F1028]/10 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-[#8F1028]" />
              </div>
              <h3 className="font-bold text-sm text-gray-800 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

