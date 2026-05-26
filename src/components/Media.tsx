import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import { AudioBook01Icon, File01Icon, FileNotFoundIcon, PlayCircle02FreeIcons } from '@hugeicons/core-free-icons';

import { type Media as MediaFile, MediaType } from '@/api';
import { cn } from '@/lib/utils';

import { Image } from './Image';

interface MediaProps<T extends MediaType> {
  media: MediaFile<T> | null;
  alt?: string;
  isPreview?: boolean;
  className?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'auto';
  loading?: 'eager' | 'lazy';
  quality?: number;
  draggable?: boolean;
}

export const Media = <T extends MediaType>({
  media,
  alt,
  isPreview = false,
  className,
  priority,
  fetchPriority,
  loading,
  quality,
  draggable = true,
}: MediaProps<T>) => {
  if (!media?.type) return <MediaPlaceholder className={className} icon={FileNotFoundIcon} />;

  switch (media.type) {
    case 'image':
      return (
        <Image
          image={media as MediaFile<'image'>}
          alt={alt}
          className={cn(className, { 'pointer-events-none select-none': draggable === false })}
          priority={priority}
          fetchPriority={fetchPriority}
          loading={loading}
          draggable={draggable}
          quality={quality}
        />
      );

    case 'video':
      if (isPreview)
        return (
          <>
            <video src={media.src} className={cn('w-full', className)} />

            <p className="absolute text-xl">
              <HugeiconsIcon icon={PlayCircle02FreeIcons} className="size-16 invert-50" />
            </p>
          </>
        );

      return (
        <video
          src={media.src}
          muted
          playsInline
          controls
          autoPlay
          loop
          className={cn('select-none', className)}
          draggable={draggable}
        />
      );

    case 'audio':
      return (
        <MediaPlaceholder
          className={cn(className, { 'pointer-events-none select-none': draggable === false })}
          icon={AudioBook01Icon}
        />
      );
    case 'raw':
      return (
        <MediaPlaceholder
          className={cn(className, { 'pointer-events-none select-none': draggable === false })}
          icon={File01Icon}
        />
      );
    default:
      return null;
  }
};

interface MediaPlaceholderProps {
  icon: IconSvgElement;
  className?: string;
}

const MediaPlaceholder = ({ icon, className }: MediaPlaceholderProps) => (
  <div className={cn('flex items-center justify-center bg-muted rounded-md', className)}>
    <HugeiconsIcon icon={icon} className="size-8 text-muted-foreground" />
  </div>
);
