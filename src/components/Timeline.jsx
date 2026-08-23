import { motion, useReducedMotion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaBriefcase,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaHandsHelping,
  FaRoad
} from 'react-icons/fa';
import planeImage from '../assets/seedream-4.5_Top-down_view_of_a_sleek_premium_futuristic_jet_airplane_matte_black_body_subtle-0-Photoroom.png';
import innoTechLogo from '../assets/innotechegy_logo.jpg';
import qeemaTechLogo from '../assets/qeema_tech_logo.jpg';
import sofcoLogo from '../assets/sofco.jpg';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const ROAD_EASE = [0.22, 1, 0.36, 1];
const AIRCRAFT_ROTATION_OFFSET = 90;
const ROAD_PATH_DESKTOP =
  'M 50 0 C 38 110, 62 230, 50 350 C 38 470, 62 590, 50 710 C 38 830, 62 930, 50 1040';
const ROAD_PATH_MOBILE = 'M 3.5 0 C 3.5 260, 3.5 520, 3.5 1040';

const timelineItems = [
  {
    category: 'work',
    title: 'Senior Product Owner — InnoTech',
    date: 'May 2025 – Present',
    bullets: [
      'Own delivery for Gulf/KSA digital healthcare and education products, from discovery and planning through release and UAT.',
      'Manage product roadmaps and Jira backlogs; prioritize initiatives, write user stories, and lead cross-functional delivery.',
      'Gather and analyze stakeholder requirements, translating them into SRS, workflows, user stories, and acceptance criteria.',
      'Validate solutions with stakeholders, developers, and QA while maintaining readiness and traceability in Jira.',
      'Support UAT and verify delivered features against acceptance criteria; prototype product flows when needed.'
    ]
  },
  {
    category: 'teaching',
    title: 'UI/UX Instructor (Part-Time) — AMIT Learning',
    date: 'June 2025 – Present',
    bullets: [
      'Deliver UI/UX training and review practical assignments focused on user-centered design and prototyping.'
    ]
  },
  {
    category: 'work',
    title: 'Business Analyst — Qeema Tech',
    date: 'Apr 2024 – May 2025',
    bullets: [
      'Gathered and analyzed requirements; produced workflows, user stories, and acceptance criteria for delivery teams.',
      'Aligned stakeholders and technical teams through requirement validation, backlog refinement, and solution clarification.',
      'Mapped As-Is and To-Be processes and performed gap analysis to identify workflow improvements and dependencies.',
      'Supported backlog refinement, UAT, and change-impact analysis to keep delivered features aligned with approved requirements.'
    ]
  },
  {
    category: 'work',
    title: 'Product Designer — SOFCO',
    date: 'Jan 2024 – Dec 2024',
    bullets: [
      'Conducted user research and task analysis to identify operational and admin workflow pain points.',
      'Created user flows, wireframes, and interactive prototypes; validated product concepts before development.'
    ]
  },
  {
    category: 'education',
    title: 'Education — Helwan University (Business Information Systems)',
    date: 'Grade: Excellent',
    bullets: ['Business Information Systems, Helwan University.']
  },
  {
    category: 'education',
    title: 'Master of Project Management (PMP) — German University in Cairo (GUC)',
    bullets: ['Project management studies at the German University in Cairo.']
  }
];

const workedWithCompanies = [
  {
    id: 'innotech',
    name: 'InnoTech',
    asset: innoTechLogo
  },
  {
    id: 'qeema-tech',
    name: 'Qeema Tech',
    asset: qeemaTechLogo
  },
  {
    id: 'sofco',
    name: 'SOFCO',
    asset: sofcoLogo
  }
];

const iconByCategory = {
  work: FaBriefcase,
  teaching: FaChalkboardTeacher,
  volunteer: FaHandsHelping,
  education: FaGraduationCap
};

const bulletParentVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.14,
      staggerChildren: 0.08
    }
  }
};

const bulletVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: ROAD_EASE }
  }
};

