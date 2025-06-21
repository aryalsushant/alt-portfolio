"use client";
import { motion } from 'framer-motion';
import ContactForm from '@/components/ContactForm';
import SocialIcons from '@/components/SocialIcons';

export default function ContactPage() {
  return (
    <main className="container mx-auto py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Get In Touch
      </motion.h1>
      <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <ContactForm />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 flex flex-col items-center md:items-start"
        >
          <div className="w-full max-w-lg p-6 bg-light-background/80 dark:bg-dark-background/50 rounded-lg shadow-md border border-light-accent/10 dark:border-dark-accent/10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Contact Info</h2>
            <div className="space-y-3 mb-6">
              <p>📍 Hattiesburg, MS</p>
              <p>
                <a href="mailto:sushant.aryal@usm.edu" className="hover:text-accent">
                  📧 sushant.aryal@usm.edu
                </a>
              </p>
              <p>
                <a href="tel:6013291279" className="hover:text-accent">
                  📞 601-329-1279
                </a>
              </p>
            </div>
            <SocialIcons />
            <div className="mt-6">
              <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                Google Maps Placeholder
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 