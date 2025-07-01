import React from 'react';
import { motion } from 'framer-motion';

const glitchVariants = {
  animate: {
    textShadow: [
      '2px 0 #00fff7, -2px 0 #ff00c8',
      '2px 2px #00fff7, -2px -2px #ff00c8',
      '0 0 #00fff7, 0 0 #ff00c8',
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 1.2,
    },
  },
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center pt-24 pb-12 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
          <circle cx="20" cy="30" r="1.5" fill="#00fff7" />
          <circle cx="80" cy="60" r="1.2" fill="#ff00c8" />
          <circle cx="50" cy="80" r="1.8" fill="#38bdf8" />
          <circle cx="70" cy="20" r="1.1" fill="#00fff7" />
          <circle cx="30" cy="70" r="1.3" fill="#ff00c8" />
        </svg>
      </div>
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-neon mb-4 select-none">
          Sushant Aryal
        </h1>
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-cyan-400 mb-8 select-none"
          variants={glitchVariants}
          animate="animate"
        >
          Future-Facing Developer
        </motion.h2>
        <a
          href="/resume.pdf"
          download
          className="inline-block px-8 py-3 rounded-lg border-2 border-cyan-400 text-cyan-400 font-semibold text-lg bg-white/10 backdrop-blur-md shadow-neon hover:bg-cyan-400 hover:text-white hover:shadow-glow transition-all duration-300"
        >
          Download Resume
        </a>
      </div>
    </section>
  );
};

export default Hero; 