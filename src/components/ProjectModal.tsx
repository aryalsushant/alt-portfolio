import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          layoutId={`card-container-${project.title}`}
          onClick={e => e.stopPropagation()}
          className="bg-light-background dark:bg-dark-background/95 backdrop-blur-sm rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
        >
          <div className="relative h-64 w-full">
            <Image
              src={project.image}
              alt={project.title}
              layout="fill"
              objectFit="cover"
              className="bg-gray-200 dark:bg-gray-800"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto">
            <h2 className="text-3xl font-bold text-primary mb-2">{project.title}</h2>
            {project.award && (
              <p className="text-md font-semibold text-accent mb-4">🏆 {project.award}</p>
            )}
            <p className="text-gray-700 dark:text-gray-300 mb-6">{project.details}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map(tech => (
                <span key={tech.name} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-primary dark:text-accent border border-primary/20 dark:border-accent/20 text-sm font-medium">
                  <span className="text-md">{tech.icon}</span>
                  {tech.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {project.links.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-accent transition-colors">
                  <FaGithub />
                  GitHub
                </a>
              )}
              {project.links.devpost && (
                <a href={project.links.devpost} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                  <FaExternalLinkAlt />
                  Devpost
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal; 