export default function Timeline() {
  const sectionRef = useRef(null);
  const roadVisualRef = useRef(null);
  const roadSvgRef = useRef(null);
  const roadPathRef = useRef(null);
  const roadProgressRef = useRef(null);
  const roadLaneRef = useRef(null);
  const carRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const roadVisual = roadVisualRef.current;
    const roadSvg = roadSvgRef.current;
    const roadPath = roadPathRef.current;
    const roadProgress = roadProgressRef.current;
    const roadLane = roadLaneRef.current;
    const car = carRef.current;

    if (!section || !roadVisual || !roadSvg || !roadPath || !roadProgress || !roadLane || !car) {
      return undefined;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 861px)',
        mobile: '(max-width: 860px)'
      },
      (context) => {
        const isMobile = Boolean(context.conditions.mobile);
        const pathData = isMobile ? ROAD_PATH_MOBILE : ROAD_PATH_DESKTOP;

        roadPath.setAttribute('d', pathData);
        roadProgress.setAttribute('d', pathData);
        roadLane.setAttribute('d', pathData);

        const length = roadProgress.getTotalLength();
        roadProgress.style.strokeDasharray = `${length}`;
        roadProgress.style.strokeDashoffset = reduceMotion ? '0' : `${length}`;

        const placeCarAt = (progressValue) => {
          const progress = Math.max(0, Math.min(1, progressValue));
          const travel = length * progress;
          const ahead = Math.min(length, travel + 1.6);

          roadProgress.style.strokeDashoffset = `${length * (1 - progress)}`;

          const point = roadPath.getPointAtLength(travel);
          const nextPoint = roadPath.getPointAtLength(ahead);
          const matrix = roadPath.getScreenCTM();
          if (!matrix) return;

          const svgPoint = roadSvg.createSVGPoint();
          svgPoint.x = point.x;
          svgPoint.y = point.y;

          const svgPointNext = roadSvg.createSVGPoint();
          svgPointNext.x = nextPoint.x;
          svgPointNext.y = nextPoint.y;

          const pointInViewport = svgPoint.matrixTransform(matrix);
          const nextInViewport = svgPointNext.matrixTransform(matrix);
          const visualRect = roadVisual.getBoundingClientRect();

          const x = pointInViewport.x - visualRect.left;
          const y = pointInViewport.y - visualRect.top;
          const angle =
            (Math.atan2(
              nextInViewport.y - pointInViewport.y,
              nextInViewport.x - pointInViewport.x
            ) *
              180) /
              Math.PI +
            AIRCRAFT_ROTATION_OFFSET;

          gsap.set(car, {
            x,
            y,
            rotate: angle,
            xPercent: -50,
            yPercent: -50
          });
        };

        if (reduceMotion) {
          placeCarAt(1);
          return undefined;
        }

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 76%',
          end: 'bottom 18%',
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            placeCarAt(self.progress);
          },
          onRefresh: (self) => {
            placeCarAt(self.progress);
          }
        });

        placeCarAt(trigger.progress || 0);

        return () => {
          trigger.kill();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, [reduceMotion]);

  return (
    <section className="timeline-section" id="journey" ref={sectionRef}>
      <div className="timeline-shell">
        <motion.header
          className="timeline-header"
          initial={reduceMotion ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, ease: ROAD_EASE }}
        >
          <p className="timeline-kicker">
            <FaRoad aria-hidden="true" />
            Road Timeline
          </p>
          <div className="timeline-company-strip" aria-label="Companies Worked With">
            <p className="timeline-company-title">Company Worked With</p>
            <motion.div
              className="timeline-company-marquee"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.55, ease: ROAD_EASE }}
            >
              <div className={`timeline-company-track${reduceMotion ? ' timeline-company-track--static' : ''}`}>
                {[0, 1].map((cloneIndex) => (
                  <ul
                    key={`company-group-${cloneIndex}`}
                    className="timeline-company-list"
                    aria-hidden={cloneIndex === 1 ? 'true' : undefined}
                  >
                    {workedWithCompanies.map((company) => (
                      <li key={`${company.id}-${cloneIndex}`} className="timeline-company-card" aria-label={company.name}>
                        <span className="timeline-company-logo-frame">
                          <img
                            className="timeline-company-logo"
                            src={company.asset}
                            alt={cloneIndex === 0 ? company.name : ''}
                            loading="lazy"
                            decoding="async"
                            fetchpriority="low"
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </motion.div>
          </div>
          <h2>My Journey</h2>
          <p className="timeline-subtitle">
            Product ownership, business analysis, product design, and education experience
            aligned with my latest CV.
          </p>
        </motion.header>

        <div className="timeline-road">
          <div className="timeline-road-visual" aria-hidden="true" ref={roadVisualRef}>
            <svg className="timeline-road-svg" viewBox="0 0 100 1040" preserveAspectRatio="none" ref={roadSvgRef}>
              <defs>
                <linearGradient id="timeline-road-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffddb8" />
                  <stop offset="48%" stopColor="#ffab6b" />
                  <stop offset="100%" stopColor="#ff7d3f" />
                </linearGradient>
              </defs>
              <path ref={roadPathRef} className="timeline-road-path" />
              <path ref={roadLaneRef} className="timeline-road-lane" />
              <path ref={roadProgressRef} className="timeline-road-progress" stroke="url(#timeline-road-gradient)" />
            </svg>

            <span ref={carRef} className="timeline-road-vehicle">
              <span className="timeline-road-jet-trail" />
              <img className="timeline-road-jet" src={planeImage} alt="" loading="lazy" decoding="async" fetchpriority="low" />
            </span>
          </div>

          <ol className="timeline-list">
            {timelineItems.map((item, index) => {
              const MilestoneIcon = iconByCategory[item.category] ?? FaBriefcase;
              const sideClass = index % 2 === 0 ? 'timeline-item--right' : 'timeline-item--left';
              const cardDelay = reduceMotion ? 0 : Math.min(index * 0.05, 0.35);

              return (
                <li className={`timeline-item ${sideClass}`} key={item.title}>
                  <span className="timeline-node-col" aria-hidden="true">
                    <motion.span
                      className="timeline-node"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                      whileInView={
                        reduceMotion
                          ? { opacity: 1, scale: 1 }
                          : {
                              opacity: 1,
                              scale: [1, 1.14, 1]
                            }
                      }
                      viewport={{ once: false, amount: 0.7 }}
                      transition={{
                        duration: reduceMotion ? 0.25 : 2,
                        repeat: reduceMotion ? 0 : Infinity,
                        ease: 'easeInOut',
                        delay: reduceMotion ? 0 : index * 0.06
                      }}
                    />
                  </span>

                  <motion.article
                    className={`timeline-card timeline-card--${item.category}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.26 }}
                    transition={{ duration: 0.66, delay: cardDelay, ease: ROAD_EASE }}
                  >
                    <div className="timeline-card-head">
                      <span className={`timeline-card-icon timeline-card-icon--${item.category}`}>
                        <MilestoneIcon aria-hidden="true" />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        {item.date ? <p className="timeline-date">{item.date}</p> : null}
                      </div>
                    </div>

                    <motion.ul
                      className="timeline-bullets"
                      variants={bulletParentVariants}
                      initial={reduceMotion ? false : 'hidden'}
                      whileInView="show"
                      viewport={{ once: true, amount: 0.55 }}
                    >
                      {item.bullets.map((bullet) => (
                        <motion.li variants={reduceMotion ? undefined : bulletVariants} key={bullet}>
                          {bullet}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
