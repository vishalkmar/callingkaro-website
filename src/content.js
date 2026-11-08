// Every word on the page lives here, so the page, the FAQ schema and llms.txt never disagree.
// Keep claims true to the app: credits are paid or earned, calls are not "unlimited free".

export const SITE = {
  name: 'CallKaro',
  url: (import.meta.env.VITE_SITE_URL || 'https://callkaro.in').replace(/\/$/, ''),
  apkUrl: import.meta.env.VITE_APK_URL || '/downloads/CallKaro.apk',
  apkVersion: '1.0.0',
  apkSize: '65 MB',
  minAndroid: 'Android 7.0+',
  supportEmail: 'support@callkaro.in',
  privacyUrl: 'https://callkaro-backend.onrender.com/legal/privacy',
  termsUrl: 'https://callkaro-backend.onrender.com/legal/terms',
};

export const NAV = [
  { id: 'features', label: 'Features' },
  { id: 'credits', label: 'Credits' },
  { id: 'rewards', label: 'Free credits' },
  { id: 'safety', label: 'Privacy' },
  { id: 'install', label: 'Install' },
  { id: 'faq', label: 'FAQ' },
];

export const HERO = {
  eyebrow: 'Internet calling app for India',
  title: ['Call any Indian number', 'over the internet.'],
  hindi: 'Internet se calling karo - kisi bhi mobile ya landline number pe.',
  text:
    'CallKaro turns Wi-Fi or mobile data into a normal phone call. The person you call does not need the app - their phone simply rings. Pay per second with credits you buy or earn.',
  points: ['Jio, Airtel, Vi, BSNL & landlines', 'Per-second billing', 'Unanswered calls cost nothing'],
};

export const STATS = [
  { value: '1 sec', label: 'billing step - never rounded up to a minute' },
  { value: '0', label: 'credits for busy, failed or unanswered calls' },
  { value: '4', label: 'ways to get credits: packs, ads, daily spin, welcome bonus' },
  { value: '2', label: 'languages in the app: English & Hindi' },
];

export const FEATURES = [
  {
    icon: 'dial',
    title: 'Real calls to real numbers',
    text: 'Dial any Indian mobile or landline. The other person gets a normal call on their SIM - no app, no internet needed on their side.',
  },
  {
    icon: 'wifi',
    title: 'Works on Wi-Fi, 4G and 5G',
    text: 'Call from places with weak mobile signal but good internet - basements, offices, hostels, travel Wi-Fi.',
  },
  {
    icon: 'coin',
    title: 'Pay only for talk time',
    text: '1000 credits = 1 minute, charged per second. A 2 min 15 sec call costs 2,250 credits. No answer, busy or failed = free.',
  },
  {
    icon: 'gift',
    title: 'Earn free credits',
    text: 'Watch a short rewarded video, spin the daily wheel or claim the welcome bonus. Paid credits never expire.',
  },
  {
    icon: 'shield',
    title: 'Private by design',
    text: 'Your contacts stay on your phone and are never uploaded. Login is a one-time code sent to your email - no password to leak.',
  },
  {
    icon: 'controls',
    title: 'Everything a call needs',
    text: 'Mute, hold, speaker, Bluetooth, keypad for IVR menus, call notes and a full Recent calls history with the exact charge.',
  },
];

export const STEPS = [
  { n: '01', title: 'Download & sign in', text: 'Install the APK, enter your email and type the 6-digit code. No SIM verification, no password.' },
  { n: '02', title: 'Get credits', text: 'Start with the welcome bonus, then earn more from rewarded videos and the daily spin - or buy a minute pack.' },
  { n: '03', title: 'Dial & talk', text: 'Type a number or pick a contact and tap call. You see the live timer and the minutes left on screen.' },
];

export const CREDIT_WAYS = [
  { title: 'Minute packs', text: 'Buy once, use any time. Paid credits do not expire.', tag: 'Paid' },
  { title: 'Rewarded videos', text: 'Watch a short ad, get credits straight into your wallet.', tag: 'Free' },
  { title: 'Daily spin wheel', text: 'One free spin every day for bonus credits.', tag: 'Free' },
  { title: 'Welcome bonus', text: 'Credits on your first login to try your first call.', tag: 'Free' },
];

export const CREDIT_EXAMPLES = [
  { talk: '45 sec', credits: '750' },
  { talk: '1 min', credits: '1,000' },
  { talk: '2 min 15 sec', credits: '2,250' },
  { talk: 'Not answered', credits: '0' },
];

export const SAFETY = [
  { title: 'Contacts never leave your phone', text: 'The app reads them on the device only to let you pick a number.' },
  { title: 'Emergency numbers stay on your dialer', text: '112, 100, 108 and short codes are blocked in the app - use your phone dialer for emergencies.' },
  { title: 'Anti-misuse rules', text: 'Daily limits, report-a-number and do-not-call opt-outs keep the network clean for everyone.' },
  { title: 'Delete anytime', text: 'Delete your account from Settings - your profile is removed as the Privacy Policy describes.' },
];

