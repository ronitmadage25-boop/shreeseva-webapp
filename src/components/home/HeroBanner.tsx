import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: 'Your Local Kirana Store Online',
    title: 'Shree Seva',
    subtitle: 'Enterprises & Readymade',
    description: 'Daily Groceries, Cold Drinks, Stationery\n& More — All in One Place.',
    primaryBtn: { label: 'Shop Now', href: '/categories' },
    secondaryBtn: { label: 'Explore Categories', href: '/categories' },
    bgColor: '#FFF9EF',
    accentColor: '#FFC83D',
    productImages: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&q=80',
      'https://images.unsplash.com/photo-1536304993881-ff86e0c9c7a3?w=120&q=80',
      'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=120&q=80',
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=120&q=80',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&q=80',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=120&q=80',
    ],
  },
  {
    id: 2,
    badge: 'Fresh & Fast Delivery',
    title: 'Groceries at',
    subtitle: 'Your Doorstep',
    description: 'Order before 10 AM and get same-day\ndelivery in Pachora.',
    primaryBtn: { label: 'Order Now', href: '/categories/kirana-groceries' },
    secondaryBtn: { label: 'View Offers', href: '/offers' },
    bgColor: '#FFF0F3',
    accentColor: '#8F1028',
    productImages: [
      'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=120&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=120&q=80',
      'https://images.unsplash.com/photo-1612103198005-b238a9bcc7a3?w=120&q=80',
      'https://images.unsplash.com/photo-1612966809820-4d57e3ebee4b?w=120&q=80',
    ],
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700"
      style={{ background: slide.bgColor }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center min-h-[320px] md:min-h-[380px] py-8 md:py-10 gap-6 md:gap-8">
          {/* Left — Text */}
          <div className="flex-1 text-center md:text-left">
            {/* Badge */}
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 transition-colors duration-500"
              style={{ background: slide.accentColor, color: slide.id === 1 ? '#252525' : 'white' }}
            >
              {slide.badge}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-[#8F1028] leading-tight">
              {slide.title}
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-[#252525] mt-1 mb-3">
              {slide.subtitle}
            </h2>
            <p className="text-gray-600 text-sm md:text-base whitespace-pre-line leading-relaxed mb-6">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to={slide.primaryBtn.href}
                className="flex items-center gap-2 bg-[#8F1028] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#690D20] transition-colors shadow-md"
              >
                {slide.primaryBtn.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={slide.secondaryBtn.href}
                className="flex items-center gap-2 border-2 border-[#8F1028] text-[#8F1028] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#8F1028] hover:text-white transition-colors"
              >
                {slide.secondaryBtn.label}
              </Link>
            </div>
          </div>

          {/* Right — Product Images Grid */}
          <div className="flex-1 relative">
            <div className="grid grid-cols-3 gap-2 max-w-[360px] mx-auto">
              {slide.productImages.map((src, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-white shadow-md"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img
                    src={src}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2 bg-[#8F1028]' : 'w-2 h-2 bg-[#8F1028]/30'
            }`}
          />
        ))}
      </div>

      {/* Nav Buttons */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 shadow rounded-full flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 shadow rounded-full flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </button>
    </section>
  );
}

