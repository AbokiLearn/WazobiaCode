import * as sheets from './sheets';

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

    return Response.json({
      status: 200,
      message: 'Form submitted successfully',
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({
      status: 500,
      message: 'Error processing form data',
      error: error.message,
    });
  }
}
