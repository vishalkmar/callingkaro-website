import React, { useEffect, useState } from 'react';
import { NAV } from '../content';
import { DownloadButton } from './ui';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap header-row">
        <a className="brand" href="#top" aria-label="CallKaro home">
          <img className="brand-mark" src="/favicon.svg" alt="" width="34" height="34" />
          CallKaro
        </a>
        <nav className="nav" aria-label="Main">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <DownloadButton size="sm" />
      </div>
    </header>
  );
};

export default Header;
