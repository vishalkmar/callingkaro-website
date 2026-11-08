// Draws the CallingKaro app UI (our own screens: dialpad -> in-call) on a 2D canvas.
// The 3D phone uses it as its screen texture; a 12 s loop types a number, places the call and talks.

export const SCREEN_W = 540;
export const SCREEN_H = 1140;
export const LOOP_SECONDS = 12;

export const C = {
  orange: '#FF7A45',
  orangeDeep: '#E8622E',
  green: '#3BB54A',
  red: '#F2564B',
  ink: '#222831',
  sub: '#6B7280',
  line: '#E5E7EB',
  lav1: '#ECEBF3',
  lav2: '#D9D7EE',
};

const NUMBER = '9876543210';
const KEYS = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
  ['*', ''],
  ['0', '+'],
  ['#', ''],
];

export const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const formatNumber = digits => (digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits);

export const statusBar = (ctx, dark) => {
  ctx.fillStyle = dark ? '#fff' : C.ink;
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('9:41', 40, 52);
  ctx.textAlign = 'right';
  ctx.fillText('5G  ▮▮▮', SCREEN_W - 40, 52);
};

export const phoneGlyph = (ctx, x, y, s, color, rotate = 0) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.scale(s / 24, s / 24);
  ctx.translate(-12, -12);
  ctx.fillStyle = color;
  ctx.fill(
    new Path2D(
      'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z',
    ),
  );
  ctx.restore();
};

