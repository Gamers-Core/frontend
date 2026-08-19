'use client';

import { useLocale } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import Lightbox, { Slide } from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { cn } from '@/lib/utils';
import type { Media as MediaType } from '@/api';
import { Disclosure, useCarousel, useDisclosure } from '@/hooks';

import { Button } from '../Button';
import { Carousel, CarouselContent, CarouselItem } from '../ui';
import { Media } from '../Media';

type MediaSlide = Slide & {
  media: MediaType;
};

interface MediaCarouselProps {
  media: MediaType[];
  variantExternalId?: string | null;
  className?: string;
}

export const MediaCarousel = ({ media, variantExternalId, className }: MediaCarouselProps) => {
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);

  const { selected, scrollTo, setApi } = useCarousel();
  const lightboxDisclosure = useDisclosure();

  useEffect(() => {
    scrollTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantExternalId]);

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
            const isSelected = index === selected;

            return (
              <CarouselItem
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setActiveIndex(index);
                  lightboxDisclosure.onOpen();
                }}
                key={index}
              >
                <Media
                  isPreview
                  media={mediaItem}
                  alt={`Media ${index + 1}`}
                  className="w-full select-none"
                  priority={isSelected}
                  fetchPriority={isSelected ? 'high' : 'auto'}
                  loading={isSelected ? 'eager' : 'lazy'}
                  quality={100}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {media.length > 1 && (
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
        )}
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
  media: MediaType[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const LightboxCarousel = ({ media, activeIndex, setActiveIndex, ...disclosure }: LightboxCarouselProps) => {
  const slides = useMemo<MediaSlide[]>(
    () => media.map((mediaItem) => ({ ...mediaItem, type: 'image', media: mediaItem })),
    [media],
  );

  return (
    <Lightbox
      {...disclosure}
      close={disclosure.onClose}
      index={activeIndex}
      on={{ view: ({ index }) => setActiveIndex(index) }}
      controller={{ closeOnBackdropClick: true }}
      slides={slides}
      plugins={[Zoom]}
      zoom={{ pinchZoomV4: true, maxZoomPixelRatio: 4 }}
      styles={{ container: { background: 'transparent' } }}
      className="backdrop-blur-xl dark:bg-transparent transition-all duration-300"
      render={{
        iconZoomIn: () => null,
        iconZoomOut: () => null,
        slide: ({ slide }) => (
          <div className="h-auto md:h-[inherit] flex items-center justify-center min-h-0 select-none">
            <Media
              media={(slide as MediaSlide).media}
              loading="lazy"
              fetchPriority="auto"
              className="h-[inherit] w-auto object-contain select-none"
              draggable={false}
              quality={100}
            />
          </div>
        ),
      }}
    />
  );
};
