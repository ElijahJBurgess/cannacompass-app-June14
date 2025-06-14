'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { getUserId } from '../lib/getUserId';
import { getMatchingProducts } from '../lib/getMatchingProducts';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  description: string;
  effect: string;
  thc: string;
  image_url: string;
  experience_level?: string;
  method?: string;
  daypart?: string;
  cannabinoid_profile?: string;
  affiliate_url?: string;
  slug?: string;
  effectiveness?: {
    [key: string]: number;
  };
  cbd?: string;
  matchReasons?: {
    criteria: string;
    score: number;
    explanation: string;
  }[];
  matchScore?: number;
};

// Price Tag Component
interface PriceTagProps {
  affiliateUrl?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({ affiliateUrl }) => (
  <div className="mt-2">
    <div className="text-lg font-semibold text-green-800">
      From $24.99
    </div>
    <div className="text-sm text-gray-500">
      Price may vary by location
    </div>
    {affiliateUrl && (
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-green-700 hover:underline mt-1 inline-block"
      >
        Check live price on Eaze →
      </a>
    )}
  </div>
);

// Reusable Accordion Component with improved animations
interface AccordionSectionProps {
  title: string;
  icon?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}) => {
  // Use a ref to measure the content height
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Update content height when children change
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-green-100 mb-4">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <h3 className="text-neutral-800 text-lg font-medium flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h3>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : ''
          } text-green-700 group-hover:text-green-900`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openSections, setOpenSections] = useState({
    whyRecommended: true, // Open by default
    wellnessBenefits: false,
    howToUse: false,
  });
  const [otherRecommendedProducts, setOtherRecommendedProducts] = useState<Product[]>([]);
  const [loadingOtherProducts, setLoadingOtherProducts] = useState(true);

  useEffect(() => {
    const fetchProductAndRecommendations = async () => {
      if (!productId) {
        setLoadingOtherProducts(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error.message);
        setLoadingOtherProducts(false);
      } else {
        setProduct(data);

        const userId = getUserId();
        if (userId) {
          const { data: responsesData, error: responseError } = await supabase
            .from('quiz_responses')
            .select('responses')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!responseError && responsesData?.responses) {
            const matched = await getMatchingProducts(responsesData.responses);
            const filtered = matched.filter(p => p.id !== data.id);
            setOtherRecommendedProducts(filtered);
          } else {
            console.error('No quiz responses found for this user or error fetching responses:', responseError?.message);
          }
        }
        setLoadingOtherProducts(false);
      }
    };

    fetchProductAndRecommendations();
  }, [productId]);

  const handleSubmit = async () => {
    const userId = getUserId();
    if (!email || !userId || !productId) return;

    const { error } = await supabase.from('waitlist_requests').insert([
      {
        user_id: userId,
        email: email,
        product_id: productId,
      },
    ]);

    if (!error) {
      setSubmitted(true);
    } else {
      console.error('Error submitting waitlist:', error.message);
    }
  };

  if (!product) {
    return <p className="text-center text-gray-800 mt-20">Loading product...</p>;
  }

  // Dummy data for match reasons, wellness tags, and how-to-use tips
  const matchReasons = product.matchReasons && product.matchReasons.length > 0
    ? product.matchReasons.map(reason => reason.explanation)
    : ['You preferred non-smokable options', 'You indicated trouble sleeping'];

  const wellnessTags = [
    'Sleep Support',
    'Pain Relief',
    'Calm & Relaxation',
    'Beginner Friendly',
    ...product.effect.split(',').map(tag => tag.trim()),
  ];

  const howToUseTips = [
    'Take in the evening for optimal sleep support',
    'Start with a low dose and increase gradually',
    'Effects typically begin within 30-60 minutes',
    'Store in a cool, dry place away from direct sunlight',
  ];

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-[#F1FFF4] font-inter relative overflow-hidden">
      {/* Decorative Elements Container */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Brand Watermark */}
        <img
          src="/Images/cannacompass-compass-logo.png"
          alt="CannaCompass Logo"
          className="absolute top-6 left-6 w-24 md:w-32 opacity-100 blur-none z-10"
        />

        {/* Top Section Leaves */}
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute top-[5%] left-[5%] w-24 h-24 opacity-10 rotate-[-70deg] animate-drift"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute top-[15%] right-[8%] w-20 h-20 opacity-10 rotate-[45deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute top-[30%] left-[15%] w-16 h-16 opacity-10 rotate-[120deg] animate-drift"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[8%] right-[25%] w-28 h-28 opacity-15 rotate-[-25deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[22%] left-[30%] w-20 h-20 opacity-10 rotate-[85deg] animate-drift"
        />

        {/* Middle Section Leaves */}
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute top-[45%] right-[12%] w-28 h-28 opacity-10 rotate-[-30deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute top-[60%] left-[8%] w-20 h-20 opacity-10 rotate-[15deg] animate-drift"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute top-[50%] left-[45%] w-16 h-16 opacity-10 rotate-[-50deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[55%] right-[35%] w-24 h-24 opacity-15 rotate-[65deg] animate-drift"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[40%] left-[35%] w-20 h-20 opacity-10 rotate-[-95deg] animate-float"
        />

        {/* Bottom Section Leaves */}
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute bottom-[15%] right-[10%] w-24 h-24 opacity-10 rotate-[80deg] animate-drift"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute bottom-[25%] left-[12%] w-20 h-20 opacity-10 rotate-[-120deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute bottom-[40%] right-[20%] w-16 h-16 opacity-10 rotate-[60deg] animate-drift"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute bottom-[30%] right-[40%] w-28 h-28 opacity-15 rotate-[-45deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute bottom-[20%] left-[35%] w-20 h-20 opacity-10 rotate-[110deg] animate-drift"
        />

        {/* Product Image Background Leaves */}
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="absolute top-[20%] left-[20%] w-32 h-32 opacity-5 rotate-[25deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[25%] left-[25%] w-24 h-24 opacity-10 rotate-[-15deg] animate-drift"
        />

        {/* Additional Floating Leaves */}
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[70%] right-[30%] w-20 h-20 opacity-15 rotate-[40deg] animate-float"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[75%] left-[25%] w-16 h-16 opacity-10 rotate-[-60deg] animate-drift"
        />
        <img
          src="/images/leaf.png"
          alt="Decorative Leaf"
          className="hidden md:block absolute top-[85%] right-[15%] w-24 h-24 opacity-15 rotate-[75deg] animate-float"
        />
      </div>

      {/* Main Content */}
      <main className="pt-8 relative z-10">
        {/* Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-8 flex items-center gap-2 mb-8">
          <Link href="/" className="text-neutral-800 text-sm font-light hover:text-green-900 transition-colors">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href="/shop" className="text-neutral-800 text-sm font-light hover:text-green-900 transition-colors">Shop</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-800 text-sm font-light">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Product Image */}
          <div className="flex justify-center relative">
            {/* Additional leaf behind product image */}
            <img
              src="/images/leaf.png"
              alt="Decorative Leaf"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-5 rotate-[15deg] animate-float pointer-events-none select-none"
            />
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full max-w-md h-auto object-cover rounded-3xl shadow-sm relative z-10"
            />
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-6">
            {/* Product Name and Rating */}
            <div className="flex flex-col gap-3">
              <h1 className="text-neutral-800 text-4xl font-semibold leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.834-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-neutral-800 text-sm font-light">4.8</span>
              </div>
              {/* Add Price Tag Component */}
              <PriceTag affiliateUrl={product.affiliate_url} />
            </div>

            {/* Product Info Badges */}
            <div className="flex flex-wrap gap-2">
              {product.experience_level && (
                <div className="bg-green-100/50 rounded-full px-4 py-1.5 flex items-center justify-center gap-2">
                  <span className="text-green-900 text-xs font-medium">Experience Level:</span>
                  <span className="text-green-900 text-xs">{product.experience_level}</span>
                </div>
              )}
              <div className="bg-green-100/50 rounded-full px-4 py-1.5 flex items-center justify-center gap-2">
                <span className="text-green-900 text-xs font-medium">THC:</span>
                <span className="text-green-900 text-xs">{product.thc}</span>
              </div>
              {product.cannabinoid_profile && (
                <div className="bg-green-100/50 rounded-full px-4 py-1.5 flex items-center justify-center gap-2">
                  <span className="text-green-900 text-xs font-medium">Profile:</span>
                  <span className="text-green-900 text-xs">{product.cannabinoid_profile}</span>
                </div>
              )}
            </div>

            {/* Effectiveness Bar */}
            <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-green-100">
              <h3 className="text-neutral-800 text-lg font-medium mb-3">Product Effects</h3>
              <div className="space-y-2">
                {product.effect.split(',').map((eff, index) => {
                  const effect = eff.trim();
                  const effectiveness = product.effectiveness?.[effect] || 85;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                      <span className="flex-1">{effect}</span>
                      <div className="w-20 h-1.5 bg-green-200 rounded-full">
                        <div
                          className="h-full bg-green-700 rounded-full transition-all duration-500"
                          style={{ width: `${effectiveness}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-500">({effectiveness}% effective)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accordion Sections */}
            <AccordionSection
              title="Why This is Recommended for You"
              icon="🌿"
              isOpen={openSections.whyRecommended}
              onToggle={() => toggleSection('whyRecommended')}
            >
              <ul className="list-disc list-inside text-neutral-700 text-sm leading-relaxed space-y-2">
                {matchReasons.map((reason, index) => (
                  <li key={index} className="transition-opacity duration-300">{reason}</li>
                ))}
              </ul>
            </AccordionSection>

            <AccordionSection
              title="Wellness Benefits"
              icon="✨"
              isOpen={openSections.wellnessBenefits}
              onToggle={() => toggleSection('wellnessBenefits')}
            >
              <div className="flex flex-wrap gap-2">
                {wellnessTags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-lime-100 text-green-900 rounded-full px-3 py-1 text-sm transition-all duration-300 hover:bg-lime-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection
              title="How to Use This Product"
              icon="📘"
              isOpen={openSections.howToUse}
              onToggle={() => toggleSection('howToUse')}
            >
              <ul className="list-disc list-inside text-neutral-700 text-sm leading-relaxed space-y-2">
                {howToUseTips.map((tip, index) => (
                  <li key={index} className="transition-opacity duration-300">{tip}</li>
                ))}
              </ul>
            </AccordionSection>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a
                href={product.affiliate_url || `https://eaze.com/product/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[44px] px-6 py-3 bg-green-900 rounded-full text-white text-base font-medium hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
              >
                Buy on Eaze
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <Link
                href="/quiz"
                className="flex-1 min-h-[44px] px-6 py-3 bg-white border border-green-900 rounded-full text-green-900 text-base font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                Take Quiz Again
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Link>
            </div>

            {/* Read More Link */}
            <Link
              href={`/blog/${product.slug || product.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-green-900 hover:text-green-800 font-medium text-center sm:text-left flex items-center justify-center sm:justify-start gap-2"
            >
              Read More About This Strain
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Other Recommended Products Section */}
        {loadingOtherProducts ? (
          <p className="text-center text-gray-700 mt-12">Loading other recommendations...</p>
        ) : otherRecommendedProducts.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-8 mt-16 relative">
            {/* Additional leaf for recommended products section */}
            <img
              src="/images/leaf.png"
              alt="Decorative Leaf"
              className="absolute top-1/2 right-[10%] w-24 h-24 opacity-10 rotate-[-30deg] animate-drift pointer-events-none select-none"
            />
            <h2 className="text-neutral-800 text-3xl font-semibold mb-8 text-center md:text-left">
              Other Products Recommended For You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {otherRecommendedProducts.slice(0, 4).map((recProduct) => (
                <Link
                  href={`/checkout?product=${recProduct.id}`}
                  key={recProduct.id}
                  className="block bg-white rounded-xl shadow-sm p-6 flex flex-col text-left transition hover:shadow-md"
                >
                  <img
                    src={recProduct.image_url}
                    alt={recProduct.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold text-zinc-800 mb-1">{recProduct.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{recProduct.effect}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-green-800 text-xs font-medium">THC: {recProduct.thc}</span>
                    {recProduct.cbd && <span className="text-green-800 text-xs font-medium">CBD: {recProduct.cbd}</span>}
                    {recProduct.experience_level && (
                      <span className="text-green-800 text-xs font-medium">Level: {recProduct.experience_level}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {otherRecommendedProducts.length > 4 && (
              <div className="text-center mt-12">
                <Link
                  href="/results"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-900 rounded-full text-white text-base font-medium hover:bg-green-800 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

