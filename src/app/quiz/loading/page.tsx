'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { getUserId } from '../../lib/getUserId';
import Image from 'next/image';

export default function LoadingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processQuizData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.error('No user ID found');
          router.replace('/quiz');
          return;
        }

        // First, verify that the quiz responses were saved
        const { data: responsesData, error: responseError } = await supabase
          .from('quiz_responses')
          .select('responses')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (responseError || !responsesData?.responses) {
          console.error('No quiz responses found');
          router.replace('/quiz');
          return;
        }

        // Wait for 8 seconds to show loading animation
        await new Promise(resolve => setTimeout(resolve, 8000));

        // Navigate to results page
        router.replace('/results');
      } catch (error) {
        console.error('Error processing quiz data:', error);
        router.replace('/quiz');
      }
    };

    processQuizData();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1FFF4] text-center p-6 relative overflow-hidden">
      {/* Decorative Leaf Images */}
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute top-4 left-8 w-12 opacity-10 pointer-events-none z-0 rotate-3" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute top-20 right-12 w-14 opacity-10 pointer-events-none z-0 -rotate-6" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute top-40 left-20 w-8 opacity-10 pointer-events-none z-0 rotate-12" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute top-60 right-24 w-20 opacity-10 pointer-events-none z-0 -rotate-3" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute top-80 left-16 w-12 opacity-10 pointer-events-none z-0 rotate-6" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-40 right-16 w-16 opacity-10 pointer-events-none z-0 -rotate-12" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-60 left-24 w-14 opacity-10 pointer-events-none z-0 rotate-3" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-20 right-20 w-10 opacity-10 pointer-events-none z-0 -rotate-6" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute top-1/4 left-1/4 w-20 opacity-10 pointer-events-none z-0 rotate-12" />
      <img src="/images/leaf.png" alt="" aria-hidden="true" className="absolute top-1/3 right-1/3 w-8 opacity-10 pointer-events-none z-0 -rotate-3" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-10">
        {/* Compass Logo */}
        <div className="mb-8 animate-pulse-fade w-32 sm:w-40 md:w-48 aspect-square relative">
          <Image
            src="/images/cannacompass-compass-logo.png"
            alt="CannaCompass Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold text-center text-green-900 leading-tight mb-6">
          Finding your perfect match
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-green-800/80 leading-snug">
          Just a moment while we find products that fit your needs 🌿
        </p>
      </div>
    </div>
  );
}
