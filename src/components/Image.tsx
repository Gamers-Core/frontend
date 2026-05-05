import NextImage from 'next/image';

import { Media } from '@/api';

type NextImageProps = React.ComponentProps<typeof NextImage>;

interface ImageMedia {
  image: Media<'image'> | null;
}

type ImageSrc = {
  src: string | null;
} & (
  | {
      width: number;
      height: number;
    }
  | {
      fill: true;
    }
);

export type ImageProps<T extends Media<'image'> | string | null> = Omit<
  NextImageProps,
  'src' | 'alt' | 'width' | 'height' | 'fill'
> & {
  alt?: string | null;
} & (T extends Media<'image'> | null ? ImageMedia : ImageSrc);

export const Image = <T extends Media<'image'> | string | null>(props: ImageProps<T>) => {
  const isStringSrc = 'src' in props;
  const hasDimensions = 'width' in props && 'height' in props;
  const hasFill = 'fill' in props && props.fill;

  return (
    <NextImage
      placeholder="blur"
      blurDataURL="/assets/placeholder.svg"
      {...props}
      src={(isStringSrc ? props.src : props.image?.src) ?? '/assets/placeholder.svg'}
      alt={props.alt ?? ''}
      width={isStringSrc ? (hasDimensions ? props.width : undefined) : (props.image?.width ?? 600)}
      height={isStringSrc ? (hasDimensions ? props.height : undefined) : (props.image?.height ?? 400)}
      fill={(isStringSrc && hasFill && props.fill) ?? false}
    />
  );
};
