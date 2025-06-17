'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ClipboardList,
  Sparkles,
  HeartHandshake,
  Gauge,
  Pill,
  Frown,
  Moon,
  Flame,
  AlertTriangle,
  ZapOff,
  Brain,
  Utensils,
  Zap,
  ShoppingBag,
  BrainCircuit,
  Twitter,
  Instagram,
  Linkedin,
  Leaf,
  ChevronDown,
  Package,
  Star,
  UserCircle,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// IconCard component for consistent icon styling
const IconCard = ({ icon: Icon, label, color }: { icon: any; label: string; color: string }) => (
  <div
    className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:scale-[1.05] transition-transform ${color}`}
  >
    <div className="w-20 h-20 mb-4 bg-white/90 p-2 rounded-full shadow-sm flex items-center justify-center">
      <Icon 
        className="w-10 h-10 sm:w-12 sm:h-12 text-green-800 stroke-[2.5]" 
        title={label}
        aria-label={label}
      />
    </div>
    <div className="text-black text-xl font-bold font-['Inter'] leading-loose text-center">
      {label}
    </div>
  </div>
);

// Fake matches data
const fakeMatches = [
  { location: 'NYC', strain: 'Blue Dream', effect: 'Relaxation & Creativity', type: 'Hybrid' },
  { location: 'Austin', strain: 'Granddaddy Purple', effect: 'Sleep & Relief', type: 'Indica' },
  { location: 'Seattle', strain: 'Sour Diesel', effect: 'Focus & Energy', type: 'Sativa' },
  { location: 'LA', strain: 'Pineapple Express', effect: 'Mood Boost', type: 'Hybrid' },
  { location: 'Miami', strain: 'Harlequin', effect: 'Calm & Clarity', type: 'CBD' },
  { location: 'Chicago', strain: 'Gelato', effect: 'Body Relief', type: 'Indica' },
  { location: 'Denver', strain: 'White Widow', effect: 'Creativity & Focus', type: 'Sativa' },
  { location: 'Boston', strain: 'Northern Lights', effect: 'Deep Relaxation', type: 'Indica' },
  { location: 'San Francisco', strain: 'GSC', effect: 'Euphoria & Chill', type: 'Hybrid' },
  { location: 'Vegas', strain: 'Jack Herer', effect: 'Clarity & Uplift', type: 'Sativa' },
];

// Create duplicated array for seamless scrolling
const duplicatedMatches = [...fakeMatches, ...fakeMatches];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  // Intersection Observer to detect when carousel is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Start animation when in view
  useEffect(() => {
    if (isInView) {
      controls.start({
        x: [-324, -324 * fakeMatches.length],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: fakeMatches.length * 2.5,
            ease: "linear",
          },
        },
      });
    }
  }, [isInView, controls]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-0">
              <Image
                src="/Images/cannacompass-compass-logo.png"
                alt="CannaCompass Logo"
                width={64}
                height={56}
                className="w-16 h-14 object-contain block align-middle m-0 p-0"
                style={{marginRight: '-8px'}}
              />
              <Image
                src="/Images/cannacompass-text-logo.png"
                alt="CannaCompass"
                width={260}
                height={40}
                className="w-64 h-10 object-contain block align-middle m-0 p-0"
                style={{marginLeft: '-8px'}}
              />
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-neutral-800 text-base font-semibold font-['Poppins'] leading-loose">
                  Home
                </Link>
                <Link href="/about" className="text-neutral-800 text-base font-semibold font-['Poppins'] leading-loose">
                  About
                </Link>
                <div className="flex items-center gap-1.5">
                  <Link href="/resources" className="text-neutral-800 text-base font-semibold font-['Poppins'] leading-loose">
                    Resources
                  </Link>
                  <ChevronDown className="w-4 h-4 text-neutral-800" />
                </div>
              </div>

              {/* Get Started Button */}
              <Link 
                href="/quiz" 
                className="w-40 p-3 bg-green-900 rounded-[121px] shadow-button outline outline-1 outline-offset-[-1px] outline-green-950 flex justify-center items-center"
              >
                <span className="text-white text-base font-semibold font-['Poppins'] leading-loose">
                  Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-[97px]">
        {/* Hero Section */}
        <section className="relative h-[660px]">
          <Image
            src="/Images/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="relative max-w-[1440px] mx-auto px-8">
            <div className="w-[654px] pt-[108px]">
              <div className="flex flex-col gap-5">
                <h1 className="text-white text-7xl font-extrabold font-['Manrope'] leading-[90px]">
                  Find Your <br/>
                  Perfect Cannabis Match with AI
                </h1>
                <p className="w-[555px] text-zinc-100/75 text-lg font-medium font-['Manrope'] leading-7">
                  Answer a few quick questions, or use your voice—our AI will recommend the best cannabis strains & products for your needs.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link 
                  href="/quiz"
                  className="w-48 p-3.5 bg-green-900 rounded-full shadow-hero-button outline outline-[1.19px] outline-offset-[-1.19px] outline-white/30 inline-flex justify-center items-center gap-2.5"
                >
                  <span className="text-white text-lg font-semibold font-['Poppins'] leading-9">
                    Start Quiz
                  </span>
                </Link>

                <button
                  onClick={() => console.log('Voice capture start')}
                  aria-label="Use voice to start the quiz"
                  className="w-48 p-3.5 bg-white rounded-full shadow-hero-button outline outline-[1.19px] outline-offset-[-1.19px] outline-white/30 inline-flex justify-center items-center gap-2.5 hover:bg-gray-100 transition"
                >
                  <span className="text-green-900 text-lg font-semibold font-['Poppins'] leading-9">
                    Use My Voice
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-8">
          <div className="max-w-[987.50px] mx-auto">
            <div className="flex flex-col items-center gap-8">
              {/* Header */}
              <div className="w-[594px] flex flex-col items-center gap-3.5">
                <div className="w-28 flex flex-col items-center gap-1.5">
                  <div className="w-7 h-7 bg-lime-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-lime-700" aria-hidden="true" />
                  </div>
                  <div className="text-lime-700 text-base font-bold font-['Manrope'] capitalize leading-tight">
                    HOW IT WORKS
                  </div>
                </div>
                <h2 className="text-teal-950 text-5xl font-extrabold font-['Manrope'] capitalize leading-[68px] text-center">
                  3 Simple Steps to Your Perfect Cannabis Match
                </h2>
              </div>

              {/* Steps */}
              <div className="flex justify-start items-center gap-14">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center hover:scale-[1.05] transition-transform">
                    <ClipboardList className="w-10 h-10 text-lime-700 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <h3 className="w-60 text-teal-950 text-2xl font-extrabold font-['Manrope'] capitalize leading-[67.47px] text-center">
                    Tell Us What You Need
                  </h3>
                  <p className="w-60 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose text-center">
                    User selects desired effects (relaxation, focus, etc.)
                  </p>
                </div>

                {/* Divider */}
                <div className="w-16 h-0 rotate-90 border border-neutral-100" />

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center hover:scale-[1.05] transition-transform">
                    <Sparkles className="w-10 h-10 text-lime-700 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <h3 className="w-60 text-teal-950 text-2xl font-extrabold font-['Manrope'] capitalize leading-[67.47px] text-center">
                    AI Matches You Instantly
                  </h3>
                  <p className="w-60 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose text-center">
                    Our system finds matches from hundreds of products
                  </p>
                </div>

                {/* Divider */}
                <div className="w-16 h-0 rotate-90 border border-neutral-100" />

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center hover:scale-[1.05] transition-transform">
                    <HeartHandshake className="w-10 h-10 text-lime-700 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <h3 className="w-72 text-teal-950 text-2xl font-extrabold font-['Manrope'] capitalize leading-9 text-center">
                    Get Personalized Recommendations
                  </h3>
                  <p className="w-60 text-neutral-400 text-lg font-normal font-['Inter'] leading-loose text-center">
                    Users see curated product matches
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instantly Connect With Your Needs Section */}
        <section className="py-16 px-8">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-2">
              <div>
                <div className="text-lime-700 text-base font-bold font-['Manrope'] capitalize leading-tight mb-2">
                  HOW IT WORKS
                </div>
                <h2 className="text-teal-950 text-5xl font-extrabold font-['Manrope'] capitalize leading-[68px]">
                  Instantly Connect With Your Needs
                </h2>
              </div>
              <div className="max-w-[493px] text-neutral-600 text-lg font-normal font-['Inter'] leading-loose">
                Tell us how you feel — whether it's stress, insomnia, or pain — and we'll instantly match you with plant-based products that support your specific wellness goals.
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {[
                { label: 'Anxiety', icon: Gauge, color: 'bg-orange-50/70' },
                { label: 'Chronic Pain', icon: Pill, color: 'bg-green-50/70' },
                { label: 'Depression', icon: Frown, color: 'bg-indigo-50/70' },
                { label: 'Insomnia', icon: Moon, color: 'bg-fuchsia-50/70' },
                { label: 'Inflammation', icon: Flame, color: 'bg-orange-50/70' },
                { label: 'Nausea', icon: AlertTriangle, color: 'bg-green-50/70' },
                { label: 'Migraines', icon: ZapOff, color: 'bg-fuchsia-50/70' },
                { label: 'PTSD', icon: Brain, color: 'bg-orange-50/70' },
                { label: 'Appetite Loss', icon: Utensils, color: 'bg-fuchsia-50/70' },
                { label: 'Epilepsy', icon: Zap, color: 'bg-indigo-50/70' },
              ].map((item) => (
                <IconCard
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 px-8 bg-green-50">
          <div className="max-w-[1191px] mx-auto flex flex-col items-center gap-8">
            {/* Section Header */}
            <div className="w-[594px] flex flex-col items-center gap-3.5">
              <div className="w-28 flex flex-col items-center gap-1.5">
                <div className="w-7 h-7 bg-lime-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-lime-700" aria-hidden="true" />
                </div>
                <div className="text-lime-700 text-base font-bold font-['Manrope'] capitalize leading-[68px] text-center">
                  PRODUCTS
                </div>
              </div>
              <h2 className="text-teal-950 text-5xl font-extrabold font-['Manrope'] capitalize leading-[68px] text-center">
                Featured Products
              </h2>
            </div>

            {/* Product Cards Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-72 h-96 relative rounded-xl overflow-hidden shadow-lg bg-white flex flex-col justify-end">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
                    <Package className="w-24 h-24 text-green-800 opacity-20" />
                  </div>
                  <div className="relative z-10 bg-gradient-to-b from-black/0 via-black/0 to-black/70 p-6 rounded-b-xl flex flex-col gap-2">
                    <div className="text-white text-2xl font-extrabold font-['Manrope'] leading-loose">
                      Tablets Pack
                    </div>
                    <div className="text-white text-lg font-semibold font-['Inter'] leading-loose">
                      Sativa
                    </div>
                  </div>
                  <button className="absolute bottom-6 right-6 w-11 h-11 bg-lime-700 rounded-3xl flex items-center justify-center shadow-md">
                    <Package className="w-6 h-6 text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Explore All Button */}
            <div className="flex justify-center mt-8">
              <button className="w-48 p-3.5 bg-green-900 rounded-full shadow-hero-button outline outline-[1.19px] outline-offset-[-1.19px] outline-white/30 flex justify-center items-center gap-2.5 text-white text-lg font-semibold font-['Poppins'] leading-9">
                Explore All
              </button>
            </div>
          </div>
        </section>

        {/* Matched Products Section */}
        <section className="py-24 px-8 bg-green-50">
          <div className="max-w-[1191px] mx-auto flex flex-col items-center gap-8">
            {/* Section Header */}
            <div className="w-[594px] flex flex-col items-center gap-1">
              <div className="w-7 h-7 bg-lime-100 rounded-full flex items-center justify-center mb-2">
                <BrainCircuit className="w-4 h-4 text-lime-700" aria-hidden="true" />
              </div>
              <div className="text-lime-700 text-base font-bold font-['Manrope'] capitalize leading-[68px] text-center">
                AI MATCH
              </div>
              <h2 className="text-teal-950 text-5xl font-extrabold font-['Manrope'] capitalize leading-[68px] text-center">
                Matched Products
              </h2>
              <div className="flex items-center gap-1 text-lime-700 text-sm font-medium animate-pulse">
                <span>Matching results</span>
                <span className="flex gap-1">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              </div>
            </div>

            {/* Matched Product Cards Carousel */}
            <div ref={ref} className="w-full overflow-hidden">
              <motion.div 
                className="flex gap-6"
                animate={controls}
                aria-live="polite"
              >
                {duplicatedMatches.map((match, index) => (
                  <motion.div 
                    key={`${match.location}-${match.strain}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex-none w-[300px] bg-white rounded-2xl shadow-md flex flex-col items-center p-8 gap-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                      <UserCircle className="w-12 h-12 text-green-800" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-zinc-900 text-2xl font-semibold font-['Poppins'] tracking-tight text-center">
                        {match.effect}
                      </div>
                      <div className="text-zinc-900 text-base font-normal font-['Poppins'] leading-relaxed tracking-tight text-center opacity-50">
                        User in {match.location} just got matched with {match.strain} ({match.type})
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-24 px-8 bg-green-900 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('/Images/cc-hero-heading-1.png')] bg-cover bg-center pointer-events-none" />
          <div className="relative max-w-[586px] mx-auto flex flex-col items-center gap-7 z-10">
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Manrope'] capitalize leading-tight text-center">
              Ready to Find Your Perfect Cannabis Match?
            </h2>
            <div className="flex justify-center items-center">
              <Link 
                href="/quiz"
                className="w-48 p-3.5 bg-white rounded-full shadow-hero-button outline outline-[1.19px] outline-offset-[-1.19px] outline-white/30 flex justify-center items-center gap-2.5 text-green-900 text-lg font-semibold font-['Poppins'] leading-9"
              >
                Start Quiz
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-green-50/60 rounded-t-2xl shadow-[0px_0px_21.1px_0px_rgba(151,148,148,0.12)] px-8 py-20 mt-0">
        <div className="max-w-[1387px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Logo and Description */}
          <div className="w-80 flex flex-col gap-3">
            <div className="flex items-center gap-0 mb-2">
              <Image
                src="/Images/cannacompass-compass-logo.png"
                alt="CannaCompass Logo"
                width={44}
                height={44}
                className="w-11 h-11 object-contain block align-middle m-0 p-0"
                style={{marginRight: '-8px'}}
              />
              <Image
                src="/Images/cannacompass-text-logo.png"
                alt="CannaCompass"
                width={260}
                height={40}
                className="w-64 h-10 object-contain block align-middle m-0 p-0"
                style={{marginLeft: '-8px'}}
              />
            </div>
            <div className="w-72 text-neutral-700 text-lg font-normal font-['Inter'] leading-relaxed">
              CannaCompass let you find Your Perfect Cannabis Match with AI
            </div>
          </div>
          {/* Quick Links */}
          <div className="w-80 flex flex-col gap-3">
            <div className="text-stone-950 text-lg font-bold font-['Inter'] leading-snug">
              Quick Links
            </div>
            <div className="flex flex-col gap-6">
              <div className="text-neutral-700 text-lg font-normal font-['Inter'] leading-relaxed">
                About | Blog | Terms & Privacy
              </div>
              <div className="flex items-center gap-4">
                <Twitter className="w-6 h-6 text-green-800" aria-label="Follow us on Twitter" />
                <Instagram className="w-6 h-6 text-green-800" aria-label="Follow us on Instagram" />
                <Linkedin className="w-6 h-6 text-green-800" aria-label="Follow us on LinkedIn" />
              </div>
            </div>
          </div>
          {/* List Your Products */}
          <div className="w-80 flex flex-col gap-3">
            <div className="text-stone-950 text-lg font-bold font-['Inter'] leading-snug">
              List your products
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="text-neutral-700 text-lg font-normal font-['Inter'] leading-relaxed">
                Want to feature your products on our platform? <span className="text-green-900 font-bold">Get in touch!</span>
              </div>
              <button className="w-32 h-10 p-2 bg-green-900 rounded-full shadow-md outline outline-[0.63px] outline-offset-[-0.63px] outline-green-950 flex justify-center items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-semibold font-['Poppins'] leading-tight">List your products</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
