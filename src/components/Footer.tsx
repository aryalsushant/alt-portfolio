import SocialIcons from './SocialIcons';

const Footer = () => {
  return (
    <footer className="border-t border-light-accent/10 dark:border-dark-accent/10 mt-12">
      <div className="container mx-auto py-6 text-center text-gray-600 dark:text-gray-400">
        <div className="flex justify-center mb-4">
          <SocialIcons />
        </div>
        <p>&copy; {new Date().getFullYear()} Sushant Aryal. All Rights Reserved.</p>
        <p className="text-sm mt-1">
          Built with <a href="https://nextjs.org" className="hover:text-accent">Next.js</a> and <a href="https://tailwindcss.com" className="hover:text-accent">Tailwind CSS</a>. Deployed on <a href="https://vercel.com" className="hover:text-accent">Vercel</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 