import bassemImage from '../assets/Bassem.png';
import bloodImage from '../assets/Blood (2).png';
import planImage from '../assets/plan.png';
import startupImage from '../assets/Startup.png';
import './GitHubPortfolioSection.css';

const projectCards = [
  {
    id: 'startup',
    title: 'Ecommerce',
    tag: 'ECOMMERCE',
    image: startupImage,
    href: 'https://ecommerce-react-app34.netlify.app/',
    alt: 'Startup e-commerce project preview'
  },
  {
    id: 'travel',
    title: 'Travel Agency',
    tag: 'TRAVEL',
    image: planImage,
    href: 'https://travel-agency-2859fc.netlify.app/',
    alt: 'Travel agency project preview'
  },
  {
    id: 'bassem',
    title: 'Full CRUD Operation',
    tag: 'CRUD',
    image: bassemImage,
    href: 'https://crud-system-pure-js.netlify.app/',
    alt: 'Bassem CRUD system project preview'
  },
  {
    id: 'blood',
    title: 'Blood Donation',
    tag: 'BLOOD',
    image: bloodImage,
    href: 'https://blood-donation-d97751.netlify.app/home#',
    alt: 'Blood donation project preview'
  }
];

const floatingPills = ['HTML', 'CSS', 'JAVASCRIPT', 'REACT', 'VITE'];
const netlifyProjectsUrl = 'https://app.netlify.com/teams/bassem_ahmed/projects';
const cardStackLayout = [
  { x: -156, y: 20, r: -11, z: 1 },
  { x: -52, y: 8, r: -4, z: 2 },
  { x: 52, y: 8, r: 4, z: 2 },
  { x: 156, y: 20, r: 11, z: 1 }
];

export default function GitHubPortfolioSection() {
  return (
    <section id="github-portfolio" className="github-portfolio-section" aria-labelledby="github-portfolio-title">
      <div className="github-portfolio-shell">
        <header className="github-portfolio-header">
          <p className="github-portfolio-kicker">GitHub Work</p>
          <h2 id="github-portfolio-title">Git Hub Portfolio</h2>
          <p className="github-portfolio-subtitle">
            A file-style showcase that groups my live projects with direct links.
          </p>
        </header>

        <div className="github-portfolio-scene">
          <div className="github-portfolio-pills" aria-hidden="true">
            {floatingPills.map((pill, index) => (
              <span key={pill} className={`github-portfolio-pill github-portfolio-pill--${index + 1}`}>
                {pill}
              </span>
            ))}
          </div>

          <div className="github-portfolio-folder" aria-label="Projects folder quick links">
            <span className="github-portfolio-folder__tab" aria-hidden="true" />
            <div className="github-portfolio-folder__body">
              <div className="github-portfolio-folder__stack" aria-label="Projects cards stack">
                {projectCards.map((card, index) => {
                  const pose = cardStackLayout[index] || { x: 0, y: 0, r: 0, z: 1 };
                  return (
                    <a
                      key={card.id}
                      className="github-portfolio-file-card"
                      href={card.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${card.title} - Open live project`}
                      style={{
                        '--card-order': index,
                        '--stack-x': `${pose.x}px`,
                        '--stack-y': `${pose.y}px`,
                        '--stack-r': `${pose.r}deg`,
                        '--stack-z': pose.z
                      }}
                    >
                      <span className="github-portfolio-file-card__tag">{card.tag}</span>
                      <div className="github-portfolio-file-card__media">
                        <img
                          src={card.image}
                          alt={card.alt}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>
                      <span className="github-portfolio-file-card__title">{card.title}</span>
                    </a>
                  );
                })}
            </div>

              <p className="github-portfolio-folder__title">Projects Folder</p>
              <div className="github-portfolio-folder__actions">
                <a
                  className="github-portfolio-folder__btn github-portfolio-folder__btn--accent"
                  href={netlifyProjectsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Open live projects folder"
                >
                  Open Live Folder
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
