"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaPython, FaReact, FaAws } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiFlask, SiMongodb, SiStreamlit, SiOpencv, SiClerk, SiExpress, SiTensorflow } from 'react-icons/si';
import { IconType } from 'react-icons';
import { Project } from '@/data/projects';

const iconMap: { [key: string]: IconType } = {
  FaPython,
  FaReact,
  FaAws,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiFlask,
  SiMongodb,
  SiStreamlit,
  SiOpencv,
  SiClerk,
  SiExpress,
  SiTensorflow,
};

const ProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => (
  <motion.div
    layoutId={`card-container-${project.title}`}
    onClick={onClick}
    className="rounded-lg shadow-lg overflow-hidden cursor-pointer bg-light-background dark:bg-dark-background/50 border border-light-accent/10 dark:border-dark-accent/10 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col"
  >
    <div className="relative h-48 w-full">
      <Image
        src={project.image}
        alt={project.title}
        layout="fill"
        objectFit="cover"
        className="bg-gray-200 dark:bg-gray-800"
      />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-primary mb-1">{project.title}</h3>
      {project.award && (
        <p className="text-sm font-semibold text-accent mb-2">🏆 {project.award}</p>
      )}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.techStack.map(tech => {
          const Icon = iconMap[tech.icon];
          return (
            <span
              key={tech.name}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-primary dark:text-accent border border-primary/20 dark:border-accent/20 text-xs font-medium"
            >
              {Icon && <Icon className="text-sm" />} {tech.name}
            </span>
          );
        })}
      </div>
    </div>
  </motion.div>
);

export default ProjectCard;
