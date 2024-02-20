import React from 'react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface FAQPageProps {
  faqs: FAQ[];
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/faqs');
  const faqs: FAQ[] = await res.json();

  return {
    props: {
      faqs,
    },
  };
}

const FAQPage: React.FC<FAQPageProps> = ({ faqs }) => {
    return (
        <main className="flex flex-col py-12 px-4 md:px-6">
          <div className="w-full max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold">FAQs</h1>
            <ul className="mt-4">
              {faqs.map((faq) => (
                <li key={faq._id} className="mt-2">
                  <h2 className="text-xl font-semibold">{faq.question}</h2>
                  <p className="mt-1">{faq.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </main>
      );
    };
    
    export default FAQPage;