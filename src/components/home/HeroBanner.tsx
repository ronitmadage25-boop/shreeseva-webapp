import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { getGroceryFallbackImage } from '../../utils';

interface HeroProductTile {
  title: string;
  category: string;
  image: string;
  tag: string;
}

const HERO_GROCERIES: HeroProductTile[] = [
  {
    title: 'Aashirvaad Atta',
    category: 'Wheat & Grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
    tag: 'Staple',
  },
  {
    title: 'Basmati Rice',
    category: 'Daily Kirana',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    tag: 'Premium',
  },
  {
    title: 'Cooking Oil',
    category: 'Edible Oils',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    tag: 'Pure',
  },
  {
    title: 'Chilled Drinks',
    category: 'Cold Beverages',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80',
    tag: 'Chilled',
  },
  {
    title: 'Maggi Noodles',
    category: 'Quick Foods',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80',
    tag: 'Favourite',
  },
  {
    title: 'Tea & Biscuits',
    category: 'Chai Time',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
    tag: 'Daily',
  },
];

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
  },
  {
    id: 2,
    badge: 'Pachora Local Retail',
    title: 'Fresh Groceries',
    subtitle: 'at Your Doorstep',
    description: 'Order daily kirana staples, packaged foods & cold drinks with reliable local delivery or store pickup.',
    primaryBtn: { label: 'Shop Groceries', href: '/categories/kirana-groceries' },
    secondaryBtn: { label: 'View Offers', href: '/offers' },
    bgColor: '#FFF0F3',
    accentColor: '#8F1028',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700 border-b border-amber-100/50"
      style={{ background: slide.bgColor }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center min-h-[360px] md:min-h-[420px] py-8 md:py-12 gap-8 md:gap-12">
          
          {/* Left — Text Content */}
          <div className="flex-1 text-center md:text-left z-10">
            {/* Promotional Yellow Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-4 shadow-xs tracking-wide transition-all"
              style={{
                background: slide.accentColor,
                color: slide.id === 1 ? '#252525' : '#FFFFFF',
              }}
            >
              <span>✨</span>
              <span>{slide.badge}</span>
            </div>

            {/* Business Brand Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#8F1028] leading-[1.1] tracking-tight">
              {slide.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#252525] mt-1.5 mb-3 tracking-tight">
              {slide.subtitle}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-base whitespace-pre-line leading-relaxed mb-7 max-w-lg mx-auto md:mx-0">
              {slide.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3.5 justify-center md:justify-start">
              <Link
                to={slide.primaryBtn.href}
                className="flex items-center gap-2 bg-[#8F1028] text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-[#690D20] transition-all shadow-md active:scale-95"
              >
                <span>{slide.primaryBtn.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={slide.secondaryBtn.href}
                className="flex items-center gap-2 border-2 border-[#8F1028] text-[#8F1028] bg-white/60 hover:bg-[#8F1028] hover:text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-xs active:scale-95"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>{slide.secondaryBtn.label}</span>
              </Link>
            </div>
          </div>

          {/* Right — Realistic Grocery Showcase Composition */}
          <div className="flex-1 w-full max-w-[460px] mx-auto md:max-w-none">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[420px] mx-auto bg-white/40 p-3 sm:p-4 rounded-3xl border border-amber-200/40 backdrop-blur-xs shadow-lg">
              {HERO_GROCERIES.map((item, i) => (
                <div
                  key={i}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-gray-100 flex flex-col justify-end p-2 transition-transform duration-300 hover:scale-[1.03]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = getGroceryFallbackImage(item.title);
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                  
                  <span className="relative z-10 text-[9px] font-bold text-[#FFC83D] uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <p className="relative z-10 text-[11px] font-bold text-white leading-tight truncate">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Slide Indicator Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2 bg-[#8F1028]' : 'w-2 h-2 bg-[#8F1028]/25 hover:bg-[#8F1028]/50'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow-md rounded-full items-center justify-center transition-all hidden md:flex text-gray-700 hover:text-[#8F1028]"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow-md rounded-full items-center justify-center transition-all hidden md:flex text-gray-700 hover:text-[#8F1028]"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
