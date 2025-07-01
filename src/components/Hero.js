import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center pt-24 pb-12 bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-[#0f2027] dark:via-[#2c5364] dark:to-[#232526] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
          <circle cx="20" cy="30" r="1.5" fill="#00fff7" />
          <circle cx="80" cy="60" r="1.2" fill="#ff00c8" />
          <circle cx="50" cy="80" r="1.8" fill="#38bdf8" />
          <circle cx="70" cy="20" r="1.1" fill="#00fff7" />
          <circle cx="30" cy="70" r="1.3" fill="#ff00c8" />
        </svg>
        {/* Soft animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-fuchsia-400/10 to-transparent animate-gradient-move" />
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white drop-shadow-neon mb-2 select-none"
          variants={itemVariants}
        >
          Sushant Aryal
        </motion.h1>
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-cyan-500 dark:text-cyan-400 mb-4 select-none min-h-[2.5rem]"
          variants={itemVariants}
        >
          <Typewriter
            words={[
              'Future-Facing Engineer',
              'BTT AI/ML Fellow @ Cornell',
              'React & Tailwind Specialist',
              'Solving Real-World Problems',
              'Getting 1% Better Every Day',
            ]}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1200}
          />
        </motion.h2>
        <motion.div className="flex justify-center gap-6 mb-6" variants={itemVariants}>
          <a
            href="https://github.com/sushantaryal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-gray-700 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-white transition-transform transform hover:scale-125"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/sushantaryal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-gray-700 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-white transition-transform transform hover:scale-125"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </motion.div>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
          <a
            href="/resume.pdf"
            download
            className="inline-block px-8 py-3 rounded-lg border-2 border-cyan-400 text-cyan-500 dark:text-cyan-400 font-semibold text-lg bg-white dark:bg-white/10 backdrop-blur-md shadow-neon hover:bg-cyan-400 hover:text-white hover:shadow-glow transition-all duration-300"
          >
            Download Resume
          </a>
          <a
            href="#contact"
            className="inline-block px-8 py-3 rounded-lg border-2 border-fuchsia-400 text-fuchsia-500 dark:text-fuchsia-300 font-semibold text-lg bg-white dark:bg-white/10 backdrop-blur-md shadow-neon hover:bg-fuchsia-400 hover:text-white hover:shadow-glow transition-all duration-300"
          >
            Contact Me
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero; 