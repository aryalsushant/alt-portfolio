import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const projects = [
  {
    name: 'Druglytics',
    image: 'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'GenAI powered app that analyzes drug interactions and generates animated informational video',
    tech: ['Python', 'AWS', 'MongoDB'],
    github: 'https://github.com/aryalsushant/hacklytics2025',
    live: 'https://devpost.com/software/druglytics',
  },
  {
    name: 'Swiped-In',
    image: 'https://plus.unsplash.com/premium_photo-1718742574584-1f798bca4b38?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Dating APP style hiring platform allowing job seekers to swipe through jobs and recruiters to swipe through candidates',
    tech: ['Next.js', 'Node.js', 'MongoDB'],
    github: 'https://github.com/rupaut98/swipedin',
    live: 'https://devpost.com/software/swiped-in',
  },
  {
    name: 'Brot AI',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Full-stack conversational AI platform featuring logins, saved chats, image analysis etc.',
    tech: ['React', 'Express', 'MongoDB'],
    github: 'https://github.com/aryalsushant/aichat',
    live: 'https://brot-ai.vercel.app',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.7, type: 'spring' } }),
};

const Projects = () => {
  return (
    <section className="max-w-6xl mx-auto py-24 px-6" id="projects">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 drop-shadow-neon text-center">Projects</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.name}
            className="bg-white dark:bg-[#232526] rounded-2xl shadow-neon border border-gray-200 dark:border-cyan-400/30 overflow-hidden group hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-pointer relative"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
          >
            <img src={proj.image} alt={proj.name} className="w-full h-40 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-2">{proj.name}</h3>
              <p className="text-gray-700 dark:text-cyan-100 mb-4 min-h-[48px]">{proj.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {proj.tech.map(t => (
                  <span key={t} className="px-2 py-1 text-xs bg-cyan-100/60 dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-200 rounded-full border border-cyan-200 dark:border-cyan-400/40">{t}</span>
                ))}
              </div>
              <div className="flex gap-4">
                <a href={proj.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-500 dark:text-cyan-400 hover:text-gray-900 dark:hover:text-white transition">
                  <FaGithub size={22} />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a href={proj.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-500 dark:text-cyan-400 hover:text-gray-900 dark:hover:text-white transition">
                  <FaExternalLinkAlt size={20} />
                  <span className="text-sm font-medium">Live Demo</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects; 