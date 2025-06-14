'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import quizData from './quizData.json';
import { supabase } from '../supabaseClient';
import { getUserId } from '../lib/getUserId';

const QuizPage = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const currentQ = quizData[current];

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQ.id]: option });
  };

  const handleNext = async () => {
    if (current < quizData.length - 1) {
      setCurrent(current + 1);
    } else {
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID found.');
        return;
      }

      const { error } = await supabase.from('quiz_responses').insert([
        {
          user_id: userId,
          responses: answers,
        },
      ]);

      if (error) {
        console.error('Error saving responses:', error.message);
      } else {
        console.log('Responses saved to Supabase');
        router.replace('/quiz/loading');
      }
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const progress = ((current + 1) / quizData.length) * 100;

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  const getOptionEmoji = (option: string) => {
    const lower = option.toLowerCase();
    if (lower.includes('sleep')) return '🌙';
    if (lower.includes('pain')) return '💊';
    if (lower.includes('anxiety') || lower.includes('calm')) return '😌';
    if (lower.includes('smoke')) return '🔥';
    if (lower.includes('edible')) return '🍬';
    if (lower.includes('tincture')) return '🧴';
    if (lower.includes('beginner')) return '🟢';
    if (lower.includes('experienced')) return '🔵';
    return '🌿';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 pb-20 p-4 bg-[#F1FFF4] relative overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-lime-700 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Animated Question Block */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center w-full max-w-2xl"
      >
        <div className="text-lime-700 text-sm font-bold mb-4">
          Question {current + 1}/{quizData.length}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center text-black mb-8">
          {currentQ.question}
        </h1>

        <div className="w-full flex flex-col items-center gap-4 mb-6">
          {currentQ.options.map((option, index) => {
            const isSelected = answers[currentQ.id] === option;
            return (
              <motion.button
                whileTap={{ scale: 0.97 }}
                key={index}
                className={`w-full text-left py-3 px-4 rounded-lg border ${
                  isSelected
                    ? 'bg-lime-700 text-white border-lime-700'
                    : 'bg-white text-gray-800 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-lime-700 focus:ring-opacity-50 transition-all duration-200`}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getOptionEmoji(option)}</span>
                  <span className="text-lg">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full max-w-xs mt-6">
        <button
          onClick={handleBack}
          disabled={current === 0}
          className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            current === 0
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-lime-700 text-lime-700 hover:bg-lime-50'
          } focus:outline-none focus:ring-2 focus:ring-lime-700 focus:ring-opacity-50 transition-colors duration-200`}
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full flex items-center justify-center border bg-lime-700 text-white border-lime-700 hover:bg-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-700 focus:ring-opacity-50 transition-colors duration-200"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default QuizPage;

