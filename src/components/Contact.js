import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

const Contact = () => {
  const [state, handleSubmit] = useForm('meokndpk');
  return (
    <section className="max-w-3xl mx-auto py-24 px-6" id="contact">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 drop-shadow-neon text-center">Get in Touch</h2>
      {state.succeeded ? (
        <div className="bg-white dark:bg-[#232526] rounded-2xl shadow-neon p-8 text-center border border-gray-200 dark:border-cyan-400/30">
          <p className="text-xl font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Thank you!</p>
          <p className="text-gray-700 dark:text-cyan-100">Your message has been sent. I will get back to you soon.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#232526] rounded-2xl shadow-neon border border-gray-200 dark:border-cyan-400/30 p-0 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Pigeon image */}
          <div className="md:w-1/2 w-full flex items-center justify-center bg-transparent p-8 md:p-0">
            <img src="/pigeon1.png" alt="Pigeon" className="w-full h-auto max-h-80 object-contain" />
          </div>
          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="md:w-1/2 w-full flex flex-col gap-6 p-8">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#232526] border border-gray-300 dark:border-cyan-400/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-cyan-200 focus:outline-none focus:border-cyan-400 focus:shadow-glow transition"
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#232526] border border-gray-300 dark:border-cyan-400/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-cyan-200 focus:outline-none focus:border-cyan-400 focus:shadow-glow transition"
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
            <textarea
              name="message"
              placeholder="Message"
              required
              rows={5}
              className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-[#232526] border border-gray-300 dark:border-cyan-400/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-cyan-200 focus:outline-none focus:border-cyan-400 focus:shadow-glow transition"
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />
            <button
              type="submit"
              disabled={state.submitting}
              className="mt-2 px-8 py-3 rounded-lg bg-cyan-500 dark:bg-cyan-400 text-white font-bold text-lg shadow-neon hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:shadow-glow transition-all duration-300"
            >
              {state.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Contact; 