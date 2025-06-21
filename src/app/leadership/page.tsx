import { motion } from 'framer-motion';

const timelineData = [
  {
    role: 'Senior Resident Assistant',
    date: 'May 2025 – Present',
    description: 'Directly supervised 12 RAs and 10 Desk Assistants, managing schedules, performance, and resident concerns.',
  },
  {
    role: 'Resident Assistant',
    date: 'July 2024 – May 2025',
    description: 'Promoted to oversee a residential floor, fostering a safe and inclusive community for 50+ students.',
  },
  {
    role: 'Desk Assistant',
    date: 'Jan 2024 – July 2024',
    description: 'Managed front desk operations, assisted residents, and ensured building security. Quickly recognized for reliability and promoted.',
  },
];

const TimelineItem = ({ item, isLast }) => (
  <div className="relative pl-8">
    <div className="absolute left-0 top-0 h-full w-0.5 bg-primary/30"></div>
    <div className="absolute left-[-6px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-light-background dark:ring-dark-background"></div>
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-bold text-lg text-primary">{item.role}</h3>
      <p className="text-sm text-gray-500 mb-1">{item.date}</p>
      <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
    </motion.div>
  </div>
);

const LeadershipTimeline = () => (
  <div className="space-y-8">
    {timelineData.map((item, index) => (
      <TimelineItem key={item.role} item={item} isLast={index === timelineData.length - 1} />
    ))}
  </div>
);

export default function LeadershipPage() {
  return (
    <main className="container mx-auto py-16 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Leadership Experience
      </motion.h1>
      <h2 className="text-2xl font-semibold mb-6 text-center">University of Southern Mississippi</h2>
      <LeadershipTimeline />
    </main>
  );
} 