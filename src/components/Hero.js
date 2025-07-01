import React from 'react';
import { motion, useAnimation } from 'framer-motion';
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

const floatingCircles = [
  // Top row
  { color: '#00fff7', size: 32, initial: { x: 60, y: 60 }, animate: { x: [60, 200, 60], y: [60, 100, 60] }, duration: 8 },
  { color: '#ff00c8', size: 24, initial: { x: 300, y: 40 }, animate: { x: [300, 500, 300], y: [40, 120, 40] }, duration: 10 },
  { color: '#38bdf8', size: 40, initial: { x: 600, y: 80 }, animate: { x: [600, 700, 600], y: [80, 60, 80] }, duration: 12 },
  // Upper middle
  { color: '#00fff7', size: 20, initial: { x: 180, y: 180 }, animate: { x: [180, 320, 180], y: [180, 220, 180] }, duration: 9 },
  { color: '#ff00c8', size: 28, initial: { x: 420, y: 160 }, animate: { x: [420, 600, 420], y: [160, 200, 160] }, duration: 11 },
  { color: '#38bdf8', size: 22, initial: { x: 700, y: 200 }, animate: { x: [700, 600, 700], y: [200, 180, 200] }, duration: 10 },
  // Center
  { color: '#00fff7', size: 26, initial: { x: 100, y: 320 }, animate: { x: [100, 300, 100], y: [320, 400, 320] }, duration: 13 },
  { color: '#ff00c8', size: 18, initial: { x: 400, y: 300 }, animate: { x: [400, 600, 400], y: [300, 320, 300] }, duration: 12 },
  { color: '#38bdf8', size: 30, initial: { x: 700, y: 320 }, animate: { x: [700, 500, 700], y: [320, 400, 320] }, duration: 14 },
  // Lower middle
  { color: '#00fff7', size: 24, initial: { x: 200, y: 480 }, animate: { x: [200, 400, 200], y: [480, 520, 480] }, duration: 13 },
  { color: '#ff00c8', size: 20, initial: { x: 500, y: 500 }, animate: { x: [500, 700, 500], y: [500, 520, 500] }, duration: 12 },
  { color: '#38bdf8', size: 28, initial: { x: 700, y: 480 }, animate: { x: [700, 600, 700], y: [480, 500, 480] }, duration: 14 },
  // Bottom row
  { color: '#00fff7', size: 22, initial: { x: 60, y: 600 }, animate: { x: [60, 200, 60], y: [600, 700, 600] }, duration: 10 },
  { color: '#ff00c8', size: 30, initial: { x: 300, y: 680 }, animate: { x: [300, 500, 300], y: [680, 600, 680] }, duration: 11 },
  { color: '#38bdf8', size: 24, initial: { x: 600, y: 700 }, animate: { x: [600, 700, 600], y: [700, 680, 700] }, duration: 12 },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center pt-24 pb-12 bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-[#0f2027] dark:via-[#2c5364] dark:to-[#232526] overflow-hidden">
      {/* Animated floating circles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {floatingCircles.map((circle, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: circle.size,
              height: circle.size,
              borderRadius: '50%',
              background: circle.color,
              opacity: 0.18,
              zIndex: 0,
            }}
            initial={circle.initial}
            animate={circle.animate}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
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
            href="https://github.com/aryalsushant"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-gray-700 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-white transition-transform transform hover:scale-125"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/sushant-aryal"
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
            href="/Sushant_Aryal_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
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