import { sendConfirmationEmail } from '@/lib/sendgrid';
import { APIResponse, APIErrorHandler } from '@/lib/api';
import * as sheets from '@/lib/gsheets';

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { name, email, phone, school, state, start_date, end_date, reason } =
      body;
    const dateSubmitted = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
    });

    const entry = [
      dateSubmitted,
      name,
      email,
      phone,
      school,
      state,
      start_date,
      end_date,
      reason,
    ];

    await sheets.appendRow(entry);

    await sendConfirmationEmail(email, name);

    return APIResponse({
      message: 'Form submitted successfully',
    });
  } catch (error: any) {
    return APIErrorHandler(error);
  }
}
