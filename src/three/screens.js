// The phone's screen for each story chapter (our own CallKaro UI drawn on a 2D canvas).
// Each draw function returns a key that changes only when the picture changes (texture re-upload).
import { SCREEN_W, SCREEN_H, C, rr, statusBar, phoneGlyph, drawInCall, drawScreen } from './screenArt';

const FONT = '"Plus Jakarta Sans", sans-serif';
const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

const header = (ctx, title, sub) => {
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, 0, SCREEN_W, 170);
  statusBar(ctx, true);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.font = `800 36px ${FONT}`;
  ctx.fillText(title, 40, 126);
  if (sub) {
    ctx.font = `600 21px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText(sub, SCREEN_W - 40, 126);
  }
};

const drawCredits = (ctx, t) => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  header(ctx, 'Get minutes');
  const s = t % 8;
  const bonus = s > 1.2 && s < 3.4;
  const credits = Math.round(10450 + 2000 * ease((s - 1.2) / 1.2));

  const g = ctx.createLinearGradient(40, 210, SCREEN_W - 40, 420);
  g.addColorStop(0, '#FF8A57');
  g.addColorStop(1, '#E8622E');
  rr(ctx, 40, 210, SCREEN_W - 80, 220, 32);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `600 22px ${FONT}`;
  ctx.fillText('Your balance', 76, 262);
  ctx.fillStyle = '#fff';
  ctx.font = `800 64px ${FONT}`;
  ctx.fillText(credits.toLocaleString('en-IN'), 76, 340);
  ctx.font = `600 24px ${FONT}`;
  ctx.fillText(`credits  =  ${Math.floor(credits / 1000)} min ${Math.round(((credits % 1000) / 1000) * 60)} s`, 76, 390);
  if (bonus) {
    rr(ctx, SCREEN_W - 200, 236, 128, 44, 22);
    ctx.fillStyle = '#E8F8EC';
    ctx.fill();
    ctx.fillStyle = '#2E9A3C';
    ctx.font = `800 22px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('+2,000', SCREEN_W - 136, 266);
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = C.ink;
  ctx.font = `800 28px ${FONT}`;
  ctx.fillText('Minute packs', 40, 500);
  [
    ['80 minutes', 'no expiration'],
    ['170 minutes', 'best value'],
    ['450 minutes', 'no expiration'],
  ].forEach(([m, sub], i) => {
    const y = 530 + i * 128;
    rr(ctx, 40, y, SCREEN_W - 80, 108, 24);
    ctx.fillStyle = '#F7F7F8';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, y + 54, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF1EA';
    ctx.fill();
    phoneGlyph(ctx, 100, y + 54, 28, C.orange);
    ctx.fillStyle = C.ink;
    ctx.font = `700 26px ${FONT}`;
    ctx.fillText(m, 150, y + 50);
    ctx.fillStyle = i === 1 ? '#AE5330' : C.sub;
    ctx.font = `600 19px ${FONT}`;
    ctx.fillText(sub, 150, y + 80);
    rr(ctx, SCREEN_W - 170, y + 30, 100, 48, 24);
    ctx.strokeStyle = C.green;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#2E9A3C';
    ctx.font = `700 21px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('Buy', SCREEN_W - 120, y + 61);
    ctx.textAlign = 'left';
  });

  rr(ctx, 40, 930, SCREEN_W - 80, 140, 28);
  ctx.fillStyle = '#EAF7EC';
  ctx.fill();
  ctx.fillStyle = '#1F6E2A';
  ctx.font = `800 26px ${FONT}`;
  ctx.fillText('Earn free credits', 76, 990);
  ctx.font = `600 20px ${FONT}`;
  ctx.fillText('Watch a video  ·  Daily spin', 76, 1032);
  return `cr${credits}${bonus ? 'p' : ''}`;
};

// Same prizes as the app's wheel: mostly 5, sometimes 10, 20 on the wheel.
const SEGMENTS = [
  ['5', C.orange],
  ['10', C.green],
  ['5', '#FFB088'],
  ['20', '#7C6CF0'],
  ['5', C.orange],
  ['10', C.green],
  ['5', '#FFB088'],
  ['20', '#7C6CF0'],
];

const drawSpin = (ctx, t) => {
  ctx.fillStyle = '#FFF8F4';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  header(ctx, 'Daily spin', '1 free spin');
  const s = t % 7;
  const won = s > 3.9;
  // lands on a "5" segment (the pointer is at the top)
  const angle = ease((s - 0.6) / 3.2) * Math.PI * 2 * 5 - Math.PI / 2 - Math.PI / 8;
  const cx = SCREEN_W / 2;
  const cy = 560;
  const r = 210;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  SEGMENTS.forEach(([label, color], i) => {
    const a0 = (i / SEGMENTS.length) * Math.PI * 2;
    const a1 = ((i + 1) / SEGMENTS.length) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.save();
    ctx.rotate((a0 + a1) / 2);
    ctx.fillStyle = '#fff';
    ctx.font = `800 40px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(label, r * 0.66, 14);
    ctx.restore();
  });
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 16;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 56, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.font = `800 26px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('SPIN', cx, cy + 9);
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy - r - 34);
  ctx.lineTo(cx + 22, cy - r - 34);
  ctx.lineTo(cx, cy - r + 6);
  ctx.closePath();
  ctx.fillStyle = C.ink;
  ctx.fill();

  if (won) {
    rr(ctx, 70, 860, SCREEN_W - 140, 150, 32);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.12)';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#2E9A3C';
    ctx.font = `800 50px ${FONT}`;
    ctx.fillText('+5 credits', cx, 935);
    ctx.fillStyle = C.sub;
    ctx.font = `600 21px ${FONT}`;
    ctx.fillText('Next free spin in 24 h', cx, 978);
  } else {
    rr(ctx, 110, 880, SCREEN_W - 220, 92, 46);
    ctx.fillStyle = C.orange;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 30px ${FONT}`;
    ctx.fillText('Spin now', cx, 936);
  }
  return `sp${Math.round(angle * 60)}${won ? 'w' : ''}`;
};

