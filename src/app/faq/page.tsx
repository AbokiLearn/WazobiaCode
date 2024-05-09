'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/faqs').then((response) => {
      setFaqs(response.data.faqs);
    });
  }, []);

  return (
    <main className="flex flex-col py-12 px-4 md:px-6">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">FAQs</h1>
        <ol className="mt-4">
          {faqs?.map((faq, index) => (
            <li key={faq._id} className="mt-2">
              <h2 className="text-xl font-bold">{`${index + 1}. ${
                faq.question
              }?`}</h2>
              <p className="mt-1">{faq.answer}</p>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
};

export default FAQPage;
