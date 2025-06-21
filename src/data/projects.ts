export type Project = {
  title: string;
  description: string;
  image: string;
  techStack: { name: string, icon: string }[];
  links: {
    github: string;
    devpost?: string;
  };
  details: string;
  award?: string;
};

export const projects: Project[] = [
  {
    title: 'Druglytics',
    description: 'GenAI app analyzing 300K+ drug interactions & allergies. Built for Hacklytics 2025.',
    image: '/projects/druglytics.png', // Placeholder
    techStack: [
      { name: 'Python', icon: 'FaPython' },
      { name: 'Streamlit', icon: 'SiStreamlit' },
      { name: 'Flask', icon: 'SiFlask' },
      { name: 'MongoDB', icon: 'SiMongodb' },
      { name: 'AWS EC2', icon: 'FaAws' },
    ],
    links: {
      github: 'https://github.com/aryalsushant/druglytics',
      devpost: 'https://devpost.com/software/druglytics',
    },
    details: 'A GenAI-powered application designed to analyze over 300,000 drug interactions and allergies. It features video explainers generated via Gemini & OpenAI and is deployed on AWS EC2 with Cloudflare R2 for data storage.',
    award: 'Hacklytics 2025 Submission',
  },
  {
    title: 'Swiped-In',
    description: 'AI hiring platform modeled after dating apps, built in 18 hours for HackNYU 2025.',
    image: '/projects/swiped-in.png', // Placeholder
    techStack: [
      { name: 'Next.js', icon: 'SiNextdotjs' },
      { name: 'TypeScript', icon: 'SiTypescript' },
      { name: 'TailwindCSS', icon: 'SiTailwindcss' },
      { name: 'MongoDB', icon: 'SiMongodb' },
    ],
    links: {
      github: 'https://github.com/aryalsushant/swiped-in',
      devpost: 'https://devpost.com/software/swiped-in',
    },
    details: 'An innovative AI hiring platform that mimics the user experience of dating apps. We used Gemini and ElevenLabs for AI-powered mock interviews, creating a full-stack MVP in just 18 hours.',
    award: 'HackNYU 2025 Finalist',
  },
  {
    title: 'Brot AI',
    description: 'Full-stack AI chatbot with user authentication, powered by the Gemini API.',
    image: '/projects/brot-ai.png', // Placeholder
    techStack: [
      { name: 'React', icon: 'FaReact' },
      { name: 'Express', icon: 'SiExpress' },
      { name: 'MongoDB', icon: 'SiMongodb' },
      { name: 'Clerk', icon: 'SiClerk' },
    ],
    links: {
      github: 'https://github.com/aryalsushant/brot-ai',
    },
    details: 'A full-stack AI chatbot application featuring a React frontend, an Express/MongoDB backend, and user authentication handled by Clerk. The conversational AI is powered by the Gemini API.',
  },
  {
    title: 'Home Insurance Fraud Detection',
    description: 'Multimodal ML pipeline to detect fraud in home insurance claims, winning 1st place.',
    image: '/projects/fraud-detection.png', // Placeholder
    techStack: [
      { name: 'TensorFlow', icon: 'SiTensorflow' },
      { name: 'Python', icon: 'FaPython' },
      { name: 'OpenCV', icon: 'SiOpencv' },
    ],
    links: {
      github: 'https://github.com/aryalsushant/home-insurance-fraud-detection',
    },
    details: 'A sophisticated multimodal machine learning pipeline that analyzes both images and text from insurance claims. It uses TensorFlow CNNs for image analysis and GPT for document analysis to score claims from 0–5 based on their legitimacy.',
    award: '1st Place + $2500, Golden Idea Pitch Competition',
  },
]; 