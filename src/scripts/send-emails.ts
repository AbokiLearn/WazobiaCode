const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const csv = require('csv-parser');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = 'wazobiacode@gmail.com';
const FROM_NAME = 'WazobiaCode';

const SUBJECT =
  'Welcome to the WazobiaCode Fullstack Web Development Bootcamp - Important Information';

const SENDER_NAME = 'Tony Okeke';
const SENDER_ORGANIZATION = 'WazobiaCode';

function generateEmailBody(studentName: string) {
  return `
<p>Dear ${studentName.trim()},</p>

<p>Congratulations on registering for our Fullstack Web Development Bootcamp! We're thrilled to have you join us on this exciting journey. Here's some crucial information to get you started:</p>

<ol>
  <li>
    <strong>Class Schedule:</strong>
    <ul>
      <li>Classes begin on Friday, July 26th</li>
      <li>Weekly schedule: Friday, Saturday, and Sunday</li>
      <li>Time: 5:00 PM to 7:00 PM</li>
    </ul>
  </li>
  <li>
    <strong>Class Format:</strong>
    <ul>
      <li>All classes will be held via Telegram calls</li>
    </ul>
  </li>
  <li>
    <strong>Required Accounts:</strong> Each student needs to have their own individual accounts. Please create the following free accounts over the next couple of days:
    <ul>
      <li><a href="https://telegram.org/">Telegram</a> (for class sessions)</li>
      <li><a href="https://replit.com/">Replit</a> (for coding exercises)</li>
    </ul>
  </li>
  <li>
    <strong>Course Registration:</strong>
    <ul>
      <li>In the coming week, you'll receive links to complete your registration on our website</li>
      <li>You'll need to provide your Telegram phone number to finalize your registration</li>
    </ul>
  </li>
</ol>

<p>We're excited to embark on this learning journey with you! If you have any questions, please don't hesitate to reach out.</p>

<p>
  Best regards,<br>
  ${SENDER_NAME}<br>
  ${SENDER_ORGANIZATION}
</p>
`;
}

// Function to send email
async function sendEmail(to: string, name: string) {
  const msg = {
    to: to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: SUBJECT,
    html: generateEmailBody(name),
  };

  sgMail.send(msg).catch((error: any) => {
    console.error(`Error sending email to ${to}:`, error);
  });
}

// Main function
async function main() {
  const students: { Name: string; Email: string }[] = [];

  fs.createReadStream(__dirname + '/data/interested-student-list.csv')
    .pipe(csv())
    .on('data', (row: { Name: string; Email: string }) => {
      students.push(row);
    })
    .on('end', async () => {
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        await sendEmail(student.Email, student.Name);
        console.log(
          `Email sent to ${student.Name} (${i + 1}/${students.length})`,
        );
        if (i % 10 === 0) {
          console.log(`Waiting for 5 seconds before sending the next batch...`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    });
}

// Run the script
main().catch(console.error);
