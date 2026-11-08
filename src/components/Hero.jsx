import React from 'react';
import { motion } from 'framer-motion';
import { HERO, STATS, SITE } from '../content';
import { DownloadButton, Icon, Tick, CountUp } from './ui';
import DialpadMock from './DialpadMock';

// The headline and intro are visible in the pre-rendered HTML (fast first paint / SEO): they only slide.
const slide = (delay = 0) => ({
  initial: { y: 18 },
  animate: { y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const FloatChip = ({ style, icon, green, title, sub, delay, className = '' }) => (
  <motion.div
    className={`float-chip ${className}`}
    style={style}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
    transition={{ opacity: { delay }, scale: { delay }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } }}
  >
    <span className={`chip-icon${green ? ' green' : ''}`}>
      <Icon name={icon} size={18} />
    </span>
    <span>
      {title}
      <small>{sub}</small>
    </span>
  </motion.div>
);

const Hero = () => {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="bg-glow">
        <div className="bg-grid" />
      </div>
      <div className="wrap hero-grid" id="download">
        <div>
          <motion.span className="eyebrow" {...up(0)}>
            <span className="eyebrow-dot" />
            {HERO.eyebrow}
          </motion.span>
          <motion.h1 id="hero-title" {...slide(0.08)}>
            {HERO.title[0]} <span className="accent">{HERO.title[1]}</span>
          </motion.h1>
          <motion.p className="hero-hindi" lang="hi-Latn" {...slide(0.16)}>
            {HERO.hindi}
          </motion.p>
          <motion.p className="hero-text" {...slide(0.22)}>
            {HERO.text}
          </motion.p>
          <motion.div className="hero-cta" {...slide(0.3)}>
            <DownloadButton />
            <a className="btn btn-ghost btn-glass" href="#install">
              How it works
            </a>
          </motion.div>
          <motion.p className="hero-note" {...up(0.36)}>
            Direct download from the official site - not on the Play Store yet. Free to install; calls use credits.
          </motion.p>
          <motion.ul className="hero-points" {...up(0.42)}>
            {HERO.points.map(p => (
              <li key={p}>
                <Tick />
                {p}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="stage phone-anchor"
          data-phone
          data-screen="dialpad"
          data-prop="coins"
          data-rot="8,-22,0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* shown until the 3D phone is ready, and on phones without WebGL */}
          <div className="stage-fallback">
            <DialpadMock />
          </div>
          <FloatChip style={{ top: '2%', left: '0%' }} icon="coin" title="1000 credits = 1 min" sub="billed per second" delay={0.9} />
          <FloatChip
            style={{ bottom: '18%', right: '0%' }}
            icon="phone"
            green
            title="Ringing Jio, Airtel, Vi..."
            sub="no app needed on their phone"
            delay={1.2}
          />
          <FloatChip
            className="hide-sm"
            style={{ bottom: '4%', left: '8%' }}
            icon="gift"
            title="Daily free spin"
            sub="+ rewarded videos"
            delay={1.5}
          />
        </motion.div>
      </div>

      <div className="wrap stats" role="list" aria-label={`${SITE.name} in numbers`}>
        {STATS.map((s, i) => (
          <motion.div
            className="stat glass"
            role="listitem"
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
          >
            <div className="stat-value">
              <CountUp value={s.value} />
            </div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
