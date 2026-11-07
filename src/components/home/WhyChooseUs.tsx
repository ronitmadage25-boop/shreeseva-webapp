import { ShieldCheck, Clock, Bike, ThumbsUp, Star, Package } from 'lucide-react';

const REASONS = [
  {
    icon: Bike,
    title: 'Local Home Delivery',
    desc: 'Convenient home delivery across Pachora town limits.',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine Products',
    desc: '100% genuine retail staples sourced directly from trusted FMCG brands.',
  },
  {
    icon: Clock,
    title: 'Prompt Service',
    desc: 'Quick order processing during store retail hours.',
  },
  {
    icon: ThumbsUp,
    title: 'Best Neighbourhood Prices',
    desc: 'Competitive local prices with regular offers on daily household staples.',
  },
  {
    icon: Star,
    title: 'Community Trusted',
    desc: 'Serving families of Pachora with quality grocery and retail service.',
  },
  {
    icon: Package,
    title: 'Store Counter Pickup',
    desc: 'Order online and pick up directly from our retail counter at your convenience.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#252525]">Why Choose Shree Seva?</h2>
          <p className="text-gray-500 text-sm mt-1.5 max-w-lg mx-auto">
            Your neighbourhood store, now online — with the same trust, quality and care.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-[#FFF9EF] border border-[#FFC83D]/20 hover:border-[#8F1028]/20 transition-all duration-200"
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
