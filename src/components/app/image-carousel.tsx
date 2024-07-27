'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { Dialog, DialogContent } from '@/components/ui/dialog';

export const ImageCarousel = ({ images }: { images: string[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const renderCarousel = (isLarge: boolean) => (
    <Carousel
      setApi={setApi}
      className={`w-full ${isLarge ? 'max-w-3xl' : 'max-w-md'} mx-auto`}
    >
      <CarouselContent>
        {images.map((image, imageIndex) => (
          <CarouselItem key={imageIndex}>
            <div
              className={`flex items-center justify-center md:p-4 px-2 ${
                isLarge ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <Image
                src={image}
                alt={`Step ${imageIndex + 1}`}
                width={1200}
                height={1200}
                className={`${
                  isLarge ? 'w-[800px] h-auto' : 'w-[400px] h-[400px]'
                } object-contain`}
                onClick={isLarge ? undefined : openDialog}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 hover:bg-gray-200 hover:text-black" />
      <CarouselNext className="right-2 hover:bg-gray-200 hover:text-black" />
    </Carousel>
  );

  return (
    <div className="bg-gray-100 rounded-lg">
      {renderCarousel(false)}
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-transparent border-none shadow-none">
          {renderCarousel(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
};
