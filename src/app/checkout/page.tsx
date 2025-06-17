'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { getUserId } from '../lib/getUserId';
import { getMatchingProducts } from '../lib/getMatchingProducts';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/*                              Types & Helpers                               */
/* -------------------------------------------------------------------------- */
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
  effectiveness?: { [key: string]: number };
  cbd?: string;
  matchReasons?: { criteria: string; score: number; explanation: string }[];
  matchScore?: number;
};

/* ----------------------------- Price Tag ---------------------------------- */
interface PriceTagProps {
  affiliateUrl?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({ affiliateUrl }) => (
  <div className="mt-2">
    <div className="text-lg font-semibold text-green-800">From $24.99</div>
    <div className="text-sm text-gray-500">Price may vary by location</div>
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

/* --------------------------- Accordion ------------------------------------ */
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
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
        style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <div ref={contentRef} className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                        Checkout page **content**                           */
/*   (holds all hooks & JSX, stays inside Suspense boundary)                  */
/* -------------------------------------------------------------------------- */
function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');

  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openSections, setOpenSections] = useState({
    whyRecommended: true,
    wellnessBenefits: false,
    howToUse: false,
  });
  const [otherRecommendedProducts, setOtherRecommendedProducts] = useState<Product[]>([]);
  const [loadingOtherProducts, setLoadingOtherProducts] = useState(true);

  /* --------------------------- Fetch product ----------------------------- */
  useEffect(() => {
    (async () => {
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
        return;
      }

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
          setOtherRecommendedProducts(matched.filter((p) => p.id !== data.id));
        } else {
          console.error('Error fetching responses:', responseError?.message);
        }
      }

      setLoadingOtherProducts(false);
    })();
  }, [productId]);

  /* --------------------------- Wait-list submit -------------------------- */
  const handleSubmit = async () => {
    const userId = getUserId();
    if (!email || !userId || !productId) return;
    const { error } = await supabase
      .from('waitlist_requests')
      .insert([{ user_id: userId, email, product_id: productId }]);
    if (!error) setSubmitted(true);
    else console.error('Error submitting waitlist:', error.message);
  };

  if (!product) return <p className="text-center text-gray-800 mt-20">Loading product...</p>;

  /* --------------------------- Derived data ------------------------------ */
  const matchReasons =
    product.matchReasons?.length
      ? product.matchReasons.map((r) => r.explanation)
      : ['You preferred non-smokable options', 'You indicated trouble sleeping'];

  const wellnessTags = [
    'Sleep Support',
    'Pain Relief',
    'Calm & Relaxation',
    'Beginner Friendly',
    ...product.effect.split(',').map((t) => t.trim()),
  ];

  const howToUseTips = [
    'Take in the evening for optimal sleep support',
    'Start with a low dose and increase gradually',
    'Effects typically begin within 30-60 minutes',
    'Store in a cool, dry place away from direct sunlight',
  ];

  const toggleSection = (section: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  /* ------------------------------ JSX ----------------------------------- */
  return (
    <div className="min-h-screen bg-[#F1FFF4] font-inter relative overflow-hidden">
      {/* ------------- decorative + main content (unchanged) ------------- */}
      {/*            ...  (KEEP ALL YOUR EXISTING JSX HERE)  ...           */}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Page (Suspense shell)                            */
/* -------------------------------------------------------------------------- */
export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}


