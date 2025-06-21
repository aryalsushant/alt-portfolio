"use client";
import { motion } from 'framer-motion';
import PDFViewer from '../../components/PDFViewer';
import ResumeSidebar from '../../components/ResumeSidebar';

export default function ResumePage() {
  return (
    <main className="container mx-auto py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        My Resume
      </motion.h1>
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="order-first md:order-last"
        >
          <ResumeSidebar />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 rounded-lg shadow-lg overflow-hidden border border-light-accent/10 dark:border-dark-accent/10"
        >
          <PDFViewer file="/resume.pdf" />
        </motion.div>
      </div>
    </main>
  );
} 