import { FaGraduationCap, FaBriefcase, FaCode } from 'react-icons/fa';

/**
 * Shared config for the three climb paths.
 * Used by BaseCamp (path selection buttons) and ClimbView (card accent colors, icons).
 */
export const PATH_CONFIGS = {
  education: {
    id: 'education',
    label: 'Education',
    Icon: FaGraduationCap,
    accentColor: '#60a5fa',
    accentRgb: '96,165,250',
    borderColor: 'rgba(96,165,250,0.45)',
    bgColor: 'rgba(96,165,250,0.1)',
    bgHover: 'rgba(96,165,250,0.18)',
  },
  work: {
    id: 'work',
    label: 'Work',
    Icon: FaBriefcase,
    accentColor: '#fbbf24',
    accentRgb: '251,191,36',
    borderColor: 'rgba(251,191,36,0.45)',
    bgColor: 'rgba(251,191,36,0.1)',
    bgHover: 'rgba(251,191,36,0.18)',
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    Icon: FaCode,
    accentColor: '#34d399',
    accentRgb: '52,211,153',
    borderColor: 'rgba(52,211,153,0.45)',
    bgColor: 'rgba(52,211,153,0.1)',
    bgHover: 'rgba(52,211,153,0.18)',
  },
};
