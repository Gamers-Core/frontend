'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { cn } from '@/lib/utils';
import { Disclosure, useCarousel, useDisclosure, useSearchParams } from '@/hooks';

import { Button } from '../Button';
import { Carousel, CarouselContent, CarouselItem } from '../ui';

interface MediaCarouselProps {
  media: SlideImage[];
  className?: string;
}

export const MediaCarousel = ({ media, className }: MediaCarouselProps) => {
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);

  const variant = useSearchParams().get('variant');

  const { selected, scrollTo, setApi } = useCarousel();
  const lightboxDisclosure = useDisclosure();

  useEffect(() => {
    scrollTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <Carousel
        className={cn('relative flex-1', className)}
        setApi={setApi}
        dir={direction}
        opts={{ direction, loop: true }}
      >
        <CarouselContent>
          {media.map((mediaItem, index) => {
            const isFirst = index === 0;

            return (
              <CarouselItem
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setActiveIndex(index);
                  lightboxDisclosure.onOpen();
                }}
                key={index}
              >
                {mediaItem.type === 'image' ? (
                  <Image
                    {...mediaItem}
                    alt={`Media ${index + 1}`}
                    className="w-full select-none"
                    priority={isFirst}
                    fetchPriority={isFirst ? 'high' : 'auto'}
                    loading={isFirst ? 'eager' : 'lazy'}
                  />
                ) : null}
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center">
          {media.map((_, index) => (
            <Button
              variant="ghost"
              key={index}
              onClick={() => scrollTo(index)}
              className="p-1 size-auto hover:bg-transparent hover:dark:bg-transparent"
            >
              <div
                className={cn('rounded-full size-2.5 bg-muted-foreground/80', {
                  'bg-transparent backdrop-invert-100 ': selected === index,
                })}
              />
            </Button>
          ))}
        </div>
      </Carousel>

      <LightboxCarousel
        {...lightboxDisclosure}
        media={media}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onClose={() => {
          scrollTo(activeIndex);
          lightboxDisclosure.onClose();
        }}
      />
    </>
  );
};

interface LightboxCarouselProps extends Disclosure {
  media: SlideImage[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const LightboxCarousel = ({ media, activeIndex, setActiveIndex, ...disclosure }: LightboxCarouselProps) => (
  <Lightbox
    {...disclosure}
    close={disclosure.onClose}
    index={activeIndex}
    on={{ view: ({ index }) => setActiveIndex(index) }}
    controller={{ closeOnBackdropClick: true }}
    slides={media}
    plugins={[Zoom]}
    zoom={{ pinchZoomV4: true, maxZoomPixelRatio: 4 }}
    styles={{ container: { background: 'transparent' } }}
    className="backdrop-blur-xl dark:bg-transparent transition-all duration-300"
    render={{
      iconZoomIn: () => null,
      iconZoomOut: () => null,
      slide: ({ slide }) => <Image {...slide} alt={slide.alt ?? ''} loading="lazy" fetchPriority="auto" />,
    }}
  />
);
