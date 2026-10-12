// All copy for the interactive portfolio, in one place.
// Sourced from the resume (Oct 2026) and public GitHub repos.
// Phone number is intentionally never included anywhere in the game.

export const PROFILE = {
  name: 'Sushant Aryal',
  role: 'AI Engineer · CS @ Southern Miss',
  location: 'Hattiesburg, Mississippi',
  blurb:
    'Computer Science student and AI engineer who loves building scalable systems, solving problems in creative ways, and automating boring workflows.',
  focus: ['Full-Stack Software Engineering', 'AI / Machine Learning', 'Automation'],
  stats: [
    { value: '4.0', label: 'GPA' },
    { value: '450+', label: 'users on tools I shipped' },
    { value: '3', label: 'internships completed' },
    { value: '50K+', label: 'lines contributed at Lumibot' },
  ],
  ribbon: 'LOW CORTISOL',
};

export const SKILLS = [
  {
    id: 'languages',
    group: 'Languages',
    color: '#ffb454',
    items: ['Python', 'Java', 'C / C++', 'JavaScript', 'TypeScript', 'SQL (Postgres)', 'HTML / CSS', 'R'],
  },
  {
    id: 'frameworks',
    group: 'Frameworks',
    color: '#63e7de',
    items: ['React', 'Next.js', 'Node.js', 'Flask', 'FastAPI', 'Material-UI', 'JUnit', 'Supabase'],
  },
  {
    id: 'ml',
    group: 'AI / ML & Data',
    color: '#ff7ac8',
    items: ['pandas', 'NumPy', 'Matplotlib', 'scikit-learn', 'XGBoost', 'PyTorch', 'OpenAI API', 'ElevenLabs', 'RAG / ChromaDB'],
  },
  {
    id: 'tools',
    group: 'Developer Tools',
    color: '#9d8cff',
    items: ['Git', 'Docker', 'AWS', 'Google Cloud', 'TravisCI', 'Claude Code', 'VS Code', 'IntelliJ', 'PyCharm'],
  },
];

export const EXPERIENCE = [
  {
    id: 'giftoflife',
    title: 'Artificial Intelligence Intern',
    company: 'Gift of Life Marrow Registry',
    short: 'GIFT OF LIFE',
    location: 'Boca Raton, FL',
    dates: 'June 2026 – Aug 2026',
    color: '#ff5d73',
    bullets: [
      'Built and deployed a full-stack internal training tool used by 450+ campus ambassadors across the country.',
      'Trained machine learning models to predict stem cell collection times and collection cancellation probabilities.',
      'Identified opportunities to automate and streamline tasks across multiple departments using AI.',
    ],
  },
  {
    id: 'btt',
    title: 'AI & Machine Learning Fellow',
    company: 'Break Through Tech · Cornell Tech',
    short: 'BREAK THROUGH TECH',
    location: 'Remote',
    dates: 'May 2025 – May 2026',
    color: '#9d8cff',
    bullets: [
      'Selected from 3,000+ applicants for the Break Through Tech AI program at Cornell Tech.',
      'Built ML pipelines on historical data to predict aerospace employment trends across 50 states over 5 years.',
      'Completed 12 months of Python and ML coursework with Cornell faculty and mentorship from industry experts.',
    ],
  },
  {
    id: 'lumibot',
    title: 'Software Engineering Intern',
    company: 'Lumibot LLC',
    short: 'LUMIBOT',
    location: 'Hattiesburg, MS',
    dates: 'Oct 2025 – Dec 2025',
    color: '#63e7de',
    bullets: [
      'Improved UI and fixed frontend–backend integration issues in the Illumibot Flutter app and React / Node.js website.',
      'Built internal tools that turn bug reports and feature requests into GitHub issues, placed on the board by urgency.',
      'Contributed 50K+ lines of code to an established codebase via Git.',
    ],
  },
  {
    id: 'dha',
    title: 'Software & Data Science Intern',
    company: 'Delta Health Alliance',
    short: 'DELTA HEALTH',
    location: 'Greenwood, MS',
    dates: 'May 2025 – July 2025',
    color: '#ffb454',
    bullets: [
      'Developed a full-stack Learning Management platform (React / TypeScript, Node.js, SQL) on AWS for 25+ users.',
      'Developed and taught a full Python curriculum to 40+ high school students in rural Mississippi.',
    ],
  },
];

