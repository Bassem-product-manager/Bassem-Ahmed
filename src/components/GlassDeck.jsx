import { useEffect, useMemo, useRef, useState } from 'react';
import hisImage from '../assets/HIS.png';
import mospkatImage from '../assets/mospkat.png';
import narImage from '../assets/Nar.png';
import qqsImage from '../assets/QQ-test.png';
import sytarImage from '../assets/sytar.png';
import './glass-deck.css';

const CYCLE_DURATION_MS = 420;
const SWIPE_TRIGGER_PX = 42;
const MOVE_TOLERANCE_PX = 10;

const cards = [
  {
    id: 'nar',
    title: 'Naraakum',
    badge: 'Home Healthcare',
    desc: 'Naraakum is a platform for home healthcare, remote medical consultations, and remote blood pressure and glucose monitoring.',
    image: narImage,
    href: 'https://www.naraakum.com/',
    openLabel: 'Open Naraakum project'
  },
  {
    id: 'qqs',
    title: 'QQS',
    badge: 'Assessment Security',
    desc: 'QQS is a university exam management system in Saudi Arabia with strong AI-powered anti-cheating protection.',
    image: qqsImage,
    href: 'https://www.qqassessment.com/',
    openLabel: 'Open QQS project'
  },
  {
    id: 'his',
    title: 'HIS',
    badge: 'Healthcare Operations',
    desc: 'HIS provides complete healthcare center management, including social insurance integration and end-to-end billing solutions.',
    image: hisImage,
    href: null,
    openLabel: 'HIS project (no external link)'
  },
  {
    id: 'mospkat',
    title: 'Mospkat',
    badge: 'Competition Learning',
    desc: 'Mospkat provides courses for global competitions like Kangaroo for children and also organizes competition exams.',
    image: mospkatImage,
    href: 'https://www.musabakat.com/ar/index',
    openLabel: 'Open Mospkat project'
  },
  {
    id: 'sytar',
    title: 'Sytar',
    badge: 'Mental Health',
    desc: 'Sytar supports the mental health of Saudi citizens and also enables applying as a mental health doctor.',
    image: sytarImage,
    href: 'https://www.psyter.com/en/home-page',
    openLabel: 'Open Sytar project'
  }
];

const desktopSlots = [
  { x: 0, y: 0, z: 56, r: 0, scale: 1, opacity: 1, blur: 0, zIndex: 20 },
  { x: -140, y: 36, z: 34, r: -12, scale: 0.95, opacity: 0.9, blur: 0, zIndex: 16 },
  { x: -210, y: 74, z: 16, r: -20, scale: 0.9, opacity: 0.72, blur: 0.5, zIndex: 12 },
  { x: 140, y: 36, z: 34, r: 12, scale: 0.95, opacity: 0.9, blur: 0, zIndex: 16 },
  { x: 210, y: 74, z: 16, r: 20, scale: 0.9, opacity: 0.72, blur: 0.5, zIndex: 12 }
];

const mobileSlots = [
  { x: 0, y: 0, z: 46, r: 0, scale: 1, opacity: 1, blur: 0, zIndex: 20 },
  { x: -86, y: 28, z: 28, r: -10, scale: 0.95, opacity: 0.88, blur: 0, zIndex: 16 },
  { x: -128, y: 54, z: 14, r: -17, scale: 0.9, opacity: 0.66, blur: 0.6, zIndex: 12 },
  { x: 86, y: 28, z: 28, r: 10, scale: 0.95, opacity: 0.88, blur: 0, zIndex: 16 },
  { x: 128, y: 54, z: 14, r: 17, scale: 0.9, opacity: 0.66, blur: 0.6, zIndex: 12 }
];

const rotateNext = (order) => [...order.slice(1), order[0]];
const rotatePrev = (order) => [order[order.length - 1], ...order.slice(0, -1)];

function openExternal(href) {
  window.open(href, '_blank', 'noopener,noreferrer');
}

