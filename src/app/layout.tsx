import './globals.css';
import { Inter, Manrope } from '@next/font/google';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'Sushant Aryal | Portfolio',
  description: 'Portfolio of Sushant Aryal – AI/ML Enthusiast, Data-Driven Developer, Educator.',
  keywords: ['Sushant Aryal', 'AI', 'ML', 'Developer', 'Portfolio', 'Next.js', 'React'],
  authors: [{ name: 'Sushant Aryal', url: 'https://www.yourdomain.com' }],
  openGraph: {
    title: 'Sushant Aryal | Portfolio',
    description: 'AI/ML Enthusiast, Data-Driven Developer, Educator.',
    url: 'https://www.yourdomain.com',
    siteName: 'Sushant Aryal Portfolio',
    images: [
      {
        url: 'https://www.yourdomain.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sushant Aryal | Portfolio',
    description: 'AI/ML Enthusiast, Data-Driven Developer, Educator.',
    creator: '@yourtwitterhandle',
    images: ['https://www.yourdomain.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="font-inter bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text min-h-screen transition-colors duration-300 flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
