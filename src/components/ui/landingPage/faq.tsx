import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

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
          <Accordion type="single" className="space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-3 text-left font-medium transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-gray-500 dark:text-gray-400">
                To begin your journey with WazobiaCode, simply fill out the
                interest form on our website and we will follow up with you
                regarding registration. For the course, we will use Telegram and{' '}
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
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-3 text-left font-medium transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700">
                Do i need any experience to join the course?
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-gray-500 dark:text-gray-400">
                Our program is designed for complete beginners with no prior
                coding experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-3 text-left font-medium transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700">
                Is this program entirely online?
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-gray-500 dark:text-gray-400">
                Wazobia Code is designed to be as accessible as possible. It is
                completely online with real-time support from teachers and
                designated weekly extra help hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="flex w-full items-center justify-between rounded-md bg-gray-100 px-4 py-3 text-left font-medium transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700">
                What kinds of career opportunities are available after
                completing the program?
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-gray-500 dark:text-gray-400">
                Our curriculum prepares you to become a full-stack developer
                which makes you suitable for roles in web development. By the
                end of the course, you will have projects to add to your
                portfolio in order to become competitive in real world job
                markets.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}