export const PROJECTS = [
  {
    id: 'dcs',
    name: 'DCS',
    tagline: 'AI voice training for 450+ ambassadors',
    dates: 'June 2026 – July 2026',
    desc: 'Full-stack app where Gift of Life campus ambassadors practice donor recruitment against 6 AI personas. Trainer role lets staff review how ambassadors handle hard questions and coach them. ElevenLabs voice latency tuned for natural back-and-forth, piloted with staff before launch.',
    stack: ['Next.js', 'Supabase', 'ElevenLabs', 'OpenAI'],
    links: [],
    color: '#ff5d73',
  },
  {
    id: 'hipaapotamus',
    name: 'HIPAApotamus',
    tagline: 'Hatchathon winner → MS Dept. of Health PoC',
    dates: 'Feb 2026 – May 2026',
    desc: 'Won Hatchathon 2025, then built a BAA compliance proof of concept for the Mississippi Department of Health with ITS and AWS. Vendor e-signatures with signed PDFs on S3 and a SHA-256 audit hash for every signing event. Automated 90/30/7-day expiry reminders via SES and GPT-4o audit packet summaries.',
    stack: ['Next.js', 'TypeScript', 'AWS', 'OpenAI'],
    links: [{ label: 'GitHub', href: 'https://github.com/aryalsushant/HIPAApotamus' }],
    image: '/hipaa.jpeg',
    color: '#7db8ff',
  },
  {
    id: 'hla',
    name: 'HLA Translator',
    tagline: 'HLA typing across 8 nomenclature levels',
    dates: '2026',
    desc: 'Web tool that reduces an HLA typing across all eight py-ard nomenclature levels side by side, grouping identical results so it is obvious exactly where resolution is lost. Built for education and reference.',
    stack: ['TypeScript', 'py-ard', 'Vercel'],
    links: [
      { label: 'Live', href: 'https://hla-nomenclature-translator-kappa.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/aryalsushant/hla-nomenclature-translator' },
    ],
    color: '#59f0c8',
  },
  {
    id: 'druglytics',
    name: 'Druglytics',
    tagline: 'Hacklytics 2025',
    dates: 'Feb 2025',
    desc: 'Analyzed 300K+ drug interactions with NLP and LLMs to warn users about drug–drug interactions and allergic conflicts, with an AI-generated explainer video. Secure MongoDB backend deployed on AWS EC2.',
    stack: ['Python', 'Streamlit', 'Flask', 'MongoDB', 'AWS'],
    links: [
      { label: 'Live', href: 'https://hacklytics.streamlit.app/' },
      { label: 'GitHub', href: 'https://github.com/aryalsushant/hacklytics2025' },
      { label: 'Devpost', href: 'https://devpost.com/software/druglytics' },
    ],
    image: '/drug.png',
    color: '#59f0c8',
  },
  {
    id: 'crewly',
    name: 'Crewly',
    tagline: 'Agentic collaboration for utilities',
    dates: 'Sept 2026',
    desc: 'Finds where utilities are about to build next to each other without knowing it. Parses public filings from 20+ grid planners onto one map, ranks every overlap within 40 km by distance tier and build timeline, prices the savings line by line from cited public cost data, flags sites in live storm paths, and drafts the coordination with a 68-tool agent. Residents can claim photo bounties paid out on Solana.',
    stack: ['Python', 'LLM agent', 'MapLibre', 'Solana'],
    links: [
      { label: 'Live', href: 'https://crewly.miami/' },
      { label: 'GitHub', href: 'https://github.com/iviraa/crewly' },
    ],
    image: '/crewly.jpg',
    color: '#9b6bff',
  },
  {
    id: 'aerospace',
    name: 'Aerospace Forecast',
    tagline: 'Break Through Tech AI Studio',
    dates: '2025 – 2026',
    desc: 'Forecasts aerospace industry employment at national and state level by combining BLS data with economic indicators — ARIMA for national forecasting and XGBoost for state-level predictions.',
    stack: ['Python', 'pandas', 'statsmodels', 'XGBoost', 'Plotly'],
    links: [{ label: 'GitHub', href: 'https://github.com/aryalsushant/swytch-1b' }],
    color: '#9d8cff',
  },
  {
    id: 'approve',
    name: 'approve-thyself',
    tagline: 'Self-reviewing plan mode for Claude Code',
    dates: '2026',
    desc: 'Claude Code plugin that turns plan mode into an autonomous self-review loop: reviewer subagents critique each plan and auto-approve it, or feed the critique back for revision, with a round cap that hands control back to you.',
    stack: ['JavaScript', 'Claude Code', 'Agents'],
    links: [{ label: 'GitHub', href: 'https://github.com/aryalsushant/approve-thyself' }],
    color: '#ff9d6b',
  },
];

