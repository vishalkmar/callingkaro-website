import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SITE } from '../content';

const PATHS = {
  download: 'M12 3v12m0 0 5-5m-5 5-5-5M4 19h16',
  dial: 'M6 5h.01M12 5h.01M18 5h.01M6 11h.01M12 11h.01M18 11h.01M6 17h.01M12 17h.01M18 17h.01',
  wifi: 'M2 8.8a15 15 0 0 1 20 0M5 12.4a10 10 0 0 1 14 0M8.5 15.9a5 5 0 0 1 7 0M12 19.5h.01',
  coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v8m-2.5-6h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 21V7m0 0H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7Zm0 0h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7Z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4',
  controls: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  check: 'm5 12 5 5L20 7',
  plus: 'M12 5v14M5 12h14',
  phone:
    'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Zm6 4v2',
  alert: 'M12 3 2 20h20L12 3Zm0 6v5m0 3h.01',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  trash: 'M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3',
  android:
    'M7 10v6m10-6v6M8.5 4.5 7 3m8.5 1.5L17 3M6 9a6 6 0 0 1 12 0v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Zm3-3h.01M15 6h.01M9 18v3m6-3v3',
};

export const Icon = ({ name, size = 24, stroke = 2, fill = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d={PATHS[name]}
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Tick = () => (
  <span className="tick">
    <Icon name="check" size={13} stroke={3} />
  </span>
);

/** The one download action of the page: a direct APK link (not the Play Store). */
export const DownloadButton = ({ size = 'lg', label = 'Download APK', className = '' }) => (
  <a
    className={`btn btn-primary btn-${size} ${className}`}
    href={SITE.apkUrl}
    download="CallingKaro.apk"
    type="application/vnd.android.package-archive"
    aria-label={`${label} - CallingKaro for Android, version ${SITE.apkVersion}, ${SITE.apkSize}`}
  >
    <span className="btn-icon">
      <Icon name="download" size={size === 'sm' ? 16 : 20} stroke={2.4} />
    </span>
    <span>
      {label}
      {size === 'lg' ? (
        <span className="btn-sub">
          v{SITE.apkVersion} · {SITE.apkSize} · {SITE.minAndroid}
        </span>
      ) : null}
    </span>
  </a>
);

const reveal = {
  hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
  show: i => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Fades, un-blurs and lifts its child into view on scroll; `i` staggers siblings. */
export const Reveal = ({ as = 'div', i = 0, children, ...rest }) => {
  const M = motion[as];
  return (
    <M variants={reveal} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} {...rest}>
      {children}
    </M>
  );
};

/** Heading whose words rise one by one out of a mask. The full text stays in the HTML for SEO. */
export const WordsReveal = ({ text, as = 'h2', className = '', id }) => {
  const M = motion[as];
  const words = text.split(' ');
  return (
    <M
      id={id}
      className={`words ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.06 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span className="word" aria-hidden="true">
            <motion.span
              className="word-in"
              variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }}
            >
              {w}
            </motion.span>
          </span>
          {/* the space lives outside the clipped box, or the browser drops it */}
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </M>
  );
};

/** "1 sec", "4", "1,000" - counts up when scrolled into view; the final value is in the pre-rendered HTML. */
export const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const match = /^([\d,]+)(.*)$/.exec(value);
  const end = match ? Number(match[1].replace(/,/g, '')) : null;
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!inView || end === null) {
      return undefined;
    }
    const controls = animate(0, end, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setShown(`${Math.round(v).toLocaleString('en-IN')}${match[2]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return <span ref={ref}>{shown}</span>;
};

const TONES = {
  orange: ['#FFB088', '#FF7A45', '#C94A17'],
  green: ['#9BE7A8', '#3BB54A', '#1F7A2C'],
  violet: ['#C7BEFF', '#7C6CF0', '#4B3CC4'],
  blue: ['#A9C8FF', '#5B8DEF', '#2C5BC2'],
  pink: ['#FFB3D5', '#EC4899', '#A61E63'],
  teal: ['#9FECE0', '#14B8A6', '#0B7A6E'],
};

/** Glossy "clay" 3D icon tile that tilts toward the pointer. */
export const Icon3D = ({ name, tone = 'orange', size = 64 }) => {
  const [a, b, c] = TONES[tone] || TONES.orange;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 15 });
  const sry = useSpring(ry, { stiffness: 200, damping: 15 });
  const shadowX = useTransform(sry, v => `${-v * 0.6}px`);
  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 30);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 30);
  };
  return (
    <motion.div
      className="icon3d"
      style={{
        width: size,
        height: size,
        rotateX: srx,
        rotateY: sry,
        '--a': a,
        '--b': b,
        '--c': c,
        '--sx': shadowX,
      }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <span className="icon3d-glyph">
        <Icon name={name} size={size * 0.46} stroke={2.4} />
      </span>
    </motion.div>
  );
};