const drawDialpad = (ctx, typed, pressedKey, callPressed) => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  // header
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, 0, SCREEN_W, 170);
  statusBar(ctx, true);
  ctx.fillStyle = '#fff';
  ctx.font = '800 38px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CallingKaro', 40, 128);
  // balance pill
  rr(ctx, SCREEN_W - 210, 96, 170, 48, 24);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('12 min left', SCREEN_W - 125, 128);
  // tabs
  const tabs = ['Dialpad', 'Contacts', 'Recent', 'Minutes'];
  tabs.forEach((t, i) => {
    const x = 40 + i * 120;
    ctx.fillStyle = i === 0 ? '#AE5330' : C.sub;
    ctx.font = `${i === 0 ? 700 : 600} 21px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(t, x, 214);
  });
  ctx.fillStyle = C.orange;
  ctx.fillRect(40, 230, 78, 4);
  ctx.fillStyle = C.line;
  ctx.fillRect(0, 236, SCREEN_W, 2);

  // number display
  rr(ctx, 40, 290, 92, 44, 22);
  ctx.fillStyle = '#F1F3F2';
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('IN +91', 86, 319);
  ctx.font = '300 54px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(formatNumber(typed) || ' ', SCREEN_W / 2 + 30, 330);
  if (typed.length) {
    // caret
    ctx.fillStyle = C.orange;
    const w = ctx.measureText(formatNumber(typed)).width;
    ctx.fillRect(SCREEN_W / 2 + 30 + w / 2 + 6, 290, 3, 50);
  }
  ctx.fillStyle = C.sub;
  ctx.font = '500 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(typed.length === 10 ? 'Mobile - India' : 'Enter a number', SCREEN_W / 2, 385);

  // keypad
  const top = 440;
  const cw = 150;
  const ch = 118;
  KEYS.forEach(([d, l], i) => {
    const cx = SCREEN_W / 2 + ((i % 3) - 1) * cw;
    const cy = top + Math.floor(i / 3) * ch + ch / 2;
    if (pressedKey === d) {
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF1EA';
      ctx.fill();
    }
    ctx.fillStyle = C.ink;
    ctx.font = '300 50px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d, cx, cy + 10);
    if (l) {
      ctx.fillStyle = C.sub;
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(l, cx, cy + 36);
    }
  });

  // call button
  const by = top + 4 * ch + 70;
  ctx.beginPath();
  ctx.arc(SCREEN_W / 2, by, callPressed ? 50 : 56, 0, Math.PI * 2);
  ctx.fillStyle = C.green;
  ctx.shadowColor = 'rgba(59,181,74,0.45)';
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.shadowBlur = 0;
  phoneGlyph(ctx, SCREEN_W / 2, by, 46, '#fff');
};

export const drawInCall = (ctx, seconds, connected) => {
  const g = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
  g.addColorStop(0, C.lav1);
  g.addColorStop(1, C.lav2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  // soft shapes (like the app)
  ctx.fillStyle = 'rgba(201,197,232,0.55)';
  ctx.beginPath();
  ctx.arc(SCREEN_W - 40, 280, 170, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(30, 640, 110, 0, Math.PI * 2);
  ctx.fill();
  statusBar(ctx, false);

  ctx.textAlign = 'center';
  ctx.fillStyle = C.ink;
  ctx.font = '700 50px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Ravi Sharma', SCREEN_W / 2, 190);
  ctx.fillStyle = C.sub;
  ctx.font = '500 25px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('+91 98765 43210  India', SCREEN_W / 2, 236);

  // status pill + timer
  rr(ctx, SCREEN_W / 2 - 150, 268, 160, 44, 22);
  ctx.fillStyle = C.ink;
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('via internet', SCREEN_W / 2 - 70, 297);
  ctx.fillStyle = C.ink;
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(Math.floor(seconds % 60)).padStart(2, '0');
  ctx.fillText(connected ? `${mm}:${ss}` : 'Ringing...', SCREEN_W / 2 + 90, 299);
  ctx.fillStyle = C.sub;
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(connected ? `Balance: ${12 - Math.floor(seconds / 60)} min left` : 'Calling over Wi-Fi / 5G', SCREEN_W / 2, 350);

  // avatar with pulse rings while ringing
  const ax = SCREEN_W / 2;
  const ay = 540;
  if (!connected) {
    const p = (seconds % 1.2) / 1.2;
    ctx.strokeStyle = `rgba(255,122,69,${1 - p})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(ax, ay, 90 + p * 70, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(ax, ay, 90, 0, Math.PI * 2);
  ctx.fillStyle = C.orange;
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '700 64px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('RS', ax, ay + 22);

  // controls
  const labels = ['Notes', 'Mute', 'Hold', 'Keypad', 'Contacts', 'Speaker'];
  labels.forEach((l, i) => {
    const cx = SCREEN_W / 2 + ((i % 3) - 1) * 160;
    const cy = 770 + Math.floor(i / 3) * 140;
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = l === 'Speaker' && connected ? C.orange : 'rgba(255,255,255,0.75)';
    ctx.fill();
    ctx.fillStyle = l === 'Speaker' && connected ? '#fff' : C.ink;
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(l[0], cx, cy + 8);
    ctx.fillStyle = C.ink;
    ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(l, cx, cy + 70);
  });

  // end call
  ctx.beginPath();
  ctx.arc(SCREEN_W / 2, 1050, 56, 0, Math.PI * 2);
  ctx.fillStyle = C.red;
  ctx.fill();
  phoneGlyph(ctx, SCREEN_W / 2, 1050, 46, '#fff', (135 * Math.PI) / 180);
};

/**
 * Paints the frame for time t (seconds). Returns a key that changes only when the picture changes,
 * so the texture is re-uploaded a few times per second instead of every frame.
 */
export const drawScreen = (ctx, t) => {
  const s = t % LOOP_SECONDS;
  if (s < 4.6) {
    const n = Math.min(NUMBER.length, Math.floor(s / 0.38));
    const pressing = n < NUMBER.length && s % 0.38 < 0.16 ? NUMBER[n] : null;
    drawDialpad(ctx, NUMBER.slice(0, n), pressing, false);
    return `d${n}${pressing || ''}`;
  }
  if (s < 5.2) {
    drawDialpad(ctx, NUMBER, null, true);
    return 'press';
  }
  const inCall = s - 5.2;
  const connected = inCall > 1.6;
  const shown = connected ? (inCall - 1.6) * 9 : inCall; // talk time runs fast in the demo
  drawInCall(ctx, connected ? shown : inCall, connected);
  return connected ? `c${Math.floor(shown)}` : `r${Math.floor(inCall * 10)}`;
};
