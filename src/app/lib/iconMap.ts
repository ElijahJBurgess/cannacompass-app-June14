import {
  Moon,
  Zap,
  Brain,
  Pill,
  HeartHandshake,
  Leaf,
  Droplet,
  Flame,
  Sun,
  Sparkles,
  Users,
  Clock,
  Coffee,
  Bed,
  Wine,
  Activity,
  Shield,
  Star,
  Sparkle,
  Heart,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  // Experience effects
  'Relaxation and unwinding': Leaf,
  'Enhanced creativity or focus': Sparkles,
  'Better sleep quality': Moon,
  'Physical relief or recovery': Pill,
  'Social enjoyment with friends': Users,

  // Experience level
  'New explorer (little to no experience)': Star,
  'Occasional user (a few times a month)': Sparkle,
  'Regular enthusiast (weekly use)': Heart,
  'Experienced consumer (daily use)': Shield,
  'Returning after a long break': Activity,

  // Consumption method
  'Flower for smoking or vaping': Flame,
  'Edibles (gummies, chocolates, beverages)': Coffee,
  'Vape cartridges or disposables': Zap,
  'Tinctures or oils': Droplet,
  'Topicals (creams, balms)': HeartHandshake,

  // Time of day
  'Morning or daytime': Sun,
  'Evening to unwind': Wine,
  'Before bed': Bed,
  'During social activities': Users,
  'When needed for specific relief': Shield,

  // THC/CBD balance
  'THC-dominant (more euphoric effects)': Zap,
  'CBD-dominant (minimal intoxication)': Shield,
  'Balanced THC/CBD (moderate effects)': HeartHandshake,
  'Microdose (subtle, functional effects)': Sparkle,
  'Not sure yet (I\'d like guidance)': Brain,

  // Effects to minimize
  'Anxiety or racing thoughts': Brain,
  'Sedation or feeling too relaxed': Bed,
  'Cognitive effects (memory, focus)': Brain,
  'Dry mouth or increased appetite': Droplet,
  'Strong intoxication or euphoria': Zap,

  // Activities
  'Relaxing at home (TV, reading, etc.)': Leaf,
  'Creative pursuits (art, music, writing)': Sparkles,
  'Physical activities (yoga, hiking, exercise)': Activity,
  'Social gatherings or conversations': Users,
  'Sleep support or nighttime routine': Moon,
}; 