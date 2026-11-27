'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type ResilientImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function ResilientImage({ fallbackSrc = '/ollits-logo.png', src, alt = '', onError, ...props }: ResilientImageProps) {
  const initialSrc = typeof src === 'string' ? src : src;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(initialSrc);
    setFailed(false);
  }, [initialSrc]);

  return <Image {...props} src={failed ? fallbackSrc : currentSrc} alt={alt} onError={(event) => { if (!failed) { setFailed(true); } onError?.(event); }} />;
}
