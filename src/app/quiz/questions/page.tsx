"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Moon, Zap, Heart, Brain, Users, Coffee, Sun, Leaf, Sparkles, Flame, Star, Music, Book } from 'lucide-react';
import quizData from '../quizData.json';

// Icon mapping for answers
const iconMap: { [key: string]: any } = {
  "Relaxation and unwinding": Moon,
  "Enhanced creativity or focus": Brain,
  "Better sleep quality": Moon,
  "Physical relief or recovery": Heart,
  "Social enjoyment with friends": Users,
  "New explorer (little to no experience)": Sparkles,
  "Occasional user (a few times a month)": Star,
  "Regular enthusiast (weekly use)": Flame,
  "Experienced consumer (daily use)": Zap,
  "Returning after a long break": Coffee,
  "Flower for smoking or vaping": Leaf,
  "Edibles (gummies, chocolates, beverages)": Heart,
  "Vape cartridges or disposables": Zap,
  "Tinctures or oils": Sparkles,
  "Topicals (creams, balms)": Heart,
  "Morning or daytime": Sun,
  "Evening to unwind": Moon,
  "Before bed": Moon,
  "During social activities": Users,
  "When needed for specific relief": Heart,
  "THC-dominant (more euphoric effects)": Zap,
  "CBD-dominant (minimal intoxication)": Leaf,
  "Balanced THC/CBD (moderate effects)": Star,
  "Microdose (subtle, functional effects)": Sparkles,
  "Not sure yet (I'd like guidance)": Brain,
  "Anxiety or racing thoughts": Brain,
  "Sedation or feeling too relaxed": Moon,
  "Cognitive effects (memory, focus)": Brain,
  "Dry mouth or increased appetite": Heart,
  "Strong intoxication or euphoria": Zap,
  "Relaxing at home (TV, reading, etc.)": Book,
  "Creative pursuits (art, music, writing)": Music,
  "Physical activities (yoga, hiking, exercise)": Heart,
  "Social gatherings or conversations": Users,
  "Sleep support or nighttime routine": Moon,
};

// Answer Button Component
const AnswerButton = ({ 
  option, 
  isSelected, 
  onClick 
}: { 
  option: string; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const Icon = iconMap[option] || Star;
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'bg-green-700 text-white border-green-700 transform scale-[1.02]'
          : 'bg-white text-green-900 border-green-200 hover:bg-green-50'
      }`}
    >
      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-green-600'}`} />
      <span className="text-left font-medium">{option}</span>
    </button>
  );
};

export default function QuizQuestionsPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.length - 1;

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Handle navigation
  const handleNext = () => {
    if (!selectedAnswer) return;
    
    setIsTransitioning(true);
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (isLastQuestion) {
      // Store answers and navigate to results
      localStorage.setItem('quiz_answers', JSON.stringify(newAnswers));
      router.push('/quiz/loading');
    } else {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      router.push('/quiz/welcome');
      return;
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setAnswers(prev => prev.slice(0, -1));
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#E7F6ED] px-4 py-8 relative overflow-hidden">
      {/* Static Leaf Elements */}
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-8 left-12 w-16 rotate-6 opacity-20 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-16 right-8 w-14 -rotate-12 opacity-15 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-12 left-16 w-20 rotate-45 opacity-25 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-24 right-16 w-12 -rotate-45 opacity-20 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-8 right-12 w-16 rotate-12 opacity-15 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-32 left-8 w-14 -rotate-6 opacity-25 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-1/4 left-1/4 w-18 rotate-90 opacity-20 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-1/3 right-1/4 w-16 -rotate-30 opacity-15 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-1/4 left-1/3 w-14 rotate-60 opacity-25 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-2/3 right-1/3 w-20 -rotate-15 opacity-20 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-1/3 left-1/2 w-12 rotate-75 opacity-15 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-1/2 left-1/6 w-16 -rotate-45 opacity-25 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-1/2 right-1/6 w-18 rotate-30 opacity-20 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-3/4 left-3/4 w-14 -rotate-60 opacity-15 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute bottom-3/4 right-3/4 w-16 rotate-20 opacity-25 pointer-events-none" />
      <img src="/Images/leaf.png" alt="" aria-hidden="true" className="absolute top-1/6 right-1/6 w-12 -rotate-90 opacity-20 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {quizData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentQuestionIndex
                  ? 'bg-green-700'
                  : index < currentQuestionIndex
                  ? 'bg-green-400'
                  : 'bg-green-200'
              }`}
            />
          ))}
        </div>

        {/* Question Number */}
        <p className="text-green-700 font-medium mb-2">
          Question {currentQuestionIndex + 1} of {quizData.length}
        </p>

        {/* Question */}
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-8">
          {currentQuestion.question}
        </h1>

        {/* Answers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 mb-8"
          >
            {currentQuestion.options.map((option) => (
              <AnswerButton
                key={option}
                option={option}
                isSelected={selectedAnswer === option}
                onClick={() => handleAnswerSelect(option)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer || isTransitioning}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-200 ${
              selectedAnswer
                ? 'bg-green-700 text-white hover:bg-green-800'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{isLastQuestion ? 'Finish' : 'Next'}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 