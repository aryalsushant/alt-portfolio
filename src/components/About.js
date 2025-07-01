import React from 'react';
import { FaReact, FaPython, FaNodeJs, FaGithub, FaCss3Alt } from 'react-icons/fa';
import { SiTailwindcss, SiJavascript, SiTypescript, SiCplusplus, SiMysql, SiJupyter, SiSqlite } from 'react-icons/si';

const tech = [
  { icon: <FaReact className="text-cyan-400 group-hover:scale-125 transition" />, name: 'React', link: 'https://react.dev/' },
  { icon: <FaNodeJs className="text-green-400 group-hover:scale-125 transition" />, name: 'Node.js', link: 'https://nodejs.org/' },
  { icon: <FaPython className="text-yellow-300 group-hover:scale-125 transition" />, name: 'Python', link: 'https://python.org/' },
  { icon: <SiJavascript className="text-yellow-400 group-hover:scale-125 transition" />, name: 'JavaScript', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { icon: <SiTypescript className="text-blue-400 group-hover:scale-125 transition" />, name: 'TypeScript', link: 'https://www.typescriptlang.org/' },
  { icon: <SiCplusplus className="text-blue-500 group-hover:scale-125 transition" />, name: 'C++', link: 'https://isocpp.org/' },
  { icon: <FaGithub className="text-gray-800 dark:text-white group-hover:scale-125 transition" />, name: 'GitHub', link: 'https://github.com/aryalsushant' },
  { icon: <SiTailwindcss className="text-blue-400 group-hover:scale-125 transition" />, name: 'Tailwind', link: 'https://tailwindcss.com/' },
  { icon: <SiMysql className="text-teal-500 group-hover:scale-125 transition" />, name: 'MySQL', link: 'https://www.mysql.com/' },
  { icon: <SiJupyter className="text-orange-400 group-hover:scale-125 transition" />, name: 'Jupyter', link: 'https://jupyter.org/' },
  { icon: <SiSqlite className="text-blue-400 group-hover:scale-125 transition" />, name: 'SQL', link: 'https://www.sqlite.org/' },
];

const About = () => {
  return (
    <section className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 py-24 px-6 bg-white dark:bg-[#232526] rounded-2xl shadow-neon mt-16" id="about">
      <div className="flex-1 flex justify-center">
        <div className="relative group">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Sushant Aryal"
            className="w-48 h-48 object-cover rounded-full border-4 border-cyan-400 shadow-neon group-hover:shadow-glow transition duration-300"
          />
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-pulse opacity-30"></div>
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-3xl font-bold mb-4 drop-shadow-neon text-gray-900 dark:text-white">About Me</h2>
        <p className="mb-6 text-gray-700 dark:text-cyan-100 font-medium text-lg">
          I am a Computer Science junior with hands-on experience in Full-Stack Development and Machine Learning. I love finding ways to combine tech and creativity to solve problems.
        </p>
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {tech.map(({ icon, name, link }) => (
            <a key={name} href={link} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center cursor-pointer">
              <div className="text-4xl mb-1 transition-transform duration-200 border border-cyan-300 rounded-full p-2" style={{borderWidth: '1.5px'}}>
                {icon}
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-cyan-200 opacity-90 drop-shadow-sm">{name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About; 