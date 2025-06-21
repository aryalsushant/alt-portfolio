import './globals.css';
import { Inter, Manrope } from '@next/font/google';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'Sushant Aryal | Portfolio',
  description: 'Portfolio of Sushant Aryal – AI/ML Enthusiast, Data-Driven Developer, Educator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-inter bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text min-h-screen transition-colors duration-300">
        <Navbar />
        {/* Navbar and ThemeToggle will go here */}
        {children}
      </body>
    </html>
  );
}
