'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { getUserId } from '../../lib/getUserId';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1FFF4] text-center p-6">
      {/* Compass Logo */}
      <img
        src="/images/Canncompass-Compass-Logo.png"
        alt="CannaCompass Logo"
        className="mb-6 animate-pulse-fade max-w-[150px] h-auto"
      />

      {/* Loading Text */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Finding your perfect match
      </h1>
      <p className="text-gray-600 mb-6">
        Just a moment while we find products that fit your needs 🌿
      </p>
    </div>
  );
}
