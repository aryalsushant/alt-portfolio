// All copy for the interactive portfolio, in one place.
// Reused by both the scroll experience and the reduced-motion fallback.

export const ABOUT = {
  title: 'Multidisciplinary Computer Science Student',
  blurb:
    'AI engineer who loves building scalable systems, solving problems in creative ways, and automating boring workflows.',
  tags: ['Full-Stack Software Engineering', 'Automation', 'AI / Machine Learning'],
  ribbon: 'LOW CORTISOL',
};

export const SKILLS = [
  {
    group: 'Languages & Frameworks',
    tone: 'amber',
    items: ['Python', 'JavaScript', 'TypeScript', 'C++', 'React', 'Next.js', 'Node.js', 'Flask', 'TailwindCSS', 'MySQL', 'SQL'],
  },
  {
    group: 'Data Science & ML',
    tone: 'teal',
    items: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Jupyter'],
  },
  {
    group: 'Tools & Platforms',
    tone: 'red',
    items: ['Git', 'GitHub', 'Linux', 'VS Code'],
  },
];

export const EXPERIENCE = [
  {
    title: 'AI Engineer Intern',
    company: 'Gift of Life Marrow Registry',
    dates: 'June 2026 – Present',
    bullets: [
      'Building AI-powered tooling to support the mission of matching donors with patients.',
    ],
  },
  {
    title: 'BreakThroughTech AI/ML Fellow',
    company: 'Cornell Tech',
    dates: 'May 2025 – Present',
    bullets: [
      'Selected from 3,000+ applicants for a highly competitive 12-month program.',
      'Completed Python + ML coursework with Cornell University faculty.',
      'Participated in experiential learning projects with industry mentors.',
    ],
  },
  {
    title: 'Software Engineering Intern',
    company: 'Illumibot',
    dates: 'Oct 2025 – Dec 2025',
    bullets: [
      'Improved UI and resolved frontend–backend integration issues across Flutter app and ReactJS + Node.js web platform.',
      'Built automation tools that automated 80% of manual PR reviews, significantly reducing engineering overhead.',
      'Streamlined projection-mapping testing workflows to improve team velocity.',
    ],
  },
  {
    title: 'Software & Data Science Intern',
    company: 'Delta Health Alliance',
    dates: 'May 2025 – July 2025',
    bullets: [
      'Developed and taught a full Python curriculum to 40+ high school students across rural Mississippi.',
      'Built a full-stack Learning Management System using React.js, Node.js, SQL, deployed on AWS.',
      'Increased digital education access in underserved communities through hands-on instruction.',
    ],
  },
];

export const EDUCATION = [
  {
    school: 'University of Southern Mississippi',
    degree: 'B.S. Computer Science',
    sub: 'Minor in Economic Data Analysis',
    dates: 'Expected May 2027',
    detail: 'GPA 4.0 · Honors Scholar · President’s List · Academic Excellence Scholar',
  },
  {
    school: 'Cornell University',
    degree: 'Machine Learning Foundations',
    sub: 'BreakThroughTech AI Program',
    dates: 'Summer 2025',
    detail: 'Intensive coursework in ML theory and applied AI with Cornell faculty mentorship.',
  },
];

export const PROJECTS = [
  {
    name: 'Druglytics',
    tagline: 'Hacklytics 2025',
    desc: 'Analyzed 300K+ drug interactions using NLP and LLMs to warn users of allergic conflicts. Full-stack app with secure MongoDB backend deployed on AWS EC2.',
    stack: ['Python', 'Streamlit', 'AWS', 'Flask', 'MongoDB'],
    github: 'https://github.com/aryalsushant/hacklytics2025',
    demo: 'https://devpost.com/software/druglytics',
    glow: '#59f0c8',
  },
  {
    name: 'Swiped-In',
    tagline: 'HackNYU 2025',
    desc: 'AI-powered hiring app matching job seekers with recruiters via swiping interface. Gemini AI interviews + ElevenLabs voice screening. MVP built in 18 hours.',
    stack: ['JavaScript', 'Node.js', 'MongoDB', 'Gemini', 'ElevenLabs'],
    github: 'https://github.com/rupaut98/swipedin',
    demo: 'https://devpost.com/software/swiped-in',
    glow: '#ff8ad4',
  },
  {
    name: 'HIPAApotamus',
    tagline: 'Hatchathon 2025 Winner',
    desc: 'HIPAA Contract Management System for health clinics. Won Hatchathon 2025. Contacted by Mississippi Dept. of IT for a joint follow-up project.',
    stack: ['Next.js', 'OpenAI', 'AWS', 'TypeScript'],
    github: null,
    demo: null,
    glow: '#7db8ff',
  },
];

export const AWARDS = [
  { place: '1st', medal: '🥇', title: 'First Prize', event: 'USM Annual Hackathon 2025' },
  { place: '1st', medal: '🥇', title: 'First Place', event: 'USM Golden Idea Pitch Competition 2025' },
  { place: '2nd', medal: '🚀', title: 'Second Most Improved Team', event: 'BreakThroughTech WiDS Global Datathon 2026' },
  { place: '3rd', medal: '🥉', title: 'Third Place', event: 'USM Annual Hackathon 2024' },
];

export const CONTACT = {
  heading: 'Send a Message',
  blurb: 'Open to opportunities, collaborations, and interesting conversations.',
  email: 'sushantaryal05@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sushant-aryal/',
  github: 'https://github.com/aryalsushant',
  formspreeId: 'meokndpk',
};
