import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I get started?',
    answer: (
      <>
        To begin your journey with WazobiaCode, simply fill out the interest
        form below and we will follow up with you regarding registration. For
        the course, we will use Telegram and{' '}
        <a
          href="https://replit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {' '}
          Replit
        </a>
        .
      </>
    ),
  },
  {
    question: 'Do i need any experience to join the course?',
    answer:
      'Our program is designed for complete beginners with no prior coding experience.',
  },
  {
    question: 'Is this program entirely online?',
    answer:
      'Wazobia Code is designed to be as accessible as possible. It is completely online with real-time support from teachers and designated weekly extra help hours.',
  },
  {
    question:
      'What kinds of career opportunities are available after completing the program?',
    answer:
      'Our curriculum prepares you to become a full-stack developer which makes you suitable for roles in web development. By the end of the course, you will have projects to add to your portfolio in order to become competitive in real world job markets.',
  },
  {
    question: 'How long is the program?',
    answer:
      'The program lasts for approximately 6 weeks, starting Friday, July 26th 2024.',
  },
  {
    question: 'What should students expect after they fill out the form?',
    answer:
      'Students who fill out the interest form will receive an email from us with the next steps as we approach the start date of the course.',
  },
  {
    question: 'How many students are in the first cohort?',
    answer:
      'We are accepting students on a first-come, first-served basis. Students who fill out the interest form will receive a URL giving them priority for registration. Registration for the first cohort this summer is capped at 100 students.',
  },
];

export default function LandingFAQ({ id }: { id: string }) {
  return (
    <>
      <div className="container px-4 md:px-6" id={id}>
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Get answers to our most commonly asked questions
          </p>
        </div>
        <div className="mx-auto max-w-3xl pt-8">
          <Accordion type="single" className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="border-0"
              >
                <AccordionTrigger className="flex w-full items-center border-0 justify-between rounded-md bg-gray-100 px-6 py-4 text-left font-medium transition-colors hover:bg-gray-200  dark:bg-gray-800 dark:hover:bg-gray-700">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
