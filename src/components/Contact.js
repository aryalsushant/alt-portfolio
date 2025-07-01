import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Invalid email address.');
      return;
    }
    setError('');
    console.log(form);
    setForm({ name: '', email: '', message: '' });
  };
  return (
    <section className="max-w-xl mx-auto py-24 px-6" id="contact">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 drop-shadow-neon text-center">Contact</h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#232526] rounded-2xl shadow-neon p-8 flex flex-col gap-6 border border-gray-200 dark:border-cyan-400/30">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#232526] border border-gray-300 dark:border-cyan-400/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-cyan-200 focus:outline-none focus:border-cyan-400 focus:shadow-glow transition"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#232526] border border-gray-300 dark:border-cyan-400/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-cyan-200 focus:outline-none focus:border-cyan-400 focus:shadow-glow transition"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#232526] border border-gray-300 dark:border-cyan-400/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-cyan-200 focus:outline-none focus:border-cyan-400 focus:shadow-glow transition"
        />
        {error && <div className="text-pink-500 dark:text-pink-400 text-sm -mt-4">{error}</div>}
        <button
          type="submit"
          className="mt-2 px-8 py-3 rounded-lg bg-cyan-500 dark:bg-cyan-400 text-white font-bold text-lg shadow-neon hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:shadow-glow transition-all duration-300"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default Contact; 