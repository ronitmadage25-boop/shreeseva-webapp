import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Hero product showcase items — using emoji as reliable fallback icons
// alongside picsum images. The emoji label appears if the image fails to load.
const HERO_PRODUCTS = [
  { seed: 'hero-atta', label: '🌾 Atta', bg: '#FFF3E0' },
  { seed: 'hero-rice', label: '🍚 Rice', bg: '#F3F4F6' },
  { seed: 'hero-oil', label: '🫙 Oil', bg: '#FFFDE7' },
  { seed: 'hero-tea', label: '🍵 Tea', bg: '#FFF0F3' },
  { seed: 'hero-cola', label: '🥤 Cola', bg: '#E8F4FD' },
  { seed: 'hero-biscuit', label: '🍪 Biscuits', bg: '#FCE4EC' },
];

const SLIDES = [
  {
    id: 1,
    badge: 'Your Local Kirana Store Online',
    headline: 'Your Daily Needs,',
    headlineAccent: 'Just a Click Away.',
    description:
      'Daily Groceries, Cold Drinks, Stationery & More — All in One Place.',
    primaryBtn: { label: 'Shop Now', href: '/categories' },
    secondaryBtn: { label: 'Explore Categories', href: '/categories' },
    bgFrom: '#FFF9EF',
    bgTo: '#FFF0F3',
  },
  {
    id: 2,
    badge: 'Fresh & Convenient',
    headline: 'Kirana Essentials',
    headlineAccent: 'at Your Doorstep.',
    description:
      'Order from our store and choose home delivery or store pickup — whichever suits you.',
    primaryBtn: { label: 'Shop Groceries', href: '/categories/kirana-groceries' },
    secondaryBtn: { label: 'View Offers', href: '/offers' },
    bgFrom: '#FFF0F3',
    bgTo: '#FFF9EF',
  },
];

interface HeroImageProps {
  seed: string;
  label: string;
  bg: string;
}

function HeroImage({ seed, label, bg }: HeroImageProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className="aspect-square rounded-xl overflow-hidden shadow-md flex items-center justify-center text-xl"
      style={{ background: bg }}
    >
      {error ? (
        <span className="text-2xl select-none">{label.split(' ')[0]}</span>
      ) : (
        <img
          src={`https://picsum.photos/seed/${seed}/160/160`}
          alt={label}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${slide.bgFrom} 60%, ${slide.bgTo} 100%)`,
        transition: 'background 0.7s ease',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-10 py-8 md:py-12">

          {/* ── Left: Text Content ───────────────────────────────────────── */}
          <div className="flex-1 text-center md:text-left">
            {/* Badge */}
            <span className="inline-block bg-[#FFC83D] text-[#252525] text-xs font-bold px-3 py-1 rounded-full mb-4">
              {slide.badge}
            </span>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#252525] mb-1">
              {slide.headline}
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#8F1028] mb-4">
              {slide.headlineAccent}
            </h1>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to={slide.primaryBtn.href}
                className="flex items-center gap-2 bg-[#8F1028] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#690D20] transition-colors shadow-md active:scale-95"
              >
                {slide.primaryBtn.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={slide.secondaryBtn.href}
                className="flex items-center gap-2 border-2 border-[#8F1028] text-[#8F1028] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#8F1028] hover:text-white transition-colors active:scale-95"
              >
                {slide.secondaryBtn.label}
              </Link>
            </div>
          </div>

          {/* ── Right: Product Mosaic ─────────────────────────────────────── */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="grid grid-cols-3 gap-2 max-w-[300px] sm:max-w-[340px] mx-auto">
              {HERO_PRODUCTS.map((item, i) => (
                <HeroImage key={i} seed={item.seed} label={item.label} bg={item.bg} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide Dots ──────────────────────────────────────────────────── */}
      <div className="flex justify-center gap-2 pb-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2 bg-[#8F1028]' : 'w-2 h-2 bg-[#8F1028]/30'
            }`}
          />
        ))}
      </div>

      {/* ── Desktop Prev/Next ────────────────────────────────────────────── */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 shadow rounded-full items-center justify-center hover:bg-white transition-colors hidden md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 shadow rounded-full items-center justify-center hover:bg-white transition-colors hidden md:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </button>
    </section>
  );
}
