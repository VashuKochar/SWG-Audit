/**
 * Verify Google reCAPTCHA token server-side.
 * Uses built-in https to avoid extra dependencies.
 */
const https = require('https');

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

function verifyRecaptcha(token, secretKey) {
  return new Promise((resolve, reject) => {
    if (!token || !secretKey) {
      resolve({ success: false });
      return;
    }
    const body = `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`;
    const req = https.request(
      RECAPTCHA_VERIFY_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch {
            resolve({ success: false });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = { verifyRecaptcha };
