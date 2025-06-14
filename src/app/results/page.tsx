'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getMatchingProducts } from '../lib/getMatchingProducts';
import { getUserId } from '../lib/getUserId';

type Product = {
  id: string;
  name: string;
  effect: string;
  thc: string;
  description: string;
  image_url: string;
  experience_level?: string;
  method?: string;
  daypart?: string;
  cannabinoid_profile?: string;
  affiliate_url?: string;
  matchReasons: {
    criteria: string;
    score: number;
    explanation: string;
  }[];
  matchScore: number;
};

export default function ResultsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);

      const userId = getUserId();
      if (!userId) {
        console.error('User ID not found.');
        setLoading(false);
        return;
      }

      const { data: responsesData, error: responseError } = await supabase
        .from('quiz_responses')
        .select('responses')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (responseError || !responsesData?.responses) {
        console.error('No quiz responses found for this user');
        setLoading(false);
        return;
      }

      const matched = await getMatchingProducts(responsesData.responses);
      setProducts(matched);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-[#F1FFF4] py-12 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative Leaf Images */}
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-20 h-20 absolute top-10 left-10 opacity-20 rotate-[15deg] pointer-events-none select-none animate-float z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-24 h-24 absolute bottom-20 right-10 opacity-15 rotate-[-25deg] pointer-events-none select-none animate-drift z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-16 h-16 absolute top-1/4 right-1/4 opacity-10 rotate-[40deg] pointer-events-none select-none animate-float z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-28 h-28 absolute bottom-1/3 left-1/4 opacity-20 rotate-[-10deg] pointer-events-none select-none animate-drift z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-20 h-20 absolute top-20 right-20 opacity-15 rotate-[55deg] pointer-events-none select-none animate-drift z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-22 h-22 absolute bottom-10 left-32 opacity-10 rotate-[-30deg] pointer-events-none select-none animate-float z-0"
      />
      {/* Added more leaves for better coverage */}
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-18 h-18 absolute top-[45%] left-5 opacity-15 rotate-[20deg] pointer-events-none select-none animate-float z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-26 h-26 absolute top-[15%] right-[5%] opacity-20 rotate-[-70deg] pointer-events-none select-none animate-drift z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-14 h-14 absolute bottom-[5%] left-[45%] opacity-10 rotate-[80deg] pointer-events-none select-none animate-float z-0"
      />
      <img
        src="/images/leaf.png"
        alt="Decorative Leaf"
        className="hidden md:block w-22 h-22 absolute top-[30%] left-[40%] opacity-10 rotate-[-50deg] pointer-events-none select-none animate-drift z-0"
      />

      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
          Your Personalized Recommendations
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Based on your quiz answers, these products may support sleep, focus, or relief.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-700">Loading recommendations...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-neutral-500">
          No matching products found. Try adjusting your quiz answers or check back later.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col text-left transition hover:shadow-lg"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />

              <h3 className="text-lg font-semibold text-zinc-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.effect}</p>

              {/* Match Reasons Section */}
              {product.matchReasons && product.matchReasons.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {product.matchReasons.slice(0, 3).map((reason, index) => (
                      <span
                        key={index}
                        className="bg-lime-50 text-green-800 text-xs px-3 py-1 rounded-full border border-lime-200"
                        title={`Match score: ${reason.score}%`}
                      >
                        {reason.explanation}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="bg-lime-100 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                  THC: {product.thc}
                </span>
                {product.cannabinoid_profile && (
                  <span className="bg-lime-100 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                    {product.cannabinoid_profile}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                {product.description}
              </p>

              <div className="mt-auto space-y-2">
                <a
                  href={product.affiliate_url || `https://eaze.com/product/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-lime-700 text-white font-semibold py-2 rounded-full hover:bg-lime-800 transition"
                >
                  Buy on Eaze
                </a>

                <a
                  href={`/checkout?product=${product.id}`}
                  className="block w-full text-center border border-lime-700 text-lime-700 font-semibold py-2 rounded-full hover:bg-lime-50 transition"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <span className="text-neutral-400">Not quite right? </span>
        <a href="/quiz" className="text-green-900 font-semibold underline">
          Adjust Preferences
        </a>
      </div>
    </div>
  );
}