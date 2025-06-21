import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

const socials = [
  {
    href: 'https://github.com/aryalsushant',
    label: 'GitHub',
    icon: <FaGithub className="text-xl" />,
  },
  {
    href: 'https://linkedin.com/in/aryalsushant',
    label: 'LinkedIn',
    icon: <FaLinkedin className="text-xl" />,
  },
  {
    href: 'https://aryalsushant.com',
    label: 'Portfolio',
    icon: <FaGlobe className="text-xl" />,
  },
];

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-2">
      {socials.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent/20 transition-colors focus:outline-none focus:ring"
        >
          {icon}
        </a>
      ))}
    </div>
  );
} 