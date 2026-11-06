import { Truck, Store, Shield, Headphones } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Home Delivery',
    desc: 'Get it at your doorstep',
    iconBg: '#FFF0F3',
    iconColor: '#8F1028',
  },
  {
    icon: Store,
    title: 'Store Pickup',
    desc: 'Order online & pick up',
    iconBg: '#E8F4FD',
    iconColor: '#1565C0',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'UPI, Cards, Netbanking',
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
  },
  {
    icon: Headphones,
    title: 'Support',
    desc: "We're here to help",
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
  },
];

export function ShoppingBenefits() {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-100">
          {BENEFITS.map(({ icon: Icon, title, desc, iconBg, iconColor }) => (
            <div
              key={title}
              className="flex items-center gap-3 md:justify-center md:px-6 py-2 md:py-0"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: iconBg }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#252525]">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

