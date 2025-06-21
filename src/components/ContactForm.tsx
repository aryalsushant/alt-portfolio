"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    // Placeholder for emailjs integration
    console.log('Form data submitted:', formData);
    // In a real app, you would have:
    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_PUBLIC_KEY')
    //   .then((result) => setStatus('success'))
    //   .catch((error) => setStatus('error'));

    // Simulate network delay
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-light-background/80 dark:bg-dark-background/50 border border-light-accent/20 dark:border-dark-accent/20 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 rounded-md bg-light-background/80 dark:bg-dark-background/50 border border-light-accent/20 dark:border-dark-accent/20 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} required className="w-full px-3 py-2 rounded-md bg-light-background/80 dark:bg-dark-background/50 border border-light-accent/20 dark:border-dark-accent/20 focus:ring-primary focus:border-primary" />
        </div>
        <button type="submit" disabled={status === 'sending'} className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-accent transition-colors font-semibold disabled:bg-gray-400">
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {status === 'success' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 text-center bg-green-100 text-green-800 rounded-md">
          Message sent successfully!
        </motion.div>
      )}
      {status === 'error' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 text-center bg-red-100 text-red-800 rounded-md">
          Something went wrong. Please try again.
        </motion.div>
      )}
    </div>
  );
};

export default ContactForm; 