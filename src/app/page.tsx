"use client";
import Image from "next/image";
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] container mx-auto py-16 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex flex-col items-start justify-center gap-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-2">
          Sushant Aryal
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
          AI/ML Enthusiast | Data-Driven Developer | Educator
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-xl">
          Computer Science & Mathematics junior at USM. Cornell Tech AI/ML Fellow. Teaching Python and building intelligent tools for real-world impact.
        </p>
        <div className="flex gap-4">
          <a
            href="#resume"
            className="rounded-full bg-primary text-white px-6 py-3 font-semibold text-lg shadow hover:bg-accent transition-colors"
          >
            📄 View Resume
          </a>
          <a
            href="#projects"
            className="rounded-full border-2 border-primary text-primary px-6 py-3 font-semibold text-lg shadow hover:bg-primary hover:text-white transition-colors"
          >
            💡 See My Projects
          </a>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center relative"
      >
        {/* Animated particles placeholder */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* TODO: Add animated particles here */}
        </div>
        <div className="relative z-10">
          <Image
            src="/profile.jpg"
            alt="Sushant Aryal profile"
            width={240}
            height={240}
            className="rounded-full shadow-2xl border-4 border-accent object-cover bg-gray-200 dark:bg-gray-800"
            priority
          />
        </div>
      </motion.div>
    </main>
  );
}
