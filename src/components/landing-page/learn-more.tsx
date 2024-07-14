'use client';

import { Button } from '@/components/ui/button';

export const LearnMore = () => {
  return (
    <Button
      className="bg-accent text-white"
      onClick={() => {
        'use client';
        document
          .getElementById('faq-section')
          ?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      Learn More
    </Button>
  );
};
