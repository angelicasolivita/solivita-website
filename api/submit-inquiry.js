// Vercel serverless function — receives Get in Touch form submissions
// and writes a row to Google Sheets via a service account.
//
// SETUP REQUIRED before this works — see GOOGLE-SHEETS-API-SETUP.md:
//   1. Create a Google Cloud service account, enable the Sheets API,
//      generate a JSON key, and share the target Sheet with the
//      service account's email.
//   2. Set these environment variables in Vercel project settings
//      (Settings > Environment Variables), never committed to git:
//        GOOGLE_SERVICE_ACCOUNT_EMAIL
//        GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY  (paste with \n line breaks intact)
//        GOOGLE_SHEET_ID
//   3. npm install googleapis
//
// Until those are set, this endpoint returns 501 so the frontend fails
// gracefully instead of silently dropping submissions.

const REQUIRED_ENV = [
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
  'GOOGLE_SHEET_ID',
];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error('submit-inquiry: missing env vars', missing);
    res.status(501).json({
      error: 'Sheets backend not configured yet',
      missing,
    });
    return;
  }

  const { google } = require('googleapis');

  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  const body = req.body || {};
  const row = [
    new Date().toISOString(),
    body.firstName || '',
    body.lastName || '',
    body.phone || '',
    body.email || '',
    body.relationship || '',
    body.reason || '',
    body.timeframe || '',
    body.referral || '',
    body.referral === 'Other' ? (body.referralOther || '') : '',
    body.message || '',
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit-inquiry: Sheets append failed', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
};
