import { google } from 'googleapis';
import { env } from '@/lib/config';

const gsheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const authClient = new google.auth.GoogleAuth({
  credentials: {
    private_key: env.GOOGLE_PRIVATE_KEY,
    client_email: env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: SCOPES,
});
google.options({ auth: authClient });

export async function appendRow(row: any) {
  // const auth = await getAuthToken()
  const res = await gsheets.spreadsheets.values.append({
    spreadsheetId: env.SHEET_ID,
    range: env.SHEET_NAME,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
  return res;
}
