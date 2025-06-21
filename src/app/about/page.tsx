"use client";
import { motion } from 'framer-motion';
import { FaPython, FaJs, FaReact, FaNodeJs, FaAws, FaGitAlt, FaLinux, FaDatabase, FaGithub } from 'react-icons/fa';
import { SiTypescript, SiCplusplus, SiFlask, SiExpress, SiTensorflow, SiNumpy, SiMongodb, SiSnowflake, SiHtml5, SiCss3, SiClerk } from 'react-icons/si';
import { IconType } from 'react-icons';

const iconMap: { [key: string]: IconType } = {
  FaPython,
  FaJs,
  FaReact,
  FaNodeJs,
  FaAws,
  FaGitAlt,
  FaLinux,
  FaDatabase,
  FaGithub,
  SiTypescript,
  SiCplusplus,
  SiFlask,
  SiExpress,
  SiTensorflow,
  SiNumpy,
  SiMongodb,
  SiSnowflake,
  SiHtml5,
  SiCss3,
  SiClerk,
};

const skills = [
  { name: 'Python', icon: 'FaPython' },
  { name: 'JavaScript', icon: 'FaJs' },
  { name: 'C++', icon: 'SiCplusplus' },
  { name: 'SQL', icon: 'FaDatabase' },
  { name: 'TypeScript', icon: 'SiTypescript' },
  { name: 'React', icon: 'FaReact' },
  { name: 'React Native', icon: 'FaReact' },
  { name: 'Next.js', icon: 'FaReact' },
  { name: 'Node.js', icon: 'FaNodeJs' },
  { name: 'Express', icon: 'SiExpress' },
  { name: 'Flask', icon: 'SiFlask' },
  { name: 'TensorFlow', icon: 'SiTensorflow' },
  { name: 'NumPy', icon: 'SiNumpy' },
  { name: 'AWS', icon: 'FaAws' },
  { name: 'Clerk', icon: 'SiClerk' },
  { name: 'Snowflake', icon: 'SiSnowflake' },
  { name: 'MongoDB Atlas', icon: 'SiMongodb' },
  { name: 'Git', icon: 'FaGitAlt' },
  { name: 'GitHub', icon: 'FaGithub' },
  { name: 'Linux', icon: 'FaLinux' },
  { name: 'MySQL', icon: 'FaDatabase' },
  { name: 'HTML', icon: 'SiHtml5' },
  { name: 'CSS', icon: 'SiCss3' },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto py-16 max-w-4xl">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">About Sushant Aryal</h1>
        <ul className="text-lg text-gray-700 dark:text-gray-300 space-y-2 mb-6">
          <li>📍 Based in Hattiesburg, Mississippi</li>
          <li>🌏 Originally from Nepal</li>
          <li>🎓 Junior at the University of Southern Mississippi</li>
          <li>🤖 Accepted into Cornell Tech&rsquo;s AI/ML Fellowship (2025)</li>
          <li>👨‍🏫 Interning at Delta Health Alliance, teaching 25+ students Python and Data Science</li>
          <li>💻 Past: Junior Web Developer at FinancialNotices (Kathmandu)</li>
        </ul>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-2">Education</h2>
        <div className="bg-[#F5F7FA] dark:bg-[#0D1117] rounded-lg shadow p-4 border-l-4 border-primary mb-2">
          <div className="font-bold">University of Southern Mississippi</div>
          <div className="text-sm text-gray-500 mb-1">Aug 2023 – May 2027</div>
          <div>Bachelor&rsquo;s in Computer Science & Mathematics</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Relevant coursework: Machine Learning, Linear Programming, Probability, Data Analysis, Statistics</div>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-2">Technical Skills</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {skills.map(skill => {
            const Icon = iconMap[skill.icon];
            return (
              <span
                key={skill.name}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-primary dark:text-accent border border-primary/20 dark:border-accent/20 text-sm font-medium shadow-sm"
              >
                {Icon && <Icon className="text-lg" />} {skill.name}
              </span>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
} 