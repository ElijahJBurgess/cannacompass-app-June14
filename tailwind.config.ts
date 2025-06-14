import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-900': '#004108',
        'teal-950': '#003C38',
        'lime-700': '#276B32',
        'neutral-800': '#222222',
        'neutral-700': '#1A1A1A',
        'neutral-400': '#819291',
        'zinc-100': '#F6F6F6',
        'zinc-900': '#1A1A1A',
        'stone-950': '#000000',
      },
      fontFamily: {
        manrope: ['var(--font-manrope)'],
        inter: ['var(--font-inter)'],
        poppins: ['var(--font-poppins)'],
      },
      boxShadow: {
        'button': '2px 4px 4px 0px rgba(178,178,178,0.49)',
        'hero-button': '2.37px 0px 12.68px 0px rgba(57,57,57,0.49)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(15px, -15px) rotate(5deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        drift: 'drift 12s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config; 