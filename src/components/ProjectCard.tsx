import { motion } from 'framer-motion';
import Image from 'next/image';

const ProjectCard = ({ project, onClick }) => (
  <motion.div
    layoutId={`card-container-${project.title}`}
    onClick={onClick}
    className="rounded-lg shadow-lg overflow-hidden cursor-pointer bg-light-background dark:bg-dark-background/50 border border-light-accent/10 dark:border-dark-accent/10 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300"
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
    <div className="p-4">
      <h3 className="text-xl font-bold text-primary mb-1">{project.title}</h3>
      {project.award && (
        <p className="text-sm font-semibold text-accent mb-2">🏆 {project.award}</p>
      )}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.techStack.map(tech => (
          <span
            key={tech.name}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-primary dark:text-accent border border-primary/20 dark:border-accent/20 text-xs font-medium"
          >
            <span className="text-sm">{tech.icon}</span>
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ProjectCard; 