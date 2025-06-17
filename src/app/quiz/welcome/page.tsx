"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const introSteps = [
  "Answer quick wellness questions",
  "Get your AI-powered cannabis match",
  "Learn & check out safely",
];

export default function QuizWelcomePage() {
  const [step, setStep] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isOver21, setIsOver21] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animate intro steps with smoother transitions
  useEffect(() => {
    if (showForm) return;
    timerRef.current = setTimeout(() => {
      if (step < introSteps.length - 1) {
        setStep((s) => s + 1);
      } else {
        setShowForm(true);
      }
    }, 1700); // 1.7s per step for momentum and readability
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, showForm]);

  // Email validation
  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Age validation
  const validateAge = (val: boolean | null) => val === true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setEmailError("");
    setAgeError("");
    if (isOver21 === false) {
      // Prevent submission if "No" is selected
      setAgeError("You must be 21 or older to continue.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!validateAge(isOver21)) {
      setAgeError("You must be 21 or older to continue.");
      valid = false;
    }
    if (!acceptedTerms) {
      setAgeError("Please accept the terms and conditions to continue.");
      valid = false;
    }
    if (!valid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("cannacompass_quiz_email", email);
      localStorage.setItem("cannacompass_quiz_age", "21+");
      router.push("/quiz/questions");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E7F6ED] px-4 py-10 relative overflow-hidden">
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

      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Animated Intro */}
        <AnimatePresence mode="wait">
          {!showForm && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center min-h-[180px] relative"
              aria-live="polite"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-green-900 font-bold text-center leading-snug relative z-10">
                {introSteps[step]}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Section */}
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-6 items-center relative z-10 bg-white/60 backdrop-blur-md shadow-inner rounded-xl px-4 py-3 sm:p-6 w-full max-w-md"
              aria-label="Quiz Welcome Form"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-green-900 font-bold text-center mb-2">
                Start Your Wellness Journey
              </h1>
              <div className="w-full flex flex-col gap-4">
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Are you 21 or older?
                </h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    role="button"
                    aria-pressed={isOver21 === true}
                    tabIndex={0}
                    onClick={() => setIsOver21(true)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setIsOver21(true); } }}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70 border-gray-300 text-black placeholder-gray-500 ${
                      isOver21 === true
                        ? 'ring-2 ring-green-900 border-green-900 font-semibold bg-green-50'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    role="button"
                    aria-pressed={isOver21 === false}
                    tabIndex={0}
                    onClick={() => setIsOver21(false)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setIsOver21(false); } }}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/70 border-gray-300 text-black placeholder-gray-500 ${
                      isOver21 === false
                        ? 'ring-2 ring-red-500 border-red-500 font-semibold bg-red-50'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    No
                  </button>
                </div>
                {/* Show message if "No" is selected */}
                {isOver21 === false && (
                  <p className="text-sm text-red-500 mt-2">
                    You must be 21 or older to receive a wellness plan.
                  </p>
                )}
                {ageError && (
                  <span id="age-error" className="text-red-600 text-sm mt-1">{ageError}</span>
                )}
              </div>
              <div className="w-full flex flex-col gap-4">
                <label htmlFor="email" className="text-green-800 font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-white/70 border border-gray-300 text-black placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby="email-error"
                  autoComplete="email"
                />
                {emailError && (
                  <span id="email-error" className="text-red-600 text-sm mt-1">{emailError}</span>
                )}
                <p className="text-sm text-gray-600 text-center mt-2">
                  We'll send your wellness plan to your inbox
                </p>
              </div>
              {/* Terms and Conditions Checkbox */}
              <div className="w-full flex items-start gap-3 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 bg-white/70 focus:ring-green-500 transition-colors duration-200"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline transition-colors duration-200"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
              <button
                type="submit"
                className={`w-full mt-4 font-semibold rounded-xl px-6 py-3 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400
                  ${isOver21 === false ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-green-900 text-white hover:bg-green-800'}
                  disabled:opacity-60 disabled:cursor-not-allowed`}
                disabled={loading || !acceptedTerms || isOver21 === false}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Get My Free Wellness Plan"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 