export const RESEARCH = {
  title: 'Metrics Failure in LLM-Based Code Vulnerability Repair: An Empirical Study and a Change-Aware Screen',
  authors: ['O. Nepal', 'S. Aryal', 'O. Olukola', 'N. Rahimi'],
  venue: 'arXiv preprint arXiv:2609.26749 (cs.SE)',
  date: 'Sept. 2026',
  href: 'https://arxiv.org/abs/2609.26749',
  summary:
    'An empirical look at why the metrics used to judge LLM-generated vulnerability patches can mislead, plus a change-aware screen to catch those failures.',
};

export const EDUCATION = [
  {
    id: 'usm',
    school: 'University of Southern Mississippi',
    short: 'SOUTHERN MISS',
    degree: 'B.S. Computer Science',
    sub: 'Minor in Economic Data Analysis',
    dates: 'Aug 2023 – May 2027',
    location: 'Hattiesburg, MS',
    detail: 'GPA 4.0 / 4.0 · Honors Scholar · President’s List · Academic Excellence Scholar',
    logo: '/usmlogo.svg',
    color: '#ffc72c',
  },
  {
    id: 'cornell',
    school: 'Cornell University',
    short: 'CORNELL',
    degree: 'Summer class in Machine Learning Foundations',
    sub: 'Break Through Tech AI Program',
    dates: 'May 2025 – Aug 2025',
    location: 'Remote',
    detail: 'Intensive coursework in ML theory and applied AI with Cornell faculty mentorship.',
    logo: '/cornell.png',
    color: '#d84a4a',
  },
];

export const AWARDS = [
  { id: 'usm-hack-25', place: 1, title: 'First Prize', event: 'USM Annual Hackathon 2025' },
  { id: 'golden-idea', place: 1, title: 'First Place', event: 'USM Golden Idea Pitch Competition 2025' },
  { id: 'hatchathon', place: 1, title: 'Winner', event: 'Hatchathon 2025 · HIPAApotamus' },
  { id: 'wids', place: 2, title: 'Second Most Improved Team', event: 'Break Through Tech WiDS Global Datathon 2026' },
  { id: 'usm-hack-24', place: 3, title: 'Third Place', event: 'USM Annual Hackathon 2024' },
];

export const CONTACT = {
  heading: 'Open a channel',
  blurb: 'Open to opportunities, collaborations, and interesting conversations.',
  email: 'sushantaryal05@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sushant-aryal/',
  github: 'https://github.com/aryalsushant',
  formspreeId: 'meokndpk',
};