export default function GlassDeck() {
  const [order, setOrder] = useState(() => cards.map((_, index) => index));
  const [isCycling, setIsCycling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cycleTimerRef = useRef(0);
  const suppressTimerRef = useRef(0);
  const suppressClickRef = useRef(false);
  const pointerRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    pointerId: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncPreferences = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };

    syncPreferences();

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', syncPreferences);
      motionQuery.addEventListener('change', syncPreferences);
      return () => {
        mobileQuery.removeEventListener('change', syncPreferences);
        motionQuery.removeEventListener('change', syncPreferences);
      };
    }

    mobileQuery.addListener(syncPreferences);
    motionQuery.addListener(syncPreferences);
    return () => {
      mobileQuery.removeListener(syncPreferences);
      motionQuery.removeListener(syncPreferences);
    };
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(cycleTimerRef.current);
      window.clearTimeout(suppressTimerRef.current);
    },
    []
  );

  const slots = isMobile ? mobileSlots : desktopSlots;
  const deckItems = useMemo(
    () =>
      slots.map((slot, slotIndex) => ({
        slot,
        slotIndex,
        card: cards[order[slotIndex]]
      })),
    [order, slots]
  );

  const startCycleLock = () => {
    setIsCycling(true);
    window.clearTimeout(cycleTimerRef.current);
    cycleTimerRef.current = window.setTimeout(
      () => setIsCycling(false),
      reducedMotion ? 40 : CYCLE_DURATION_MS
    );
  };

  const cycleDeck = (direction = 'next') => {
    if (isCycling) return;
    startCycleLock();
    setOrder((prev) => (direction === 'next' ? rotateNext(prev) : rotatePrev(prev)));
  };

  const suppressNextClick = () => {
    suppressClickRef.current = true;
    window.clearTimeout(suppressTimerRef.current);
    suppressTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 260);
  };

  const frontItem = deckItems[0];

  const handleFrontCardClick = (event, card) => {
    if (suppressClickRef.current || isCycling) {
      event.preventDefault();
      return;
    }

    if (card.href) {
      openExternal(card.href);
    }
  };

  const handleFrontCardKeyDown = (event, card) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      cycleDeck('next');
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      cycleDeck('prev');
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();

    if (card.href) {
      openExternal(card.href);
    }
  };

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && !isMobile) return;

    pointerRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      pointerId: event.pointerId
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const pointer = pointerRef.current;
    if (!pointer.active || pointer.pointerId !== event.pointerId) return;

    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    if (Math.abs(dx) > MOVE_TOLERANCE_PX || Math.abs(dy) > MOVE_TOLERANCE_PX) {
      pointer.moved = true;
    }
  };

  const endPointer = (event) => {
    const pointer = pointerRef.current;
    if (!pointer.active || pointer.pointerId !== event.pointerId) return;

    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;

    pointerRef.current.active = false;
    pointerRef.current.pointerId = null;

    if (!pointer.moved) return;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < SWIPE_TRIGGER_PX) return;

    suppressNextClick();

    if (absX >= absY) {
      cycleDeck(dx < 0 ? 'next' : 'prev');
      return;
    }

    cycleDeck(dy < 0 ? 'next' : 'prev');
  };

  return (
    <section className="fanDeckSection" id="lastes-project" aria-labelledby="lastesProjectTitle">
      <div className="fanDeckWrap">
        <header className="fanDeckHeader">
          <h2 id="lastesProjectTitle">Lastes Project</h2>
          <p>Swipe or tap to move through featured product cards with a smooth fan-deck motion.</p>
        </header>

        <div
          className={`fanDeckStage${reducedMotion ? ' fanDeckStage--reduced' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
        >
          <ol className="fanDeckList">
            {deckItems.map(({ card, slot, slotIndex }) => {
              const isFront = slotIndex === 0;
              const isClickable = isFront && Boolean(card.href);

              return (
                <li
                  key={card.id}
                  className={`fanCard${isFront ? ' is-front' : ''}${isClickable ? ' is-clickable' : ''}${
                    card.id === 'his' ? ' fanCard--his' : ''
                  }`}
                  style={{
                    '--tx': `${slot.x}px`,
                    '--ty': `${slot.y}px`,
                    '--tz': `${slot.z}px`,
                    '--rz': `${slot.r}deg`,
                    '--scale': slot.scale,
                    '--opacity': slot.opacity,
                    '--blur': `${slot.blur}px`,
                    '--z': slot.zIndex
                  }}
                  tabIndex={isFront ? 0 : -1}
                  role={isFront ? 'button' : 'group'}
                  aria-label={isFront ? card.openLabel : undefined}
                  onClick={(event) => {
                    if (!isFront) return;
                    handleFrontCardClick(event, card);
                  }}
                  onKeyDown={(event) => {
                    if (!isFront) return;
                    handleFrontCardKeyDown(event, card);
                  }}
                >
                  {isFront ? (
                    <button
                      type="button"
                      className="fanCard__next"
                      aria-label="Next project card"
                      onClick={(event) => {
                        event.stopPropagation();
                        cycleDeck('next');
                      }}
                    >
                      <span aria-hidden="true">{'>'}</span>
                    </button>
                  ) : null}

                  <div className="fanCard__head">
                    <span className="fanCard__dot" aria-hidden="true" />
                    <p>{card.badge}</p>
                  </div>

                  <h3>{card.title}</h3>

                  <div className="fanCard__media" aria-hidden="true">
                    <img src={card.image} alt="" loading="lazy" decoding="async" fetchPriority="low" />
                  </div>

                  <p className="fanCard__desc">{card.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
