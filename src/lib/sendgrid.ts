import sgMail from '@sendgrid/mail';
import { env } from '@/lib/config';

sgMail.setApiKey(env.SENDGRID_API_KEY);

// what is wrong with this code? i get a htmlContent is not defined error.
const getConfirmationMessage = (name: string) => {
  const plainTextContent = `Hello ${name},

Thank you for showing interest in joining our Web Development course! We're super excited to have you on board. We can't wait to start this journey with you from beginner to full-stack developer.

Here's some important information you need to know:
Start date: July 22nd
Duration: 6-8 weeks
Where: 100% online (make yourself as comfortable as possible)
How: Through our website and a Telegram group (more details coming soon)
Bonus: Prizes up for grabs! (Who doesn't love winning stuff, right?)

Whether you're just starting out or you've already dipped your toes in the coding pool, this course is designed to level up your skills. We'll take you from "What's HTML?" to "Look at this awesome full-stack website I built!" before you know it.

Keep an eye on your inbox - we'll be sending more info about how to access the course materials as we get closer to the start date.

Remember, every expert was once a beginner. Your journey to becoming a skilled web developer starts here, and we're thrilled to guide you every step of the way.

Best regards,
WazobiaCode`;

  const htmlContent = `
<p>Hello ${name},</p>

<p>Thank you for showing interest in joining our Web Development course! We're super excited to have you on board. We can't wait to start this journey with you from beginner to full-stack developer.</p>

<p>Here's some important information you need to know:</p>
<ul>
  <li><strong>Start date:</strong> July 22nd</li>
  <li><strong>Duration:</strong> 6-8 weeks</li>
  <li><strong>Where:</strong> 100% online (make yourself as comfortable as possible)</li>
  <li><strong>How:</strong> Through our website and a Telegram group (more details coming soon)</li>
  <li><strong>Bonus:</strong> Prizes up for grabs! (Who doesn't love winning stuff, right?)</li>
</ul>

<p>Whether you're just starting out or you've already dipped your toes in the coding pool, this course is designed to level up your skills. We'll take you from "What's HTML?" to "Look at this awesome full-stack website I built!" before you know it.</p>

<p>Keep an eye on your inbox - we'll be sending more info about how to access the course materials as we get closer to the start date.</p>

<p>Remember, every expert was once a beginner. Your journey to becoming a skilled web developer starts here, and we're thrilled to guide you every step of the way.</p>

<p>Best regards,<br>WazobiaCode</p>`;

  return { plainTextContent, htmlContent };
};

export const sendConfirmationEmail = async (email: string, name: string) => {
  const { plainTextContent, htmlContent } = getConfirmationMessage(name);
  const msg = {
    to: email,
    from: {
      email: 'wazobiacode@gmail.com',
      name: 'WazobiaCode',
    },
    subject: 'Welcome to Your Web Development Course!',
    text: plainTextContent,
    html: htmlContent,
  };
  await sgMail.send(msg);
};
