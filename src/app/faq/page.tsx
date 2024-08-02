import { Metadata } from 'next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { ImageCarousel } from '@/components/app/image-carousel';
import CustomMDX from '@/components/app/custom-mdx';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/ui/footer';

export const metadata: Metadata = {
  title: 'FAQ - WaZoBiaCode Bootcamp',
  description: 'Frequently Asked Questions about WaZoBiaCode Bootcamp',
};

interface FAQItem {
  question: string;
  answer: string;
  images?: string[];
}

const faqs: FAQItem[] = [
  {
    question: 'How do I register for the course on this website?',
    answer: `
To register for the WaZoBiaCode Bootcamp course, please follow these detailed steps:

1. Click on the "Login" button located in the top right corner of this page.
2. On the login page, you have two options:
   a) Sign up using your Google account by clicking the "Continue with Google" button.
   b) Sign up using your email address by clicking "Sign Up" and then entering your email and creating a password.
3. After successful signup or login, you will be automatically redirected to the "Complete Profile" page.
4. On the "Complete Profile" page, enter your full name and the phone number associated with your Telegram account. It's crucial that this phone number matches the one you use for Telegram.
5. Click the "Save" or "Update Profile" button to submit your information.
6. Upon successful profile creation, you'll be redirected to the Student Dashboard. Here, you'll find important links, including one to join the official Telegram channel for the course.

> [warning] Note:
> The phone number you provide during registration must exactly match the number you use for your Telegram account. If there's a mismatch, your registration process may encounter issues or fail entirely.
    `,
    images: [
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/2a383ee4-f63c-4ddd-a7c5-104f7fe8b4fa.png',
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/180bb282-ee84-455b-8bdd-18b8ddc538ad.png',
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/03bfd1f5-ed82-478f-8df5-3d73bbb7bb7c.png',
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/6aeb7c38-b011-4d1d-86f6-4d1d3da04334.png',
    ],
  },
  {
    question: 'How do I join the Telegram groups for the course?',
    answer: `
To join the Telegram groups for the WaZoBiaCode Bootcamp course, please follow these step-by-step instructions:

1. First, join the main Telegram channel for the course. You should find the invitation link on your Student Dashboard after completing your profile registration on the website. You can also join via this direct invite [link](https://t.me/+VNlHL8vau40wYmNh).
2. Once you're in the main channel, you need to register with our [course bot](https://t.me/wazobiacode_bot).
3. Start a conversation with the bot by clicking the "Start" button or sending any message.
4. In the chat with the bot, type and send the command: \`/register\`
5. The bot will respond with a menu. Look for a button that says "Share Phone Number".
6. Tap this button to share your contact information with the bot. This step is crucial as it verifies your identity and links your Telegram account to your course registration.
7. If successful, the bot will confirm your registration and may provide further instructions or automatically add you to the necessary course groups.

> [warning] Note:
> Ensure that the phone number associated with your Telegram account matches the one you used during website registration. If you encounter any issues, please contact our support team for assistance.

    `,
    images: [
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/78786bcc-cb6d-4706-913e-46e0114eace0.png',
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/e37578d9-4100-4c2b-9e4c-54c352ffbcfe.png',
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/109e0952-db7a-441c-84fd-b7db07575447.png',
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/13897d86-f8e7-4e4e-a444-261b6fff21d6.png',
      'https://wazobiacode-web.s3.us-east-1.amazonaws.com/image-bin/b7a53047-3496-493d-92b2-a79d641b86e9.png',
    ],
  },
];

const Page = () => {
  return (
    <>
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <main className="flex-grow bg-background text-foreground overflow-auto space-y-6 py-4 md:p-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center text-primary">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-center mb-12 text-gray-600">
              Find answers to common questions about WaZoBiaCode Bootcamp
            </p>

            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              defaultValue="item-0"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-left font-semibold">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-2 bg-white rounded-lg">
                    <div className="mb-6 prose max-w-none">
                      <CustomMDX source={faq.answer} />
                    </div>
                    {faq.images && faq.images.length > 0 && (
                      <ImageCarousel images={faq.images} />
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Page;
