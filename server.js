/**
 * SWG Audit - Node.js server
 * Port 3000, verification gate, static files, simulation routes.
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const JSZip = require('jszip');
const { verifyRecaptcha } = require('./lib/verify');
const { EICAR } = require('./lib/eicar');

const app = express();
const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const TEMP_DIR = path.join(__dirname, 'temp');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-min-32-characters-long';
const SKIP_VERIFY = process.env.SKIP_VERIFY === '1' || process.env.SKIP_VERIFY === 'true';
const COOKIE_NAME = 'swg_session';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const MAX_UPLOAD_BYTES = 1024; // 1 KB
const MAX_UPLOADS_PER_SESSION = 5;
const UPLOAD_DELETE_MS = 10 * 60 * 1000; // 10 minutes

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const uploadCountBySession = new Map();

app.use(cookieParser(SESSION_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_DIR));

function getSessionId(req) {
  return req.signedCookies && req.signedCookies[COOKIE_NAME];
}

function isVerified(req) {
  if (SKIP_VERIFY) return true;
  return !!getSessionId(req);
}

function requireVerified(req, res, next) {
  if (isVerified(req)) return next();
  res.redirect(302, '/');
}

// Allow GET to simulation pages so unverified users see the gate in the simulation box.
// POST and other methods to simulation routes still require verification (enforced per-route where needed).
const simulationPaths = ['/phishing', '/malware', '/data-theft', '/cyberslacking'];
app.use((req, res, next) => {
  const isSimulation = simulationPaths.some((p) => req.path === p || req.path.startsWith(p + '/'));
  if (isSimulation && !isVerified(req) && req.method !== 'GET') {
    return res.redirect(302, '/?session_expired=1');
  }
  next();
});

// API: session status (for simulation pages to show gate vs content)
app.get('/api/session', (req, res) => {
  res.json({ verified: isVerified(req) });
});

// API: client config (e.g. reCAPTCHA site key for gate on level pages; skipVerify for dev)
app.get('/api/config', (req, res) => {
  res.json({
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || '',
    skipVerify: SKIP_VERIFY,
  });
});

// Verification gate: POST with reCAPTCHA token and business email
app.post('/verify', async (req, res) => {
  const { 'g-recaptcha-response': token, email, returnUrl } = req.body;
  const emailTrimmed = typeof email === 'string' ? email.trim() : '';

  if (!SKIP_VERIFY) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const result = await verifyRecaptcha(token, secret);
    if (!result.success) {
      res.redirect(302, '/?error=captcha');
      return;
    }
  }

  if (!emailTrimmed) {
    res.redirect(302, '/?error=email');
    return;
  }

  const sessionId = crypto.randomBytes(16).toString('hex');
  res.cookie(COOKIE_NAME, sessionId, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  // Redirect back to level page if returnUrl is a safe path (same-origin path only)
  const pathOnly = typeof returnUrl === 'string' ? returnUrl.trim().split('?')[0] : '';
  const safeReturn = pathOnly && pathOnly.startsWith('/') && !pathOnly.startsWith('//') ? pathOnly : '/';
  res.redirect(302, safeReturn);
});

// Phishing L3: credential form POST – discard body immediately, never log or store
app.post('/phishing/submit', (req, res) => {
  // Discard body; do not log or store credentials
  res.status(200).json({ ok: true, message: 'received' });
});

// Malware L1: EICAR plain file
app.get('/malware/eicar.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="EICAR.txt"');
  res.send(EICAR);
});

// Malware L1: EICAR inside ZIP (built once, cached)
let eicarZipBuffer = null;
app.get('/malware/eicar.zip', (req, res) => {
  const sendZip = (buf) => {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="EICAR.zip"');
    res.send(buf);
  };
  if (eicarZipBuffer) {
    sendZip(eicarZipBuffer);
    return;
  }
  const zip = new JSZip();
  zip.file('EICAR.txt', EICAR);
  zip.generateAsync({ type: 'nodebuffer' }).then((buf) => {
    eicarZipBuffer = buf;
    sendZip(buf);
  }).catch((err) => {
    res.status(500).send('Error generating zip');
  });
});

// Data-theft: file upload (L1/L2), max 1 KB, max 5 per session; stored in uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const sid = getSessionId(req) || 'anon';
    const name = `${sid}-${Date.now()}-${(file.originalname || 'file').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

app.get('/data-theft/uploads/:filename', (req, res) => {
  const raw = req.params.filename;
  const safe = path.basename(raw);
  if (safe !== raw || !safe.length) {
    res.status(400).send('Invalid filename');
    return;
  }
  const filePath = path.join(UPLOAD_DIR, safe);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.status(404).send('Not found');
    return;
  }
  res.sendFile(safe, { root: UPLOAD_DIR, dotfiles: 'deny' }, (err) => {
    if (err && !res.headersSent) res.status(500).send('Error sending file');
  });
});

app.post('/data-theft/upload', (req, res, next) => {
  const sessionId = getSessionId(req);
  const count = uploadCountBySession.get(sessionId) || 0;
  if (count >= MAX_UPLOADS_PER_SESSION) {
    res.status(400).json({ error: 'Max uploads per session (5) reached' });
    return;
  }
  next();
}, upload.single('file'), (err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'File size exceeds limit (max 1 KB)' });
    return;
  }
  if (err) return next(err);
  next();
}, (req, res) => {
  const sessionId = getSessionId(req);
  const count = (uploadCountBySession.get(sessionId) || 0) + 1;
  uploadCountBySession.set(sessionId, count);

  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const filePath = path.join(UPLOAD_DIR, file.filename);
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (_) {}
  }, UPLOAD_DELETE_MS);
  const url = '/data-theft/uploads/' + encodeURIComponent(file.filename);
  res.status(200).json({ ok: true, message: 'File stored. Deleted from server after 10 minutes.', url });
});

// Data-theft L3: DNS tunneling simulation – client sends payload via query; if we receive it, perimeter failed
app.get('/data-theft/exfil', (req, res) => {
  const payload = req.query.data || req.query.q;
  res.status(200).json({ ok: true, message: 'Data received (simulated exfil). If you see this, perimeter did not block DNS-style exfil.' });
});

// Malware L2: chunked delivery – two chunks that client assembles
app.get('/malware/chunk/1', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(EICAR.slice(0, 34));
});
app.get('/malware/chunk/2', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(EICAR.slice(34));
});

// Home: inject RECAPTCHA_SITE_KEY for the gate
let indexHtmlCache = null;
app.get('/', (req, res) => {
  if (!indexHtmlCache) {
    const file = path.join(PUBLIC_DIR, 'index.html');
    indexHtmlCache = fs.readFileSync(file, 'utf8').replace(
      'RECAPTCHA_SITE_KEY_PLACEHOLDER',
      process.env.RECAPTCHA_SITE_KEY || ''
    );
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(indexHtmlCache);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`SWG Audit running at http://localhost:${PORT}`);
});
