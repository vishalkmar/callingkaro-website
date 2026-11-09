import React from 'react';
import { motion } from 'framer-motion';
import { STORY, STEPS, CREDIT_WAYS, CREDIT_EXAMPLES, SAFETY, INSTALL_STEPS, FAQ, KEYWORDS, SITE, NAV } from '../content';
import { CountUp, DownloadButton, Icon, Icon3D, Reveal, WordsReveal } from './ui';

const TONES = ['orange', 'green', 'violet', 'blue', 'pink', 'teal'];

/** A row with a 3D icon: used by every chapter's list. */
const IconRow = ({ icon, tone, title, text, i }) => (
  <Reveal as="li" className="icon-row" i={i}>
    <Icon3D name={icon} tone={tone} size={58} />
    <div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  </Reveal>
);

const RateCard = () => (
  <Reveal className="glass glass-dark rate-card" i={1}>
    <div className="rate-big">
      <b>
        <CountUp value="1,000" />
      </b>
      <span>credits = 1 minute</span>
    </div>
    <table className="rate-table">
      <caption className="sr-only">Example call costs</caption>
      <thead>
        <tr>
          <th scope="col">Talk time</th>
          <th scope="col">Credits used</th>
        </tr>
      </thead>
      <tbody>
        {CREDIT_EXAMPLES.map(r => (
          <tr key={r.talk}>
            <td>{r.talk}</td>
            <td>{r.credits}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Reveal>
);

const Ways = () => (
  <ul className="ways">
    {CREDIT_WAYS.map((w, i) => (
      <Reveal as="li" className="glass way" i={i} key={w.title}>
        <span className={`way-tag${w.tag === 'Paid' ? ' paid' : ''}`}>{w.tag}</span>
        <h3>{w.title}</h3>
        <p>{w.text}</p>
      </Reveal>
    ))}
  </ul>
);

const InstallBlock = () => (
  <>
    <ol className="steps">
      {STEPS.map((s, i) => (
        <Reveal as="li" className="glass step" i={i} key={s.n}>
          <span className="step-n">{s.n}</span>
          <div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </Reveal>
      ))}
    </ol>
    <Reveal className="install-guide" i={1}>
      <h3>Installing the APK</h3>
      <ol>
        {INSTALL_STEPS.map(s => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <DownloadButton />
    </Reveal>
  </>
);

/** Extra content per chapter, after its heading. */
const EXTRA = {
  credits: () => <RateCard />,
  rewards: () => <Ways />,
  safety: () => (
    <ul className="icon-list">
      {SAFETY.map((s, i) => (
        <IconRow key={s.title} icon={['lock', 'alert', 'flag', 'trash'][i]} tone={['green', 'pink', 'violet', 'blue'][i]} title={s.title} text={s.text} i={i} />
      ))}
    </ul>
  ),
  install: () => <InstallBlock />,
};

const Chapter = ({ ch, n }) => {
  const Extra = EXTRA[ch.id];
  return (
    <section className={`story story-${ch.textSide}`} id={ch.id} aria-labelledby={`${ch.id}-title`}>
      <div className="wrap story-grid">
        <div className="story-text">
          <Reveal className="chapter-tag">
            <span className="chapter-n">{String(n).padStart(2, '0')}</span>
            <span className="kicker">{ch.kicker}</span>
          </Reveal>
          <WordsReveal id={`${ch.id}-title`} text={ch.title} className="story-title" />
          <Reveal as="p" className="story-hindi" lang="hi" i={1}>
            {ch.hindi}
          </Reveal>
          <Reveal as="p" className="story-lead" i={2}>
            {ch.lead}
          </Reveal>
          {ch.items.length ? (
            <ul className="icon-list">
              {ch.items.map((f, i) => (
                <IconRow key={f.title} icon={f.icon} tone={TONES[(n + i) % TONES.length]} title={f.title} text={f.text} i={i} />
              ))}
            </ul>
          ) : null}
          {Extra ? <Extra /> : null}
        </div>
        <div
          className="phone-anchor story-anchor"
          data-phone
          data-screen={ch.screen}
          data-prop={ch.prop}
          data-rot={ch.rot}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export const Story = () => (
  <div className="story-wrap">
    {STORY.map((ch, i) => (
      <Chapter ch={ch} n={i + 1} key={ch.id} />
    ))}
  </div>
);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export const Faq = () => (
  <section className="section" id="faq" aria-labelledby="faq-title">
    <div className="wrap">
      <div className="section-head center">
        <Reveal className="kicker">FAQ</Reveal>
        <WordsReveal id="faq-title" text="Questions, answered." />
        <Reveal as="p" className="story-hindi" lang="hi" i={1}>
          आपके सवाल, हमारे जवाब
        </Reveal>
      </div>
      <div className="faq">
        {FAQ.map((f, i) => (
          <Reveal as="details" className="glass" i={i % 4} key={f.q}>
            <summary>
              {f.q}
              <span className="faq-plus">
                <Icon name="plus" size={16} stroke={2.6} />
              </span>
            </summary>
            <p className="faq-a">{f.a}</p>
          </Reveal>
        ))}
      </div>
      {/* Google FAQ rich results - same text as above */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  </section>
);

export const FinalCta = () => (
  <section className="section" aria-labelledby="cta-title">
    <div className="wrap">
      <Reveal className="cta-card">
        <svg className="cta-rings" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <motion.circle
              key={i}
              cx="400"
              cy="200"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
              style={{ transformOrigin: '400px 200px' }}
            />
          ))}
        </svg>
        <p className="cta-hindi" lang="hi">
          अब इंटरनेट से कॉल करो
        </p>
        <h2 id="cta-title">Ab internet se calling karo.</h2>
        <p>Download CallingKaro, claim your welcome credits and make your first call today.</p>
        <DownloadButton />
      </Reveal>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="footer">
    <div className="wrap">
      <div className="footer-row">
        <a className="brand" href="#top">
          <img className="brand-mark" src="/favicon.svg" alt="" width="38" height="38" />
          <span className="brand-word">
            Calling<span className="brand-karo">Karo</span>
          </span>
        </a>
        <nav className="footer-links" aria-label="Footer">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
          <a href={SITE.privacyUrl} rel="noopener">
            Privacy Policy
          </a>
          <a href={SITE.termsUrl} rel="noopener">
            Terms of Use
          </a>
          {SITE.supportEmail ? <a href={`mailto:${SITE.supportEmail}`}>Support</a> : null}
        </nav>
      </div>
      <p className="footer-keywords">
        CallingKaro is an internet calling app for India: {KEYWORDS.join(' · ')}. Not for emergency calls - dial 112 from your
        phone dialer. Credits have no cash value. © {new Date().getFullYear()} CallingKaro.
      </p>
    </div>
  </footer>
);
