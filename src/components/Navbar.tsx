import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Resume', href: '/resume' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-light-background/80 dark:bg-dark-background/80 backdrop-blur border-b border-light-accent/10 dark:border-dark-accent/10 transition-colors">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Link href="/">Sushant Aryal</Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-2 py-1 text-lg font-medium hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {/* ThemeToggle and SocialIcons placeholders */}
          <div className="ml-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">🌞/🌙</span>
            <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">GH</span>
            <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">LI</span>
            <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">PF</span>
          </div>
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden text-2xl p-2 rounded focus:outline-none focus:ring"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-light-background dark:bg-dark-background border-t border-light-accent/10 dark:border-dark-accent/10 px-4 pb-4">
          <div className="flex flex-col gap-4 mt-2">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium hover:text-accent transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* ThemeToggle and SocialIcons placeholders */}
            <div className="flex items-center gap-3 mt-2">
              <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">🌞/🌙</span>
              <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">GH</span>
              <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">LI</span>
              <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">PF</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 