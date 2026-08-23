import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaBehance, FaEnvelope, FaGithub } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';
import portraitCutout from '../assets/Me1-cropped.png';
import portraitFallback from '../assets/Me.png';
import './Hero.css';

const enterEase = [0.22, 1, 0.36, 1];
const cvFileUrl = `${import.meta.env.BASE_URL}cv.pdf`;

const socialLinks = [
  {
    label: 'Behance',
    href: 'https://www.behance.net/bassemahmed19',
    icon: FaBehance,
    newTab: true
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Bassem-product-manager',
    icon: FaGithub,
    newTab: true
  },
  {
    label: 'WhatsApp',
    href: 'https://api.whatsapp.com/send?phone=020163344708',
    icon: FaWhatsapp,
    newTab: true
  },
  {
    label: 'Email',
    href: 'mailto:bassem.ahmed0202@gmail.com',
    icon: FaEnvelope,
    newTab: false
  }
];

export default function Hero() {
  const [activePortrait, setActivePortrait] = useState(portraitCutout);
  const heroRef = useRef(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const parallaxEnabledRef = useRef(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return undefined;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    parallaxEnabledRef.current = !reduceMotion && !isTouchDevice;

    if (!parallaxEnabledRef.current) {
      node.style.setProperty('--parallax-x', '0');
      node.style.setProperty('--parallax-y', '0');
      return undefined;
    }

    const updateFrame = () => {
      const current = currentRef.current;
      const target = targetRef.current;

      current.x += (target.x - current.x) * 0.085;
      current.y += (target.y - current.y) * 0.085;

      node.style.setProperty('--parallax-x', current.x.toFixed(4));
      node.style.setProperty('--parallax-y', current.y.toFixed(4));

      rafRef.current = window.requestAnimationFrame(updateFrame);
    };

    rafRef.current = window.requestAnimationFrame(updateFrame);
    return () => window.cancelAnimationFrame(rafRef.current);
  }, [reduceMotion]);

  const updatePointerTarget = (clientX, clientY) => {
    const node = heroRef.current;
    if (!node || !parallaxEnabledRef.current) return;

    const rect = node.getBoundingClientRect();
    const relativeX = (clientX - rect.left) / rect.width;
    const relativeY = (clientY - rect.top) / rect.height;

    targetRef.current.x = Math.max(-1, Math.min(1, (relativeX - 0.5) * 2));
    targetRef.current.y = Math.max(-1, Math.min(1, (relativeY - 0.5) * 2));
  };

  const handleDownloadCv = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(cvFileUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('CV file not found');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', 'Bassem-Ahmed-CV.pdf');
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(cvFileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      className="hero"
      ref={heroRef}
      onMouseMove={(event) => updatePointerTarget(event.clientX, event.clientY)}
      onMouseLeave={() => {
        targetRef.current = { x: 0, y: 0 };
      }}
    >
      <div className="hero-background" aria-hidden="true">
        <span className="blob blob-one" />
        <span className="blob blob-two" />
      </div>

      <div className="hero-noise" aria-hidden="true" />

      <div className="hero-content">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: enterEase }}
        >
          <p className="hero-kicker">Senior Product Owner | Product Manager</p>
          <h1>I'm Bassem Ahmed, a Product Owner &amp; Product Manager with 3+ Years of Experience</h1>
          <p className="hero-subtitle">
            I deliver digital products across healthcare, e-learning, e-commerce, ERP, and dashboards.
          </p>

          <div className="hero-actions">
            <a
              href={cvFileUrl}
              className="btn btn-primary"
              aria-label="Download My CV"
              download="Bassem-Ahmed-CV.pdf"
              onClick={handleDownloadCv}
            >
              Download My CV
            </a>
            <a href="tel:+201063344708" className="btn btn-secondary" aria-label="Contact Me">
              Contact Me
            </a>
          </div>

          <ul className="hero-socials" aria-label="Social links">
            {socialLinks.map(({ label, href, icon: Icon, newTab }) => (
              <li key={label}>
                <a
                  href={href}
                  target={newTab ? '_blank' : undefined}
                  rel={newTab ? 'noreferrer' : undefined}
                  aria-label={label}
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="hero-stage-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: enterEase }}
        >
          <div className="hero-stage">
            <img
              className={`hero-stage-image${
                activePortrait === portraitCutout ? ' hero-stage-image--subject' : ''
              }`}
              src={activePortrait}
              alt="Portrait of Bassem Ahmed, Senior Product Owner and Product Manager"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              onError={() => {
                if (activePortrait !== portraitFallback) {
                  setActivePortrait(portraitFallback);
                }
              }}
            />
            <span className="hero-stage-glow" aria-hidden="true" />
            <span className="hero-stage-tone" aria-hidden="true" />
            <span className="hero-stage-left-fade" aria-hidden="true" />
            <span className="hero-stage-vignette" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
