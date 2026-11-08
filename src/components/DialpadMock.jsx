import React from 'react';

// HTML version of the app's dialpad: shown before the 3D scene loads (and in pre-rendered HTML),
// and in the install section. Our own UI - no third-party screenshots.
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

const s = {
  head: { background: '#FF7A45', color: '#fff', padding: '30px 18px 12px' },
  brand: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: 18 },
  pill: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,.22)' },
  tabs: { display: 'flex', gap: 14, padding: '10px 18px 8px', fontSize: 11, fontWeight: 600, color: '#676D7B', borderBottom: '1px solid #E5E7EB' },
  num: { textAlign: 'center', fontSize: 26, fontWeight: 300, padding: '22px 0 4px', letterSpacing: '0.02em' },
  hint: { textAlign: 'center', fontSize: 11, color: '#676D7B' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', rowGap: 10, padding: '16px 22px 0' },
  key: { textAlign: 'center', fontSize: 24, fontWeight: 300 },
  call: {
    width: 54,
    height: 54,
    margin: '14px auto 0',
    borderRadius: '50%',
    background: '#3BB54A',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 8px 18px -6px rgba(59,181,74,.6)',
  },
};

const DialpadMock = () => (
  <div className="css-phone" role="img" aria-label="CallKaro app dialpad with the number 98765 43210 typed in">
    <div className="css-phone-screen">
      <div style={s.head}>
        <div style={s.brand}>
          CallKaro <span style={s.pill}>12 min left</span>
        </div>
      </div>
      <div style={s.tabs}>
        <span style={{ color: '#AE5330', fontWeight: 700 }}>Dialpad</span>
        <span>Contacts</span>
        <span>Recent</span>
        <span>Minutes</span>
      </div>
      <div style={s.num}>98765 43210</div>
      <div style={s.hint}>Mobile - India</div>
      <div style={s.grid}>
        {KEYS.map(k => (
          <div key={k} style={s.key}>
            {k}
          </div>
        ))}
      </div>
      <div style={s.call}>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#fff"
            d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default DialpadMock;
