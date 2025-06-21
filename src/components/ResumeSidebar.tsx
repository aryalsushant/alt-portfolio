import SocialIcons from './SocialIcons';

const ResumeSidebar = () => (
  <aside className="w-full md:w-1/3 lg:w-1/4 p-6 bg-light-background/80 dark:bg-dark-background/50 rounded-lg shadow-md border border-light-accent/10 dark:border-dark-accent/10">
    <h2 className="text-2xl font-bold mb-4 text-primary">Sushant Aryal</h2>
    <div className="space-y-3 mb-6">
      <p>📍 Hattiesburg, MS</p>
      <p>
        <a href="mailto:sushant.aryal@usm.edu" className="hover:text-accent">
          📧 sushant.aryal@usm.edu
        </a>
      </p>
      <p>
        <a href="tel:6013291279" className="hover:text-accent">
          📞 601-329-1279
        </a>
      </p>
    </div>
    <div className="mb-6">
      <SocialIcons />
    </div>
    <a
      href="/resume.pdf"
      download="SushantAryal_Resume.pdf"
      className="w-full text-center block px-4 py-2 rounded-lg bg-primary text-white hover:bg-accent transition-colors font-semibold"
    >
      Download PDF
    </a>
  </aside>
);

export default ResumeSidebar; 