export const INSTALL_STEPS = [
  'Tap "Download APK" on this page and open the downloaded file.',
  'If Android asks, allow "Install unknown apps" for your browser or file manager.',
  'Tap Install, then Open. Sign in with your email code.',
  'Allow microphone (needed to talk) - contacts and notifications are optional.',
];

export const FAQ = [
  {
    q: 'What is CallKaro?',
    a: 'CallKaro is an Android app that lets you call any Indian mobile or landline number over the internet (Wi-Fi or mobile data). The person you call receives a normal phone call and does not need the app.',
  },
  {
    q: 'Is CallKaro free?',
    a: 'Calls use credits. You can earn credits free by watching rewarded videos, the daily spin wheel and the welcome bonus, or buy minute packs. 1000 credits = 1 minute, billed per second. Calls that are not answered, busy or failed cost nothing.',
  },
  {
    q: 'Why is it an APK and not on the Play Store?',
    a: 'CallKaro is distributed directly from this website for now. Download the APK, allow installs from your browser once, and install it like any app. A Play Store release is planned.',
  },
  {
    q: 'Is the APK safe to install?',
    a: 'Only download it from this official website. The app is signed by CallKaro, asks only for the permissions it needs (microphone to talk; contacts and notifications are optional) and never uploads your contacts.',
  },
  {
    q: 'Which numbers can I call?',
    a: 'Any Indian mobile number (Jio, Airtel, Vi, BSNL and others) and Indian landlines. Emergency numbers and short codes must be dialled from your phone dialer.',
  },
  {
    q: 'How much internet data does a call use?',
    a: 'A voice call uses a small amount of data - roughly what a WhatsApp voice call uses. A stable 4G, 5G or Wi-Fi connection gives the best sound.',
  },
  {
    q: 'What number does the other person see?',
    a: 'They see a CallKaro caller number, not your SIM number. If they call it back, they hear who we are and can opt out of calls.',
  },
  {
    q: 'Do I need a SIM card?',
    a: 'You need an internet connection and an email address to sign in. Calls go over the internet, so the app itself does not use your SIM minutes.',
  },
];

export const KEYWORDS = [
  'internet calling app India',
  'call any Indian number online',
  'Wi-Fi calling app India',
  'free calling app India',
  'call mobile number from internet',
  'VoIP calling app India',
  'call landline from app',
  'call Jio Airtel Vi BSNL numbers online',
  'internet se call kaise kare',
  'free call karne wala app',
  'online calling app Hindi',
  'CallKaro APK download',
  'calling app APK download',
  'per second billing calling app',
  'low cost calling app India',
];

/**
 * The scroll story below the hero. The one 3D phone flies to each chapter's empty side, turns to that
 * chapter's angle (rot = x,y,z degrees) and shows that chapter's screen; `prop` is the 3D object beside it.
 */
export const STORY = [
  {
    id: 'features',
    textSide: 'right',
    screen: 'incall',
    prop: 'waves',
    rot: '6,32,-4',
    kicker: 'What CallKaro does',
    title: 'A real phone call, carried by your internet.',
    hindi: 'इंटरनेट से असली कॉल',
    lead: 'The person you call does not need the app or internet. Their phone rings like any other call.',
    items: [FEATURES[0], FEATURES[1], FEATURES[5]],
  },
  {
    id: 'credits',
    textSide: 'left',
    screen: 'credits',
    prop: 'coins',
    rot: '-4,-30,6',
    kicker: 'Credits, simply',
    title: 'Pay for the seconds you talk. Nothing else.',
    hindi: 'जितनी बात, उतना ही खर्च',
    lead: 'Credits are the only thing a call uses - billed per second, never rounded up to a minute.',
    items: [FEATURES[2]],
  },
  {
    id: 'rewards',
    textSide: 'right',
    screen: 'spin',
    prop: 'gift',
    rot: '8,26,8',
    kicker: 'Free credits',
    title: 'Spin, watch, win - credits every day.',
    hindi: 'रोज़ फ्री क्रेडिट्स',
    lead: 'Not ready to buy? Earn credits for free and keep calling. Paid credits never expire.',
    items: [FEATURES[3]],
  },
  {
    id: 'safety',
    textSide: 'left',
    screen: 'contacts',
    prop: 'shield',
    rot: '-6,-24,-6',
    kicker: 'Safe & private',
    title: 'Your contacts never leave your phone.',
    hindi: 'आपका डेटा, आपके पास',
    lead: 'Built for trust: login is a one-time code to your email - no password to leak - and clear rules against misuse.',
    items: [],
  },
  {
    id: 'install',
    textSide: 'right',
    screen: 'install',
    prop: 'download',
    rot: '4,30,0',
    kicker: 'How it works',
    title: 'Installed in under a minute.',
    hindi: 'डाउनलोड करो, कॉल करो',
    lead: 'CallKaro is not on the Play Store yet - install it straight from this page.',
    items: [],
  },
];
