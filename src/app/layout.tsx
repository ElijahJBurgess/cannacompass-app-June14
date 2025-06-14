import { Manrope, Inter, Poppins } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'CannaCompass - Find Your Perfect Cannabis Match',
  description: 'Find your perfect cannabis match with AI-powered recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${inter.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
