import React from 'react';
import { FaReact, FaPython, FaNodeJs, FaGithub, FaCss3Alt } from 'react-icons/fa';
import { SiTailwindcss, SiJavascript } from 'react-icons/si';

const tech = [
  { icon: <FaReact className="text-cyan-400 group-hover:scale-125 transition" />, name: 'React' },
  { icon: <SiTailwindcss className="text-blue-400 group-hover:scale-125 transition" />, name: 'Tailwind' },
  { icon: <FaPython className="text-yellow-300 group-hover:scale-125 transition" />, name: 'Python' },
  { icon: <FaNodeJs className="text-green-400 group-hover:scale-125 transition" />, name: 'Node.js' },
  { icon: <SiJavascript className="text-yellow-400 group-hover:scale-125 transition" />, name: 'JavaScript' },
  { icon: <FaCss3Alt className="text-blue-300 group-hover:scale-125 transition" />, name: 'CSS3' },
  { icon: <FaGithub className="text-white group-hover:scale-125 transition" />, name: 'GitHub' },
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
        <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-neon">About Me</h2>
        <p className="text-cyan-100 mb-6">
          Hi! I'm Sushant, a passionate developer blending Computer Science and Math to build futuristic, impactful solutions. I love exploring new tech, creating beautiful UIs, and solving real-world problems.
        </p>
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {tech.map(({ icon, name }) => (
            <div key={name} className="group flex flex-col items-center cursor-pointer">
              <div className="text-4xl mb-1 transition-transform duration-200">
                {icon}
              </div>
              <span className="text-xs text-cyan-200 opacity-80">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About; 