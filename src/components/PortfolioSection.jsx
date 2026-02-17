import { useEffect, useState } from 'react';
import cupCoffeeImage from '../assets/Cub - Coffee.png';
import developerCareerImage from '../assets/Developer career.png';
import eLearningDashboardImage from '../assets/E-Learning Dachboard.png';
import mcImage from '../assets/MC.png';
import sakenaVideo from '../assets/QHCjNf6Dw3t_576.mp4';
import sakenaImage from '../assets/Sakena.png';
import './PortfolioSection.css';

const projects = [
  {
    id: 'sakena',
    title: 'SAKENA UI/UX Case Study',
    kind: 'video',
    size: 'center',
    slot: 'center',
    asset: sakenaVideo,
    mobileFallback: sakenaImage,
    href: 'https://www.behance.net/gallery/178030967/SAKENA-(UIUX-case-study)',
    alt: 'SAKENA UI UX case study preview',
    desc: 'A funeral service application that honors life and supports families with dignity.'
  },
  {
    id: 'cup-coffee',
    title: 'Cup Coffee App Case Study',
    kind: 'image',
    size: 'side',
    slot: 'left-top',
    asset: cupCoffeeImage,
    href: 'https://www.behance.net/gallery/218298005/cup-app-coffee-case-study-(-)',
    alt: 'Cup Coffee app case study cover'
  },
  {
    id: 'mcdonalds',
    title: 'McDonalds Tracking System',
    kind: 'image',
    size: 'side',
    slot: 'right-top',
    asset: mcImage,
    href: 'https://www.behance.net/gallery/179041423/McDonalds-Traking-system-(UIUX)',
    alt: 'McDonalds tracking system UI UX case study'
  },
  {
    id: 'developer-career',
    title: 'Developer career',
    kind: 'image',
    size: 'side',
    slot: 'left-bottom',
    asset: developerCareerImage,
    href: 'https://www.behance.net/gallery/181262119/E-Learning-App-(UIUX-Case-study)',
    alt: 'Developer career UI UX project screens'
  },
  {
    id: 'dashboard-courses',
    title: 'case study dachbourd for courses',
    kind: 'image',
    size: 'side',
    slot: 'right-bottom',
    asset: eLearningDashboardImage,
    href: 'https://www.behance.net/gallery/181216793/Dashboard-for-courses',
    alt: 'Dashboard for courses project cover'
  }
];

export default function PortfolioSection() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 640px)').matches;
  });
  const [videoErrors, setVideoErrors] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mobileQuery = window.matchMedia('(max-width: 640px)');
    const syncMobile = () => setIsMobile(mobileQuery.matches);
    syncMobile();

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', syncMobile);
      return () => mobileQuery.removeEventListener('change', syncMobile);
    }

    mobileQuery.addListener(syncMobile);
    return () => mobileQuery.removeListener(syncMobile);
  }, []);

  return (
    <section id="portfolio" className="portfolio-section" aria-labelledby="portfolio-title">
      <div className="portfolio-shell">
        <header className="portfolio-header">
          <p className="portfolio-kicker">UX/UI Portfolio</p>
          <h2 id="portfolio-title">UI/UX case study</h2>
          <p className="portfolio-subtitle">
            Selected product work across healthcare, education, and service experiences.
          </p>
        </header>

        <div className="portfolio-grid">
          {projects.map((project) => {
            const isCenterVideo = project.kind === 'video';
            const hasVideoError = Boolean(videoErrors[project.id]);
            const showVideoOnDesktopTablet = isCenterVideo && !isMobile;
            const useFallbackImage = !showVideoOnDesktopTablet || hasVideoError;

            return (
              <a
                key={project.id}
                className={`portfolio-card portfolio-card--${project.size} portfolio-card--${project.slot}`}
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${project.title} - Open on Behance`}
              >
                <div className="portfolio-card__media" aria-hidden="true">
                  {showVideoOnDesktopTablet && !hasVideoError ? (
                    <video
                      className="portfolio-card__video"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={project.mobileFallback}
                      preload="none"
                      onError={() =>
                        setVideoErrors((prev) => ({
                          ...prev,
                          [project.id]: true
                        }))
                      }
                    >
                      <source src={project.asset} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="portfolio-card__image"
                      src={isCenterVideo && useFallbackImage ? project.mobileFallback : project.asset}
                      alt={project.alt}
                      loading={isCenterVideo ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={isCenterVideo ? 'auto' : 'low'}
                    />
                  )}
                </div>

                <div className="portfolio-card__body">
                  <p className="portfolio-card__tag">{isCenterVideo ? 'Featured Case' : 'Case Study'}</p>
                  <h3>{project.title}</h3>
                  {project.desc ? <p className="portfolio-card__desc">{project.desc}</p> : null}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