const CONTACTS = [
  ['A', 'Aarav Mehta', '#FF7A45'],
  ['A', 'Ananya Iyer', '#3BB54A'],
  ['D', 'Deepak Kumar', '#5B8DEF'],
  ['M', 'Maa', '#EC4899'],
  ['P', 'Priya Nair', '#A66CFF'],
  ['R', 'Ravi Sharma', '#F5A623'],
  ['S', 'Sana Khan', '#14B8A6'],
];

const drawContacts = (ctx, t) => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  header(ctx, 'Contacts');
  rr(ctx, 40, 200, SCREEN_W - 80, 96, 24);
  ctx.fillStyle = '#EAF7EC';
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1F6E2A';
  ctx.font = `800 22px ${FONT}`;
  ctx.fillText('Stored on this phone only', 120, 240);
  ctx.font = `600 18px ${FONT}`;
  ctx.fillText('Never uploaded to any server', 120, 270);
  ctx.strokeStyle = '#2E9A3C';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(80, 240, 12, Math.PI, 0);
  ctx.stroke();
  rr(ctx, 62, 240, 36, 30, 6);
  ctx.fillStyle = '#2E9A3C';
  ctx.fill();

  rr(ctx, 40, 320, SCREEN_W - 80, 64, 32);
  ctx.fillStyle = '#F1F3F2';
  ctx.fill();
  ctx.fillStyle = C.sub;
  ctx.font = `500 22px ${FONT}`;
  ctx.fillText('Search contacts', 80, 360);

  const offset = (t * 18) % (CONTACTS.length * 110);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 400, SCREEN_W, SCREEN_H - 400);
  ctx.clip();
  CONTACTS.concat(CONTACTS).forEach(([, name, color], i) => {
    const y = 420 + i * 110 - offset;
    ctx.beginPath();
    ctx.arc(90, y + 40, 34, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `700 26px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(name[0], 90, y + 50);
    ctx.textAlign = 'left';
    ctx.fillStyle = C.ink;
    ctx.font = `700 25px ${FONT}`;
    ctx.fillText(name, 148, y + 36);
    ctx.fillStyle = C.sub;
    ctx.font = `500 19px ${FONT}`;
    ctx.fillText('Mobile', 148, y + 64);
    ctx.beginPath();
    ctx.arc(SCREEN_W - 80, y + 40, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#EAF7EC';
    ctx.fill();
    phoneGlyph(ctx, SCREEN_W - 80, y + 40, 26, C.green);
  });
  ctx.restore();
  return `ct${Math.round(offset)}`;
};

const drawInstall = (ctx, t) => {
  const s = t % 7;
  const p = ease((s - 1.2) / 2.6);
  const cx = SCREEN_W / 2;
  ctx.fillStyle = '#F3F4F6';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, false);
  rr(ctx, cx - 80, 230, 160, 160, 40);
  ctx.fillStyle = C.orange;
  ctx.fill();
  phoneGlyph(ctx, cx, 310, 90, '#fff');
  ctx.textAlign = 'center';
  ctx.fillStyle = C.ink;
  ctx.font = `800 44px ${FONT}`;
  ctx.fillText('CallKaro', cx, 460);
  ctx.fillStyle = C.sub;
  ctx.font = `600 22px ${FONT}`;
  ctx.fillText('v1.0.0  ·  65 MB', cx, 500);

  if (s < 1.2) {
    ctx.fillStyle = C.ink;
    ctx.font = `600 26px ${FONT}`;
    ctx.fillText('Do you want to install this app?', cx, 640);
    rr(ctx, 70, 720, 180, 80, 40);
    ctx.fillStyle = '#E5E7EB';
    ctx.fill();
    rr(ctx, SCREEN_W - 250, 720, 180, 80, 40);
    ctx.fillStyle = C.orange;
    ctx.fill();
    ctx.fillStyle = C.ink;
    ctx.font = `700 26px ${FONT}`;
    ctx.fillText('Cancel', 160, 770);
    ctx.fillStyle = '#fff';
    ctx.fillText('Install', SCREEN_W - 160, 770);
  } else if (p < 1) {
    ctx.fillStyle = C.ink;
    ctx.font = `600 26px ${FONT}`;
    ctx.fillText('Installing...', cx, 640);
    rr(ctx, 80, 690, SCREEN_W - 160, 18, 9);
    ctx.fillStyle = '#E5E7EB';
    ctx.fill();
    rr(ctx, 80, 690, Math.max(18, (SCREEN_W - 160) * p), 18, 9);
    ctx.fillStyle = C.orange;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(cx, 640, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#EAF7EC';
    ctx.fill();
    ctx.strokeStyle = '#2E9A3C';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx - 20, 642);
    ctx.lineTo(cx - 4, 658);
    ctx.lineTo(cx + 22, 626);
    ctx.stroke();
    ctx.fillStyle = C.ink;
    ctx.font = `700 28px ${FONT}`;
    ctx.fillText('App installed', cx, 730);
    rr(ctx, cx - 150, 790, 300, 86, 43);
    ctx.fillStyle = C.orange;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 28px ${FONT}`;
    ctx.fillText('Open', cx, 845);
  }
  return `in${s < 1.2 ? 'ask' : Math.round(p * 50)}`;
};

/** 'dialpad' (hero loop), 'incall', 'credits', 'spin', 'contacts', 'install'. */
export const drawScreenMode = (ctx, mode, t) => {
  switch (mode) {
    case 'incall': {
      const secs = 40 + (t % 60);
      drawInCall(ctx, secs, true);
      return `ic${Math.floor(secs)}`;
    }
    case 'credits':
      return drawCredits(ctx, t);
    case 'spin':
      return drawSpin(ctx, t);
    case 'contacts':
      return drawContacts(ctx, t);
    case 'install':
      return drawInstall(ctx, t);
    default:
      return drawScreen(ctx, t);
  }
};
